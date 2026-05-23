import type {
  CareerResult,
  CareerTwinPath,
  InterviewFeedback,
  ResumeFeedback,
  RoadmapResult,
  StudentProfile
} from "@/lib/types";

export const demoProfile: StudentProfile = {
  name: "Riti Prabhakar",
  degree: "CSE - Data Science",
  year: "2nd year",
  branch: "Computer Science and Data Science",
  currentSkills: "Python basics, SQL beginner, HTML, Excel beginner",
  targetRole: "Data Analyst Intern",
  timePerDay: "1 hour/day",
  confidenceLevel: "Medium",
  resumeText: "Made dashboard in Power BI",
  interests: "Data analytics, dashboards, business insights",
  learningStyle: "Project-based learning"
};

export const mockCareerResult: CareerResult = {
  readinessScore: 62,
  careerSummary:
    "Riti has a realistic path toward a Data Analyst Intern role because she already has early exposure to Python, SQL, Excel, and web basics. Her fastest route is to build proof through dashboards, SQL analysis, and clear business storytelling.",
  recommendedRoles: [
    {
      role: "Data Analyst Intern",
      match: 86,
      reason:
        "Strong alignment with her data science degree, current SQL/Python basics, Excel exposure, and dashboard interests.",
      missingSkills: ["Intermediate SQL", "Power BI/Tableau", "EDA storytelling"]
    },
    {
      role: "Business Analyst Intern",
      match: 74,
      reason:
        "Her Excel and business insight interests fit well, but she needs sharper requirement analysis and reporting practice.",
      missingSkills: ["Business metrics", "Documentation", "Stakeholder communication"]
    },
    {
      role: "Frontend Data Dashboard Intern",
      match: 66,
      reason:
        "HTML basics can support dashboard-facing work, but she needs JavaScript and component-level UI practice first.",
      missingSkills: ["JavaScript", "React basics", "Chart libraries"]
    }
  ],
  skillGaps: [
    {
      skill: "SQL joins and aggregation",
      currentLevel: 35,
      requiredLevel: 75,
      priority: "High",
      proofProject: "Analyze a student placement dataset with joins, group-by metrics, and ranked insights."
    },
    {
      skill: "Dashboard storytelling",
      currentLevel: 30,
      requiredLevel: 72,
      priority: "High",
      proofProject: "Build a Power BI dashboard with KPI cards, filters, trend charts, and an insight summary."
    },
    {
      skill: "Python data cleaning",
      currentLevel: 42,
      requiredLevel: 70,
      priority: "Medium",
      proofProject: "Clean a messy CSV and publish before/after data quality notes."
    },
    {
      skill: "Resume proof writing",
      currentLevel: 25,
      requiredLevel: 68,
      priority: "Medium",
      proofProject: "Rewrite two project bullets with tool, action, dataset size placeholder, and outcome."
    }
  ],
  firstMission: {
    title: "Build your first hiring proof dashboard",
    description:
      "Pick a clean public sales or placement dataset, define 4 business questions, and create a one-page dashboard answering them.",
    proofRequired:
      "Screenshot of dashboard, GitHub/Drive link, and a 5-line insight summary with honest metric placeholders where needed.",
    estimatedTime: "60 minutes"
  },
  nextSteps: [
    "Complete one SQL practice set focused on joins and grouped metrics.",
    "Create a simple Power BI or Excel dashboard from a public dataset.",
    "Rewrite one resume bullet with action, tools, scope, and outcome.",
    "Practice one Data Analyst interview question using the STAR format."
  ]
};

export const mockRoadmap: RoadmapResult = {
  targetRole: "Data Analyst Intern",
  roadmap: [
    {
      week: 1,
      theme: "Foundation and direction",
      days: [
        {
          day: 1,
          title: "Define your analyst target",
          description:
            "Write a one-page role brief covering what Data Analyst interns do, tools used, and three internship descriptions you can aim for.",
          skill: "Role clarity",
          proofRequired: "Role brief with three saved job links",
          estimatedTime: "1 hour",
          difficulty: "Easy"
        },
        {
          day: 2,
          title: "SQL basics refresh",
          description:
            "Practice SELECT, WHERE, ORDER BY, LIMIT, and simple filtering on a public dataset.",
          skill: "SQL fundamentals",
          proofRequired: "10 saved SQL queries with comments",
          estimatedTime: "1 hour",
          difficulty: "Easy"
        },
        {
          day: 3,
          title: "Aggregation sprint",
          description:
            "Use COUNT, SUM, AVG, GROUP BY, and HAVING to answer five business questions.",
          skill: "SQL aggregation",
          proofRequired: "Query file plus short insight notes",
          estimatedTime: "1 hour",
          difficulty: "Medium"
        },
        {
          day: 4,
          title: "Excel cleaning lab",
          description:
            "Clean missing values, standardize labels, and create a small pivot table summary.",
          skill: "Excel data cleaning",
          proofRequired: "Before/after spreadsheet screenshots",
          estimatedTime: "1 hour",
          difficulty: "Easy"
        },
        {
          day: 5,
          title: "Python cleanup notebook",
          description:
            "Load a CSV with pandas, inspect columns, clean nulls, and export a cleaned file.",
          skill: "Python data cleaning",
          proofRequired: "Notebook link with comments",
          estimatedTime: "1 hour",
          difficulty: "Medium"
        },
        {
          day: 6,
          title: "Mini insight memo",
          description:
            "Turn one cleaned dataset into five insights written for a non-technical reader.",
          skill: "Business storytelling",
          proofRequired: "One-page insight memo",
          estimatedTime: "1 hour",
          difficulty: "Medium"
        },
        {
          day: 7,
          title: "Weekly proof checkpoint",
          description:
            "Package your SQL, Excel, and Python work into a single folder with a concise README.",
          skill: "Portfolio packaging",
          proofRequired: "GitHub or Drive folder link",
          estimatedTime: "1 hour",
          difficulty: "Easy"
        }
      ]
    },
    {
      week: 2,
      theme: "Dashboard proof",
      days: [
        {
          day: 8,
          title: "Choose dashboard dataset",
          description:
            "Select a dataset with dates, categories, regions, and numeric measures suitable for a dashboard.",
          skill: "Dataset selection",
          proofRequired: "Dataset link and four analysis questions",
          estimatedTime: "1 hour",
          difficulty: "Easy"
        },
        {
          day: 9,
          title: "Sketch KPI layout",
          description:
            "Design a simple dashboard layout with KPI cards, trend chart, category chart, and filter area.",
          skill: "Dashboard planning",
          proofRequired: "Wireframe screenshot or photo",
          estimatedTime: "1 hour",
          difficulty: "Easy"
        },
        {
          day: 10,
          title: "Create first dashboard",
          description:
            "Build a first Power BI, Tableau Public, or Excel dashboard answering two questions.",
          skill: "Dashboard building",
          proofRequired: "Dashboard screenshot",
          estimatedTime: "1 hour",
          difficulty: "Medium"
        },
        {
          day: 11,
          title: "Add filters and drilldowns",
          description:
            "Add slicers or filters that let a reviewer explore by region, product, or time period.",
          skill: "Interactive reporting",
          proofRequired: "Short screen recording or screenshots",
          estimatedTime: "1 hour",
          difficulty: "Medium"
        },
        {
          day: 12,
          title: "Write dashboard insights",
          description:
            "Write five insights and one recommendation using the dashboard findings.",
          skill: "Insight communication",
          proofRequired: "Insight notes attached to the project",
          estimatedTime: "1 hour",
          difficulty: "Medium"
        },
        {
          day: 13,
          title: "Polish visual hierarchy",
          description:
            "Improve labels, titles, spacing, and color consistency so the dashboard looks recruiter-ready.",
          skill: "Visual reporting",
          proofRequired: "Before/after dashboard screenshot",
          estimatedTime: "1 hour",
          difficulty: "Medium"
        },
        {
          day: 14,
          title: "Publish dashboard proof",
          description:
            "Publish the dashboard and write a short README explaining the dataset, questions, tools, and findings.",
          skill: "Portfolio publishing",
          proofRequired: "Public project link",
          estimatedTime: "1 hour",
          difficulty: "Medium"
        }
      ]
    },
    {
      week: 3,
      theme: "Internship-grade project",
      days: [
        {
          day: 15,
          title: "Select capstone problem",
          description:
            "Pick one realistic business problem such as churn, sales drop, placement trends, or customer segments.",
          skill: "Problem framing",
          proofRequired: "Problem statement and success metric",
          estimatedTime: "1 hour",
          difficulty: "Medium"
        },
        {
          day: 16,
          title: "Deep SQL analysis",
          description:
            "Write queries using joins, CASE, date functions, and grouped comparisons.",
          skill: "Intermediate SQL",
          proofRequired: "15-query SQL file",
          estimatedTime: "1 hour",
          difficulty: "Hard"
        },
        {
          day: 17,
          title: "Python exploratory analysis",
          description:
            "Use pandas to explore distributions, missing values, correlations, and outliers.",
          skill: "EDA",
          proofRequired: "Notebook with charts and comments",
          estimatedTime: "1 hour",
          difficulty: "Hard"
        },
        {
          day: 18,
          title: "Create final visuals",
          description:
            "Build charts that directly answer the capstone problem and avoid decorative visuals.",
          skill: "Analytical visualization",
          proofRequired: "Four final charts with captions",
          estimatedTime: "1 hour",
          difficulty: "Medium"
        },
        {
          day: 19,
          title: "Write recommendations",
          description:
            "Convert analysis into three business recommendations with evidence from your data.",
          skill: "Decision support",
          proofRequired: "Recommendation section in README",
          estimatedTime: "1 hour",
          difficulty: "Medium"
        },
        {
          day: 20,
          title: "Package capstone",
          description:
            "Organize notebook, data notes, dashboard, and README into a clean portfolio project.",
          skill: "Portfolio project structure",
          proofRequired: "Repository or Drive folder link",
          estimatedTime: "1 hour",
          difficulty: "Medium"
        },
        {
          day: 21,
          title: "Peer review pass",
          description:
            "Ask one friend or mentor to review the project and note three improvements.",
          skill: "Feedback handling",
          proofRequired: "Review notes and implemented changes",
          estimatedTime: "1 hour",
          difficulty: "Easy"
        }
      ]
    },
    {
      week: 4,
      theme: "Resume, interview, and applications",
      days: [
        {
          day: 22,
          title: "Rewrite project bullets",
          description:
            "Turn weak project lines into honest impact bullets using tool, action, scope, and outcome.",
          skill: "Resume writing",
          proofRequired: "Three before/after bullets",
          estimatedTime: "1 hour",
          difficulty: "Medium"
        },
        {
          day: 23,
          title: "Build one-page resume",
          description:
            "Create a clean one-page student resume emphasizing skills, projects, and proof links.",
          skill: "Resume structure",
          proofRequired: "Resume PDF draft",
          estimatedTime: "1 hour",
          difficulty: "Medium"
        },
        {
          day: 24,
          title: "Practice SQL interview set",
          description:
            "Answer five SQL interview questions and explain your reasoning out loud.",
          skill: "Technical interview",
          proofRequired: "Written answers and notes",
          estimatedTime: "1 hour",
          difficulty: "Medium"
        },
        {
          day: 25,
          title: "Practice analytics case",
          description:
            "Solve one analytics case question using assumptions, metrics, and recommendation structure.",
          skill: "Case thinking",
          proofRequired: "Case answer document",
          estimatedTime: "1 hour",
          difficulty: "Hard"
        },
        {
          day: 26,
          title: "Mock behavioral answer",
          description:
            "Prepare STAR answers for teamwork, learning a new tool, and handling mistakes.",
          skill: "Behavioral interview",
          proofRequired: "Three STAR answers",
          estimatedTime: "1 hour",
          difficulty: "Easy"
        },
        {
          day: 27,
          title: "LinkedIn and GitHub polish",
          description:
            "Update headline, about section, featured project, and GitHub README descriptions.",
          skill: "Online presence",
          proofRequired: "Profile screenshots or links",
          estimatedTime: "1 hour",
          difficulty: "Easy"
        },
        {
          day: 28,
          title: "Application shortlist",
          description:
            "Create a tracker with ten realistic Data Analyst internship opportunities.",
          skill: "Opportunity targeting",
          proofRequired: "Application tracker",
          estimatedTime: "1 hour",
          difficulty: "Easy"
        },
        {
          day: 29,
          title: "Tailor first application",
          description:
            "Tailor resume keywords and write a short outreach message for one target internship.",
          skill: "Application tailoring",
          proofRequired: "Tailored resume copy and outreach draft",
          estimatedTime: "1 hour",
          difficulty: "Medium"
        },
        {
          day: 30,
          title: "Final readiness review",
          description:
            "Review your role clarity, skill proof, resume, interview answers, and next application batch.",
          skill: "Career readiness",
          proofRequired: "Final checklist with links to all proofs",
          estimatedTime: "1 hour",
          difficulty: "Medium"
        }
      ]
    }
  ]
};

export const mockResumeFeedback: ResumeFeedback = {
  originalBullet: "Made dashboard in Power BI",
  improvedBullet:
    "Built an interactive Power BI sales dashboard analyzing [record count] records, tracking revenue trends, top-performing products, and regional performance insights.",
  scoreBefore: 3,
  scoreAfter: 8,
  explanation:
    "The improved bullet is stronger because it names the tool, clarifies the analytical work, and points to business insights without inventing exact metrics.",
  tips: [
    "Replace [record count] with the honest dataset size after checking the file.",
    "Add one real outcome, such as reduced manual reporting time, only if you can prove it.",
    "Link the dashboard screenshot or project repository beside this bullet."
  ]
};

export const mockInterviewQuestion =
  "You are given monthly sales data by region and product category. How would you identify why revenue dropped last month?";

export const mockInterviewFeedback: InterviewFeedback = {
  score: 7,
  feedback:
    "Good structure and a practical approach. To become internship-ready, add clearer assumptions, mention SQL or spreadsheet steps, and finish with the business action you would recommend.",
  improvementTip:
    "Use a 4-part answer: clarify metric, segment the data, compare time periods, then recommend next action.",
  sampleAnswer:
    "I would first confirm whether the drop is in revenue, orders, or average order value. Then I would segment last month versus previous months by region and product category, checking whether the decline came from fewer orders, lower pricing, or one underperforming segment. After identifying the biggest driver, I would validate it with supporting charts and recommend a focused action such as reviewing inventory, campaign performance, or pricing for that segment.",
  confidenceAdvice:
    "Speak slowly, define the metric first, and narrate your reasoning like you are guiding a teammate through the analysis."
};

export const careerTwinPaths: CareerTwinPath[] = [
  {
    role: "Data Analyst Intern",
    readiness: 72,
    difficulty: "Moderate",
    missingSkills: ["Intermediate SQL", "Power BI dashboarding", "Business storytelling"],
    estimatedTime: "4-6 weeks",
    requiredProjects: [
      "Sales or placement dashboard",
      "SQL analysis case study",
      "Python cleaning notebook"
    ],
    bestNextStep: "Build one dashboard project and rewrite the project bullet with honest proof.",
    riskWarning:
      "Do not apply with only course certificates. Recruiters need to see analysis output and clear insight writing.",
    fitReason:
      "This is the most realistic path now because the current skills already point toward analytics foundations."
  },
  {
    role: "Frontend Developer Intern",
    readiness: 48,
    difficulty: "Moderate to hard",
    missingSkills: ["JavaScript", "React", "Responsive UI", "API integration"],
    estimatedTime: "8-10 weeks",
    requiredProjects: [
      "Responsive portfolio",
      "API-powered dashboard",
      "React component project"
    ],
    bestNextStep: "Learn JavaScript fundamentals before jumping into React project work.",
    riskWarning:
      "HTML alone is not enough for frontend internships. This path needs consistent coding practice.",
    fitReason:
      "Possible later, but less immediate than analytics because the current web skill base is still early."
  },
  {
    role: "AI/ML Intern",
    readiness: 36,
    difficulty: "Hard",
    missingSkills: ["Statistics", "Machine learning basics", "Model evaluation", "Python libraries"],
    estimatedTime: "12-16 weeks",
    requiredProjects: [
      "EDA and prediction notebook",
      "Model comparison project",
      "Deployed ML mini app"
    ],
    bestNextStep: "Strengthen Python, pandas, and statistics before training complex models.",
    riskWarning:
      "Jumping straight to models without data cleaning and evaluation skills can create shallow portfolio work.",
    fitReason:
      "Interesting long-term path, but the fastest internship-ready route is analytics first."
  }
];
