export type Priority = "High" | "Medium" | "Low";

export interface EducationItem {
  degree: string;
  institution?: string;
  year?: string;
  branch?: string;
  score?: string;
}

export interface ExperienceItem {
  role: string;
  organization?: string;
  duration?: string;
  bullets: string[];
}

export interface ProjectItem {
  name: string;
  description: string;
  skills: string[];
  proofSignals: string[];
}

export interface CertificationItem {
  name: string;
  issuer?: string;
  year?: string;
}

export interface AchievementItem {
  title: string;
  evidence?: string;
}

export interface ExtractedResumeProfile {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  headline?: string;
  education: EducationItem[];
  skills: string[];
  projects: ProjectItem[];
  experience: ExperienceItem[];
  certifications: CertificationItem[];
  achievements: AchievementItem[];
  resumeConcerns: string[];
}

export interface StudentProfile {
  name?: string;
  degree?: string;
  year?: string;
  branch?: string;
  currentSkills: string;
  targetRole: string;
  timePerDay: string;
  confidenceLevel?: string;
  resumeText: string;
  interests?: string;
  learningStyle?: string;
  extractedResume?: ExtractedResumeProfile;
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
  skill?: string;
  status?: "pending" | "in_progress" | "submitted" | "reviewed" | "completed" | "Not started";
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

export interface InterviewQuestion {
  question: string;
  competency: string;
  whyAsked: string;
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

export interface JobSearchLink {
  title: string;
  platform: string;
  url: string;
  reason: string;
}

export interface ProofReview {
  score: number;
  verdict: string;
  strengths: string[];
  gaps: string[];
  improvements: string[];
  resumeBulletSuggestion: string;
}

export interface ResumeIntelligenceResult {
  analysisId?: string;
  resumeFilePath?: string;
  extractedProfile: ExtractedResumeProfile;
  editableProfile: StudentProfile;
  careerResult: CareerResult;
  roadmap: RoadmapResult;
  missions: Mission[];
  resumeFeedback: ResumeFeedback[];
  interviewQuestions: InterviewQuestion[];
  careerTwin: CareerTwinPath[];
  jobSearchLinks: JobSearchLink[];
}
