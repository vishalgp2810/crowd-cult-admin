export interface AudienceUser {
  userId: number;
  fullName: string | null;
  emailAddress: string | null;
  phoneNumber: string | null;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ArtistDraftProgress {
  artistProfileId: number;
  completionPercent: number;
  ready: boolean;
}

export interface PaginatedResponse<T> {
  count: number;
  rows: T[];
  pageIndex: number;
  pageSize: number;
}

export type AdminListParams = {
  pageIndex?: number;
  pageSize?: number;
  status?: string;
  searchKey?: string;
};

export type SignupNudgeTargetType = "artist" | "venue" | "audience";

export type SignupNudgePreview = {
  targetType: SignupNudgeTargetType;
  targetId: number;
  to: string;
  recipientName: string;
  profileName: string;
  subject: string;
  message: string;
  missingItems: string[];
};
