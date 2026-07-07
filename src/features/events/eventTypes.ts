export type HostedEventStatus = "DRAFT" | "PENDING_REVIEW" | "PUBLISHED";

export type HostedEventLayout = "INDOOR" | "OUTDOOR" | "MIXED";
export type HostedEventKidsPolicy = "ALLOWED" | "NOT_ALLOWED";
export type HostedEventSeating = "SEATED" | "STANDING" | "BOTH";
export type HostedEventPetPolicy = "PET_FRIENDLY" | "NOT_ALLOWED";

export type HostedEventCategory =
  | "CONCERT"
  | "CONFERENCE"
  | "WORKSHOP"
  | "FESTIVAL"
  | "COMEDY"
  | "THEATRE"
  | "SPORTS"
  | "OTHER";

export type HostedEventAttendeeConfig = {
  fields: string[];
  customQuestions: string[];
};

export type HostedEventTicketType = {
  hostedEventTicketTypeId: number;
  name: string;
  price: number;
  quantity: number;
  soldQuantity: number;
  availableQuantity: number;
  minPerBooking: number;
  maxPerBooking: number;
  salesStartAt?: string | null;
  salesEndAt?: string | null;
  complimentaryDetails?: string | null;
  sortOrder: number;
};

export type EventTicketTypeFormValue = {
  hostedEventTicketTypeId: number | null;
  name: string;
  price: number;
  quantity: number;
  minPerBooking: number;
  maxPerBooking: number;
  salesStartLocal: string;
  salesEndLocal: string;
  complimentaryDetails: string;
};

export type HostedEventVenueSummary = {
  venueId: number;
  businessName: string;
  slug: string;
  city?: string | null;
  profileImageUrl?: string | null;
};

export type HostedEventGalleryItem = {
  hostedEventGalleryId?: number;
  url: string;
  readUrl?: string | null;
  sortOrder: number;
};

export type HostedEventMediaAsset = {
  hostedEventMediaAssetId: number;
  title: string;
  assetType: "audio" | "video";
  url: string | null;
  byteSize?: number | null;
  isEventBackgroundTrack: boolean;
};

export type HostedEventListItem = {
  hostedEventId: number;
  title: string;
  slug: string;
  status: HostedEventStatus;
  isActive: boolean;
  startsAt: string;
  endsAt: string;
  bannerUrl?: string | null;
  bannerReadUrl?: string | null;
  updatedAt: string;
  venue: HostedEventVenueSummary | null;
  durationDisplay?: string | null;
  reviewSubmittedAt?: string | null;
};

export type HostedEventAddress = {
  formattedAddress?: string | null;
  addressLine1?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  countryCode?: string | null;
  placeId?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

export type HostedEventDetail = HostedEventListItem & {
  venueId: number;
  subtitle?: string | null;
  description?: string | null;
  category?: HostedEventCategory | null;
  timezone?: string | null;
  onlineMeetingUrl?: string | null;
  organizerName: string;
  organizerEmail?: string | null;
  organizerPhone?: string | null;
  bookingEnabled: boolean;
  allowWaitlist: boolean;
  refundPolicy?: string | null;
  currencyCode: string;
  attendeeConfig: HostedEventAttendeeConfig;
  ticketTypes: HostedEventTicketType[];
  languages: string[];
  ticketAgeNote?: string | null;
  layout?: HostedEventLayout | null;
  kidsPolicy?: HostedEventKidsPolicy | null;
  durationText?: string | null;
  entryPolicy?: string | null;
  seating?: HostedEventSeating | null;
  petPolicy?: HostedEventPetPolicy | null;
  publishedAt?: string | null;
  reviewSubmittedAt?: string | null;
  reviewRejectionReason?: string | null;
  approvedAt?: string | null;
  eventTransactionFeeRate?: number | null;
  eventPlatformFeeRate?: number | null;
  createdAt: string;
  gallery: HostedEventGalleryItem[];
  mediaAssets?: HostedEventMediaAsset[];
} & HostedEventAddress;

export type HostedEventListResponse = {
  events: HostedEventListItem[];
  page: number;
  limit: number;
  total: number;
};

export type HostedEventUpsertPayload = {
  venueId?: number;
  title?: string;
  slug?: string;
  subtitle?: string;
  startsAt?: string;
  endsAt?: string;
  bannerUrl?: string;
  organizerName?: string;
  languages?: string[];
  ticketAgeNote?: string;
  layout?: HostedEventLayout;
  kidsPolicy?: HostedEventKidsPolicy;
  durationText?: string;
  entryPolicy?: string;
  seating?: HostedEventSeating;
  petPolicy?: HostedEventPetPolicy;
  galleryUrls?: string[];
  formattedAddress?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  countryCode?: string;
  placeId?: string;
  latitude?: number | null;
  longitude?: number | null;
  description?: string;
  category?: HostedEventCategory;
  timezone?: string;
  onlineMeetingUrl?: string;
  organizerEmail?: string;
  organizerPhone?: string;
  bookingEnabled?: boolean;
  allowWaitlist?: boolean;
  refundPolicy?: string;
  currencyCode?: string;
  attendeeConfig?: HostedEventAttendeeConfig;
  ticketTypes?: Array<{
    hostedEventTicketTypeId?: number | null;
    name: string;
    price: number;
    quantity: number;
    minPerBooking: number;
    maxPerBooking: number;
    salesStartAt?: string | null;
    salesEndAt?: string | null;
    complimentaryDetails?: string | null;
    sortOrder?: number;
  }>;
};

export type ListEventsParams = {
  status?: HostedEventStatus;
  venueId?: number;
  q?: string;
  timeframe?: "past" | "upcoming" | "all";
  page?: number;
  limit?: number;
};
