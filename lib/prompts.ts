import type { StudentProfile } from "@/lib/types";

const jsonRule =
  "Return valid JSON only. Do not include markdown fences, comments, explanations, invented facts, or trailing commas.";

export function resumeIntelligencePrompt(input: {
  resumeText: string;
  targetRole: string;
  timePerDay: string;
  interests?: string;
  learningStyle?: string;
}) {
  return `${jsonRule}
You are TalentTrail AI, an agentic career mentor for job-ready students.
Analyze only the evidence present in this uploaded resume text and the user's stated goal.
Do not invent employers, metrics, dates, education, projects, certifications, or achievements.
If information is unclear, put it in resumeConcerns or use honest placeholders in resume bullet improvements.

User goal:
${JSON.stringify(
  {
    targetRole: input.targetRole,
    timePerDay: input.timePerDay,
    interests: input.interests,
    learningStyle: input.learningStyle
  },
  null,
  2
)}

Resume text:
${input.resumeText}

Return exactly this JSON shape:
{
  "extractedProfile": {
    "name": string,
    "email": string,
    "phone": string,
    "location": string,
    "headline": string,
    "education": [
      {
        "degree": string,
        "institution": string,
        "year": string,
        "branch": string,
        "score": string
      }
    ],
    "skills": string[],
    "projects": [
      {
        "name": string,
        "description": string,
        "skills": string[],
        "proofSignals": string[]
      }
    ],
    "experience": [
      {
        "role": string,
        "organization": string,
        "duration": string,
        "bullets": string[]
      }
    ],
    "certifications": [
      {
        "name": string,
        "issuer": string,
        "year": string
      }
    ],
    "achievements": [
      {
        "title": string,
        "evidence": string
      }
    ],
    "resumeConcerns": string[]
  },
  "editableProfile": {
    "name": string,
    "degree": string,
    "year": string,
    "branch": string,
    "currentSkills": string,
    "targetRole": string,
    "timePerDay": string,
    "confidenceLevel": string,
    "resumeText": string,
    "interests": string,
    "learningStyle": string
  },
  "careerResult": {
    "readinessScore": number,
    "careerSummary": string,
    "recommendedRoles": [
      {
        "role": string,
        "match": number,
        "reason": string,
        "missingSkills": string[]
      }
    ],
    "skillGaps": [
      {
        "skill": string,
        "currentLevel": number,
        "requiredLevel": number,
        "priority": "High" | "Medium" | "Low",
        "proofProject": string
      }
    ],
    "firstMission": {
      "title": string,
      "description": string,
      "proofRequired": string,
      "estimatedTime": string,
      "skill": string,
      "status": "pending"
    },
    "nextSteps": string[]
  },
  "roadmap": {
    "targetRole": string,
    "roadmap": [
      {
        "week": number,
        "theme": string,
        "days": [
          {
            "day": number,
            "title": string,
            "description": string,
            "skill": string,
            "proofRequired": string,
            "estimatedTime": string,
            "difficulty": string
          }
        ]
      }
    ]
  },
  "missions": [
    {
      "title": string,
      "description": string,
      "proofRequired": string,
      "estimatedTime": string,
      "skill": string,
      "status": "pending"
    }
  ],
  "resumeFeedback": [
    {
      "originalBullet": string,
      "improvedBullet": string,
      "scoreBefore": number,
      "scoreAfter": number,
      "explanation": string,
      "tips": string[]
    }
  ],
  "interviewQuestions": [
    {
      "question": string,
      "competency": string,
      "whyAsked": string
    }
  ],
  "careerTwin": [
    {
      "role": string,
      "readiness": number,
      "difficulty": string,
      "missingSkills": string[],
      "estimatedTime": string,
      "requiredProjects": string[],
      "bestNextStep": string,
      "riskWarning": string,
      "fitReason": string
    }
  ],
  "jobSearchLinks": [
    {
      "title": string,
      "platform": string,
      "url": string,
      "reason": string
    }
  ]
}

Rules:
- Readiness score must be evidence-based from the resume.
- Roadmap must contain 30 days across 4 weeks.
- Job links must be search URLs to real platforms using encoded role/skill/location keywords; do not invent job postings.
- Interview questions must reference skills, projects, or gaps found in the resume.
- ResumeFeedback must improve actual resume bullets from the resume text only.`;
}

export function careerFitAgentPrompt(profile: StudentProfile) {
  return `${jsonRule}
You are TalentTrail AI. Analyze this reviewed resume-derived profile. Use only the supplied evidence.
${JSON.stringify(profile, null, 2)}

Return exactly:
{
  "readinessScore": number,
  "careerSummary": string,
  "recommendedRoles": [
    {
      "role": string,
      "match": number,
      "reason": string,
      "missingSkills": string[]
    }
  ],
  "skillGaps": [
    {
      "skill": string,
      "currentLevel": number,
      "requiredLevel": number,
      "priority": "High" | "Medium" | "Low",
      "proofProject": string
    }
  ],
  "firstMission": {
    "title": string,
    "description": string,
    "proofRequired": string,
    "estimatedTime": string,
    "skill": string,
      "status": "pending"
  },
  "nextSteps": string[]
}`;
}

export function roadmapAgentPrompt(profile: StudentProfile) {
  return `${jsonRule}
Create a 30-day proof-based roadmap from this resume-derived profile. Use the target role, current skills, project evidence, and time per day.
${JSON.stringify(profile, null, 2)}

Return exactly:
{
  "targetRole": string,
  "roadmap": [
    {
      "week": number,
      "theme": string,
      "days": [
        {
          "day": number,
          "title": string,
          "description": string,
          "skill": string,
          "proofRequired": string,
          "estimatedTime": string,
          "difficulty": string
        }
      ]
    }
  ]
}`;
}

export function resumeForgeAgentPrompt(input: {
  bullet: string;
  targetRole: string;
  resumeText?: string;
}) {
  return `${jsonRule}
You are ResumeForge. Improve this resume bullet for the target role using only evidence from the supplied resume.
Do not invent metrics. If a metric is not present, use a bracketed placeholder and explain how to fill it honestly.
${JSON.stringify(input, null, 2)}

Return exactly:
{
  "originalBullet": string,
  "improvedBullet": string,
  "scoreBefore": number,
  "scoreAfter": number,
  "explanation": string,
  "tips": string[]
}`;
}

export function interviewArenaGeneratePrompt(input: {
  targetRole: string;
  resumeText: string;
}) {
  return `${jsonRule}
Generate one realistic interview question for this target role based on the candidate's uploaded resume evidence.
${JSON.stringify(input, null, 2)}
Return exactly: { "question": string }`;
}

export function interviewArenaEvaluatePrompt(input: {
  targetRole: string;
  question: string;
  answer: string;
  resumeText?: string;
}) {
  return `${jsonRule}
Evaluate the student's interview answer against the target role and resume evidence. Be direct, supportive, and specific.
${JSON.stringify(input, null, 2)}
Return exactly:
{
  "score": number,
  "feedback": string,
  "improvementTip": string,
  "sampleAnswer": string,
  "confidenceAdvice": string
}`;
}

export function proofReviewPrompt(input: {
  missionTitle: string;
  missionDescription: string;
  proofText: string;
  targetRole: string;
}) {
  return `${jsonRule}
You are ProofVault Reviewer. Review the uploaded proof-of-work for the mission and target role.
Use only proof content supplied. Do not claim a link, screenshot, or metric exists if it is not visible in the text.
${JSON.stringify(input, null, 2)}

Return exactly:
{
  "score": number,
  "verdict": string,
  "strengths": string[],
  "gaps": string[],
  "improvements": string[],
  "resumeBulletSuggestion": string
}`;
}

export function careerTwinPrompt(profile: StudentProfile) {
  return `${jsonRule}
You are CareerTwin Agent. Compare realistic internship career paths using this resume-derived profile.
Use only supplied skills, projects, education, experience, and corrected user preferences.
${JSON.stringify(profile, null, 2)}

Return exactly:
{
  "paths": [
    {
      "role": string,
      "readiness": number,
      "difficulty": string,
      "missingSkills": string[],
      "estimatedTime": string,
      "requiredProjects": string[],
      "bestNextStep": string,
      "riskWarning": string,
      "fitReason": string
    }
  ]
}`;
}

export function interviewQuestionsPrompt(profile: StudentProfile) {
  return `${jsonRule}
You are InterviewArena Agent. Generate resume-based interview questions for the target role.
Base the questions on actual extracted skills, projects, gaps, roadmap progress, and resume evidence.
${JSON.stringify(profile, null, 2)}

Return exactly:
{
  "questions": [
    {
      "question": string,
      "competency": string,
      "whyAsked": string
    }
  ]
}`;
}
