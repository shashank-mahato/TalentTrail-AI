import type { ExtractedResumeProfile, JobSearchLink } from "@/lib/types";

function encoded(value: string) {
  return encodeURIComponent(value.trim().replace(/\s+/g, " "));
}

export function createRealJobSearchLinks(input: {
  targetRole: string;
  profile: ExtractedResumeProfile;
}): JobSearchLink[] {
  const topSkills = input.profile.skills.slice(0, 4).join(" ");
  const query = encoded(`${input.targetRole} internship ${topSkills}`);
  const role = encoded(input.targetRole);

  return [
    {
      title: `${input.targetRole} internships`,
      platform: "LinkedIn Jobs",
      url: `https://www.linkedin.com/jobs/search/?keywords=${query}`,
      reason: "Searches live LinkedIn postings using the target role and extracted resume skills."
    },
    {
      title: `${input.targetRole} openings`,
      platform: "Indeed",
      url: `https://www.indeed.com/jobs?q=${query}`,
      reason: "Uses a real job board search URL rather than fabricated job listings."
    },
    {
      title: `${input.targetRole} startup internships`,
      platform: "Wellfound",
      url: `https://wellfound.com/jobs?query=${role}`,
      reason: "Good for startup internships where projects and proof-of-work matter."
    },
    {
      title: `${input.targetRole} India internships`,
      platform: "Internshala",
      url: `https://internshala.com/internships/keywords-${role}`,
      reason: "Targets internship listings suitable for Indian college students."
    }
  ];
}
