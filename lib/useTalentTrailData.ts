"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/useAuth";
import type {
  CareerResult,
  CareerTwinPath,
  ExtractedResumeProfile,
  InterviewQuestion,
  Mission,
  ResumeFeedback,
  RoadmapResult
} from "@/lib/types";

export interface AgentRun {
  id: string;
  agent_name: string;
  status: "pending" | "running" | "completed" | "failed";
  output: unknown;
  error_message?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  type: string;
  read_at?: string | null;
  created_at: string;
}

export interface SavedJob {
  id: string;
  job_title: string;
  company?: string | null;
  location?: string | null;
  url: string;
  source?: string | null;
  match_score?: number | null;
  created_at: string;
}

export interface ProofItem {
  id: string;
  mission_id?: string | null;
  title: string;
  proof_type: string;
  proof_url?: string | null;
  file_path?: string | null;
  review_status: string;
  review?: unknown;
  created_at: string;
}

export interface MissionRow extends Mission {
  id: string;
  week_number: number;
  day_number: number;
  skill_focus?: string | null;
  estimated_time?: string | null;
  proof_required?: string | null;
  expected_output?: string | null;
  status: "pending" | "in_progress" | "submitted" | "reviewed" | "completed";
}

export interface ResumeAnalysisRow {
  id: string;
  extracted_profile: ExtractedResumeProfile;
  editable_profile: Record<string, unknown>;
  career_result: CareerResult;
  roadmap: RoadmapResult;
  missions: Mission[];
  resume_feedback: ResumeFeedback[];
  interview_questions: InterviewQuestion[];
  career_twin: CareerTwinPath[];
  job_search_links: unknown[];
  created_at: string;
  updated_at?: string;
}

export function useTalentTrailData() {
  const { user, supabase, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<ResumeAnalysisRow | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [missionRows, setMissionRows] = useState<MissionRow[]>([]);
  const [proofItems, setProofItems] = useState<ProofItem[]>([]);
  const [resumeFeedback, setResumeFeedback] = useState<ResumeFeedback[]>([]);
  const [interviewCount, setInterviewCount] = useState(0);
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [agentRuns, setAgentRuns] = useState<AgentRun[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const refresh = useCallback(async () => {
    if (!supabase || !user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const [
      analysisResult,
      missionsResult,
      proofResult,
      feedbackResult,
      interviewResult,
      jobsResult,
      runsResult,
      notificationsResult
    ] = await Promise.all([
      supabase
        .from("resume_analyses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("missions")
        .select("*")
        .eq("user_id", user.id)
        .order("day_number", { ascending: true }),
      supabase
        .from("proof_items")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("resume_feedback")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("interview_sessions")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase
        .from("saved_jobs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("agent_runs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(12),
      supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20)
    ]);

    const latestAnalysis = (analysisResult.data ?? null) as ResumeAnalysisRow | null;
    const missionData = (missionsResult.data as MissionRow[] | null) ?? [];

    setAnalysis(latestAnalysis);
    setMissionRows(missionData);
    setMissions(
      missionData.length
        ? missionData
        : latestAnalysis?.missions ?? []
    );
    setProofItems((proofResult.data as ProofItem[] | null) ?? []);
    setResumeFeedback(
      ((feedbackResult.data as Array<{ feedback: ResumeFeedback }> | null) ?? []).map(
        (item) => item.feedback
      )
    );
    setInterviewCount(interviewResult.count ?? 0);
    setSavedJobs((jobsResult.data as SavedJob[] | null) ?? []);
    setAgentRuns((runsResult.data as AgentRun[] | null) ?? []);
    setNotifications((notificationsResult.data as NotificationItem[] | null) ?? []);
    setLoading(false);
  }, [supabase, user]);

  useEffect(() => {
    if (authLoading) return;
    void refresh();
  }, [authLoading, refresh]);

  useEffect(() => {
    if (!supabase || !user) return;

    const tables = [
      "resume_analyses",
      "career_results",
      "roadmaps",
      "missions",
      "proof_items",
      "resume_feedback",
      "interview_sessions",
      "saved_jobs",
      "agent_runs",
      "notifications"
    ];

    const channel = supabase.channel(`talenttrail-dashboard-${user.id}`);
    tables.forEach((table) => {
      channel.on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table,
          filter: `user_id=eq.${user.id}`
        },
        () => {
          void refresh();
        }
      );
    });
    channel.subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [refresh, supabase, user]);

  const stats = useMemo(() => {
    const completedMissions = missionRows.filter((mission) =>
      ["reviewed", "completed"].includes(String(mission.status))
    ).length;
    const missionCount = missionRows.length || missions.length;
    return {
      completedMissions,
      missionCount,
      proofCount: proofItems.length,
      resumeImprovementCount: resumeFeedback.length || analysis?.resume_feedback?.length || 0,
      interviewCount,
      savedJobsCount: savedJobs.length,
      unreadNotifications: notifications.filter((item) => !item.read_at).length
    };
  }, [
    analysis?.resume_feedback?.length,
    interviewCount,
    missionRows,
    missions.length,
    notifications,
    proofItems.length,
    resumeFeedback.length,
    savedJobs.length
  ]);

  return {
    user,
    supabase,
    loading: authLoading || loading,
    analysis,
    missions,
    missionRows,
    proofItems,
    resumeFeedback,
    savedJobs,
    agentRuns,
    notifications,
    stats,
    refresh
  };
}
