export type Priority = "High" | "Medium" | "Low";

export interface StudentProfile {
  name: string;
  degree: string;
  year: string;
  branch: string;
  currentSkills: string;
  targetRole: string;
  timePerDay: string;
  confidenceLevel: string;
  resumeText?: string;
  interests: string;
  learningStyle: string;
}

export interface RecommendedRole {
  role: string;
  match: number;
  reason: string;
  missingSkills: string[];
}

export interface SkillGap {
  skill: string;
  currentLevel: number;
  requiredLevel: number;
  priority: Priority;
  proofProject: string;
}

export interface Mission {
  title: string;
  description: string;
  proofRequired: string;
  estimatedTime: string;
}

export interface CareerResult {
  readinessScore: number;
  careerSummary: string;
  recommendedRoles: RecommendedRole[];
  skillGaps: SkillGap[];
  firstMission: Mission;
  nextSteps: string[];
}

export interface RoadmapDay {
  day: number;
  title: string;
  description: string;
  skill: string;
  proofRequired: string;
  estimatedTime: string;
  difficulty: string;
}

export interface RoadmapWeek {
  week: number;
  theme: string;
  days: RoadmapDay[];
}

export interface RoadmapResult {
  targetRole: string;
  roadmap: RoadmapWeek[];
}

export interface ResumeFeedback {
  originalBullet: string;
  improvedBullet: string;
  scoreBefore: number;
  scoreAfter: number;
  explanation: string;
  tips: string[];
}

export interface InterviewFeedback {
  score: number;
  feedback: string;
  improvementTip: string;
  sampleAnswer: string;
  confidenceAdvice?: string;
}

export interface CareerTwinPath {
  role: string;
  readiness: number;
  difficulty: string;
  missingSkills: string[];
  estimatedTime: string;
  requiredProjects: string[];
  bestNextStep: string;
  riskWarning: string;
  fitReason: string;
}
