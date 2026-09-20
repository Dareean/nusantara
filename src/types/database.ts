/**
 * TypeScript types mirroring database_schema.sql exactly.
 * If you change the schema, update this file in the same change.
 */

// -- Enums --

export type UserRole = "learner" | "holder" | "organization" | "admin";

export type ConsentLevel =
  | "public"
  | "community_only"
  | "apprentice_only"
  | "restricted"
  | "do_not_document";

export type RiskLevel = "healthy" | "warning" | "high" | "critical";

export type DnaNodeType =
  | "technique"
  | "knowledge_fact"
  | "meaning"
  | "story"
  | "people"
  | "variation"
  | "warning"
  | "terminology";

export type CarrierStatus = "learner" | "apprentice" | "verified_carrier";

export type KnowledgeCategory =
  | "craft"
  | "language"
  | "music"
  | "culinary"
  | "ritual"
  | "oral_story"
  | "other";

// -- Tables --

export interface User {
  id: string;
  auth_user_id: string | null;
  full_name: string;
  email: string;
  role: UserRole;
  avatar_url: string | null;
  location_city: string | null;
  location_region: string | null;
  languages: string[];
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface CulturalHolderProfile {
  user_id: string;
  expertise_summary: string | null;
  years_of_practice: number | null;
  availability: string | null;
  teaching_methods: string[];
  verified: boolean;
  created_at: string;
}

export interface Organization {
  id: string;
  name: string;
  type: string | null;
  region: string | null;
  contact_user_id: string | null;
  created_at: string;
}

export interface Knowledge {
  id: string;
  title: string;
  category: KnowledgeCategory | null;
  region: string | null;
  summary: string | null;
  cover_media_url: string | null;
  consent_level: ConsentLevel;
  organization_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeDnaNode {
  id: string;
  knowledge_id: string;
  node_type: DnaNodeType;
  title: string;
  content: string | null;
  order_index: number;
  parent_node_id: string | null;
  created_at: string;
}

export interface KnowledgePeopleLink {
  id: string;
  dna_node_id: string;
  user_id: string | null;
  external_name: string | null;
  role_in_knowledge: string | null;
}

export interface KnowledgeRiskSnapshot {
  id: string;
  knowledge_id: string;
  known_practitioners: number;
  apprentice_count: number;
  documentation_pct: number;
  risk_level: RiskLevel;
  computed_at: string;
  notes: string | null;
}

export interface KnowledgeRiskImpactItem {
  id: string;
  knowledge_id: string;
  item_label: string;
}

export interface InterviewSession {
  id: string;
  knowledge_id: string | null;
  interviewer_id: string;
  holder_id: string | null;
  holder_external_name: string | null;
  raw_transcript: string | null;
  audio_url: string | null;
  video_url: string | null;
  status: "draft" | "structuring" | "structured" | "published";
  created_at: string;
}

export interface InterviewQuestionAsked {
  id: string;
  interview_session_id: string;
  question_text: string;
  answer_text: string | null;
  order_index: number;
}

export interface InterviewDnaOutput {
  id: string;
  interview_session_id: string;
  dna_node_id: string;
  confidence_score: number | null;
  reviewed_by_human: boolean;
}

export interface LearningPath {
  id: string;
  knowledge_id: string;
  title: string;
  description: string | null;
  created_at: string;
}

export interface LearningPathStep {
  id: string;
  learning_path_id: string;
  step_number: number;
  title: string;
  description: string | null;
  related_dna_node_id: string | null;
}

export interface UserLearningProgress {
  id: string;
  user_id: string;
  learning_path_id: string;
  current_step_number: number;
  completed: boolean;
  started_at: string;
  completed_at: string | null;
}

export interface MentorMatchRequest {
  id: string;
  learner_id: string;
  knowledge_id: string;
  preferred_language: string | null;
  preferred_method: string | null;
  status: "open" | "matched" | "closed";
  created_at: string;
}

export interface MentorMatchResult {
  id: string;
  match_request_id: string;
  holder_id: string;
  match_score: number | null;
  score_breakdown: {
    expertise: number;
    location: number;
    language: number;
    availability: number;
  } | null;
  created_at: string;
}

export interface Apprenticeship {
  id: string;
  learner_id: string;
  holder_id: string | null;
  knowledge_id: string;
  status: CarrierStatus;
  started_at: string;
  verified_at: string | null;
  verified_by: string | null;
  verification_notes: string | null;
}

export interface KnowledgeLineageEntry {
  id: string;
  knowledge_id: string;
  person_name: string;
  person_user_id: string | null;
  era_label: string | null;
  role_description: string | null;
  order_index: number;
}

export interface ConsentGrant {
  id: string;
  knowledge_id: string;
  grantee_user_id: string | null;
  grantee_org_id: string | null;
  access_level: ConsentLevel;
  granted_by: string;
  granted_at: string;
}

// -- View types --

export interface KnowledgeCurrentRisk {
  knowledge_id: string;
  known_practitioners: number;
  apprentice_count: number;
  documentation_pct: number;
  risk_level: RiskLevel;
  computed_at: string;
}

// -- Joined / composite types for UI --

export interface KnowledgeWithRisk extends Knowledge {
  risk: KnowledgeCurrentRisk | null;
}

export interface KnowledgeDnaGrouped {
  technique: KnowledgeDnaNode[];
  knowledge_fact: KnowledgeDnaNode[];
  meaning: KnowledgeDnaNode[];
  story: KnowledgeDnaNode[];
  people: KnowledgeDnaNode[];
  variation: KnowledgeDnaNode[];
  warning: KnowledgeDnaNode[];
  terminology: KnowledgeDnaNode[];
}

export interface HolderWithProfile extends User {
  profile: CulturalHolderProfile | null;
}

export interface MentorMatchWithHolder extends MentorMatchResult {
  holder: HolderWithProfile;
}
