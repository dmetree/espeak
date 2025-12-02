import { Timestamp } from "firebase/firestore";

export enum EGender { // hyphothesis
  Unknown = 0,
  Male = 1,
  Female = 2,
}

export enum EUserRole {
  Novice = "portal-user",
  Specialist = "specialist",
  Admin = "admin",
}

export interface ILanguage {
  code: string; // name of the language iso 3 code
  total_level: number; // 1-5
  speaking: number; // 1-5
  listening: number; // 1-5
  reading: number;
  writing: number;
}

export enum EVideoPagePersona {
  Create = "create",
  Join = "join",
}

export enum EReqStatus {
  Open = 0,
  Accepted = 1,
  CallTime = 2,
  Calling = 3,
  CallInProgress = 4,
  Finished = 5,
  Archived = 6,
}

export enum EScheduleMark {
  BUSY = "busy",
  OPEN_FOR_WORK = "openForWork",
}

export enum ECallStatus {
  Open = "open",
  Closed = "closed",
}

export type TMessage = {
  timestamp: Timestamp;
  senderID: string;
  text: string;
};

export type TService = {
  title: string;
  price: number;
  length: number;
};

export interface IUserProfile {
  uid?: string;
  email: string;
  avatar: string;
  nickname: string; // should be always in lowercase! Firestore doesn't support case insensitive search
  languages: string[];
  gender: EGender;
  timeZone: string; // in minutes relative to GMT+0
  userRole: EUserRole;
  wasLate: number;
  created_at: Timestamp;
  blacklist: string[]; // uid specs list
  jobRequest: boolean;
  lastOnline?: string;
}

export interface ISpecProfile extends IUserProfile {
  // lessons_taught: number; // both
  students_total: number; // unique students/clients Spec had.
  psyRank: number; // 1 - 10 for psychologists || for teachers:1-5 tutor; 6-10 professor*
  freeTimestamps: number[]; // unix time in seconds
  services: TService[];
  infoAbout: string;
  // yearsInProfession?: number;
  // created_at: firebase.firestore.Timestamp;
}

export interface IAppointmentReq {
  age: number | "Not Important"; // or 0 which is not important
  nickname: string;
  status: EReqStatus;
  caller: string;
  clientUid: string;
  messages?: TMessage[];
  psyRank: number;
  price: number;
  gender: EGender;
  lang: string;
  subject: string;
  scheduledUnixtime: number;
  created_at: Timestamp;
  specUid?: string;
  id?: string;
}

export interface IApplication {
  creatorId: string;
  uid: string;
  diploma: any;
  diplomaHours: any;
  diplomaYear: number | null;
  certificates: any;

  therapists: TeacherTherapist[] | any;
  extra_info: string;
  status: IJobRequestStatus;
}

interface TeacherTherapist {
  name: string;
  profileLink: string;
  from: string;
  to: string;
  sessions: number;
}

export interface IArticle {
  uid: string;
  url: string;
  content: string;
  reviews: ArticleReview[];
  comments: ArticleComment[];
}

interface ArticleReview {
  uid: string;
  creatorId: string;
  creatorRank: string;
  creatorProfile: string;
  content: string;
}

interface ArticleComment {
  uid: string;
  creatorId: string;
  creatorRank: string;
  creatorProfile: string;
  content: string;
}

interface RTCData {
  meta: RTCSessionDescriptionInit;
  initiator: string;
}

export enum ECallReconnectStatus {
  Pending = "pending",
  Finished = "finished",
}

export interface ICall {
  offer: RTCData;
  answer: RTCData;
  callCandidates: RTCIceCandidateInit[];
  status: ECallStatus;
  reconnect: {
    status: ECallReconnectStatus;
    initiator: string;
  };
}

// schedule for calendar
export type THourSchedule = {
  hour: number;
  mark: EScheduleMark;
  request: null | IAppointmentReq;
};

export enum EModalKind {
  BookSession = "book-session",
  VideoCall = "video-call",
  EventRoom = "event-room",
  ChangePassword = "change-password",
  CallEnd = "call-end",
  FindSpecialist = "find-specialist",
  PsyworkerApplication = "psyworker-application",
  LangModal = "lang-modal",
  Login = "login",
  SignUp = "sign-up",
  PathTeacher = "path-teacher",
  PathStudent = "path-student",
}

export namespace TimetableRequests {
  export enum EStatus {
    ActionRequired = "action_reqiured",
    Upcoming = "upcoming",
    Waiting = "waiting",
    Completed = "completed",
  }
}

export enum IUserTypes {
  User = "portal-user",
  Spec = "specialist",
  Admin = "admin",
}

export enum IJobRequestStatus {
  None = "none",
  Pending = "Pending",
  Accepted = "Accepted",
  Declined = "Declined",
}

export class NoAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NoAuthError";
  }
}

export interface IAppointmentReq {
  age: number | "Not Important"; // or 0 which is not important
  nickname: string;
  status: EReqStatus;
  caller: string;
  clientUid: string;
  messages?: TMessage[];
  psyRank: number;
  price: number;
  gender: EGender;
  lang: string;
  subject: string;
  scheduledUnixtime: number;
  created_at: Timestamp;
  psyPrev: boolean;
  specUid?: string;
  id?: string;
}

export const ECallHintType = {
  AllowMedia: "allow_media",
  NoPermission: "no_permission",
  Calling: "calling",
  Ok: "ok",
};

interface IPost {
  uid: string;
  url: string;
  content: string;
  reviewsRequested: number;
  reward: number;
  rewardTokenId: string;
  comments: PostComment[];
  likes: number;
}

interface PostComment {
  uid: string;
  creatorId: string;
  creatorRank: string;
  creatorProfile: string;
  content: string;
  likes: number;
}

export interface INotification {
  actionFromUserId: string;
  actionToUserId: string;
  viewed: boolean;
  notificationType: INotificationType;
  created_at: Timestamp;
}

export enum INotificationType {
  markAsStudentRequest = "mark_as_student_request",
  markAsStudentRequestAccepted = "mark_as_student_request_accepted",
  markAsStudentRequestDeclined = "mark_as_student_request_declined",

  sessionRequestAccepted = "session_request_accepted",
  sessionRequestDeclined = "session_request_declined",
  // .... TODO add other types of notifications
}

export interface MenuItem {
  icon: any;
  title: string;
  clickEvent: () => void;
  userRole: string;
}

export interface SpecApplication {
  creatorId: string;
  uid: string;
  diploma: string | null;
  diplomaHours: number | null;
  diplomaYear: number | null;
  certificates: { url: string; certificateHours: number | null }[];
  therapists: {
    name: string;
    profileLink: string;
    from: string;
    to: string;
    sessions: number;
  }[];
  extra_info: string;
  status: IJobRequestStatus;
}

export enum EventType {
  Monthly = "monthly",
  OneTime = "oneTime",
}

export enum EventStatus {
  InProcess = "inprocess",
  Finished = "finished",
}

export type Option = {
  value: string;
  label: string;
};

// Author type
type Author = {
  uid: string;
  avatar: string;
  nickname: string;
  rank: string;
};

// Event form type
export type EventForm = {
  language: Option | null;
  title: string;
  description: string;
  videoLink: string;
  price: string;
  dates: string[];
  students: [];
  image: string | null;
  author: Author;
  eventType: EventType;
  status: EventStatus;
  hours: number;
};
