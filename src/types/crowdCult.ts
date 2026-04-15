export type UserRoleCode = "PLATFORM_ADMIN" | "VENUE" | "ARTIST";

export interface RoleDto {
  roleId: number;
  roleCode: UserRoleCode;
  roleName: string;
  roleLevel: UserRoleCode;
}

export interface VenueDto {
  venueId: number;
  userId: number;
  businessName: string;
  city?: string | null;
  countryCode?: string | null;
  isVerified: boolean;
}

export interface ArtistProfileDto {
  artistProfileId: number;
  userId: number;
  slug: string;
  stageName: string;
  genre?: string | null;
  city?: string | null;
  hourlyRate: number;
  bio?: string | null;
  available: boolean;
  ratingAvg: number;
  reviewCount: number;
  completedBookingsCount: number;
}

export interface UserDto {
  userId: number;
  fullName: string;
  emailAddress: string;
  phoneNumber?: string | null;
  roleId: number;
  role?: RoleDto;
  venue?: VenueDto | null;
  artistProfile?: ArtistProfileDto | null;
}
