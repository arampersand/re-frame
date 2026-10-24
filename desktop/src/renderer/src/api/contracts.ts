/* GENERADO desde backend/app/contracts.py con 'make contracts'. NO EDITAR A MANO. */

export interface ReFrameContracts {
  AskRequest?: AskRequest;
  AskResponse?: AskResponse;
  Course?: Course;
  Deadline?: Deadline;
  ExplainRequest?: ExplainRequest;
  Explanation?: Explanation;
  Lecture?: Lecture;
  ProposedAction?: ProposedAction;
  QuizQuestion?: QuizQuestion;
  QuizResult?: QuizResult;
  Receipt?: Receipt;
  Segment?: Segment;
  Student?: Student;
  TodayView?: TodayView;
  Topic?: Topic;
}
export interface AskRequest {
  lang?: ("es" | "en") | null;
  text: string;
}
export interface AskResponse {
  guided_steps: string[];
  message: string;
  refused: boolean;
  suggested_action: ProposedAction | null;
}
export interface ProposedAction {
  deadline_id: string | null;
  end_at: string;
  id: string;
  kind: "study_block" | "reminder";
  receipt_id: string | null;
  start_at: string;
  status: "proposed" | "approved" | "rejected" | "done" | "failed";
  title: string;
  topic_ids: string[];
  why: string;
}
export interface Course {
  id: string;
  name: string;
  professor: string;
  schedule: string;
}
export interface Deadline {
  course_id: string;
  due_at: string;
  id: string;
  kind: "tarea" | "examen" | "proyecto" | "quiz";
  title: string;
  topic_ids: string[];
}
export interface ExplainRequest {
  lang?: ("es" | "en") | null;
  lecture_id?: string | null;
  segment_ids?: string[];
  text: string;
  topic_id?: string | null;
}
export interface Explanation {
  analogy: string;
  degraded: boolean;
  diagram_mermaid: string;
  lang: "es" | "en";
  quiz: QuizQuestion[];
  summary: string;
  topic_id: string | null;
  topic_title: string;
  worked_example: string;
}
export interface QuizQuestion {
  answer_index: number;
  id: string;
  /**
   * @minItems 2
   */
  options: [string, string, ...string[]];
  prompt: string;
  why: string;
}
export interface Lecture {
  course_id: string;
  id: string;
  recorded_at: string;
  segments: Segment[];
  status: "recording" | "done";
  title: string;
  topic_ids: string[];
}
export interface Segment {
  confused: boolean;
  end_s: number;
  id: string;
  lang: ("es" | "en") | null;
  lecture_id: string;
  start_s: number;
  text: string;
}
export interface QuizResult {
  correct: number;
  total: number;
}
/**
 * Prueba del sistema destino. Sin recibo, el estado es desconocido.
 */
export interface Receipt {
  action_id: string;
  created_at: string;
  external_id: string | null;
  external_url: string | null;
  id: string;
  reason: string | null;
  status: "sent" | "failed" | "skipped";
  target: "google_calendar";
  verified: boolean;
}
export interface Student {
  career: string;
  goal: string;
  id: string;
  name: string;
  preferred_lang: "es" | "en";
  preferred_representation: "diagram" | "analogy" | "example" | "summary";
  semester: number;
}
export interface TodayView {
  actions: ProposedAction[];
  date: string;
  student: Student;
  upcoming: Deadline[];
  weakest_topics: Topic[];
}
export interface Topic {
  confused_count: number;
  course_id: string;
  id: string;
  last_seen_at: string | null;
  prerequisites: string[];
  score: number;
  status: "sin_ver" | "laguna" | "en_progreso" | "dominado";
  title: string;
}
