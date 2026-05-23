import {
  careerTwinPaths,
  demoProfile,
  mockCareerResult,
  mockRoadmap
} from "@/lib/mockData";
import type { CareerResult, RoadmapResult, StudentProfile } from "@/lib/types";

const PROFILE_KEY = "talenttrail.profile";
const CAREER_RESULT_KEY = "talenttrail.careerResult";
const ROADMAP_KEY = "talenttrail.roadmap";
const DEMO_KEY = "talenttrail.demo";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function writeJson<T>(key: string, value: T) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function readJson<T>(key: string): T | null {
  if (!canUseStorage()) return null;
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function saveProfile(profile: StudentProfile) {
  writeJson(PROFILE_KEY, profile);
}

export function getProfile() {
  return readJson<StudentProfile>(PROFILE_KEY);
}

export function saveCareerResult(result: CareerResult) {
  writeJson(CAREER_RESULT_KEY, result);
}

export function getCareerResult() {
  return readJson<CareerResult>(CAREER_RESULT_KEY);
}

export function saveRoadmap(roadmap: RoadmapResult) {
  writeJson(ROADMAP_KEY, roadmap);
}

export function getRoadmap() {
  return readJson<RoadmapResult>(ROADMAP_KEY);
}

export function loadDemoData() {
  saveProfile(demoProfile);
  saveCareerResult(mockCareerResult);
  saveRoadmap(mockRoadmap);
  writeJson(DEMO_KEY, { enabled: true, careerTwinPaths });
}

export function clearDemoData() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(PROFILE_KEY);
  window.localStorage.removeItem(CAREER_RESULT_KEY);
  window.localStorage.removeItem(ROADMAP_KEY);
  window.localStorage.removeItem(DEMO_KEY);
}
