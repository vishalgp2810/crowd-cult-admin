import { apiClient, unwrapApiResponse } from "./client";

export type AddressAutocompleteItem = {
  description: string;
  placeId: string;
};

export type AddressDetailsPayload = {
  placeId: string | null;
  formattedAddress: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  countryCode: string | null;
  postalCode: string | null;
  latitude: number | null;
  longitude: number | null;
};

export const commonApi = {
  autocompleteAddress: async (query: string) => {
    const res = await apiClient.get("/common/address/autocomplete", { params: { q: query } });
    return unwrapApiResponse<{ suggestions: AddressAutocompleteItem[] }>(res);
  },

  getAddressDetails: async (placeId: string) => {
    const res = await apiClient.get("/common/address/details", { params: { placeId } });
    return unwrapApiResponse<{ place: AddressDetailsPayload }>(res);
  },
};
