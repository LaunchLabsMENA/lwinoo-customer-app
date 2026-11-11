import { http } from './client';
import { toApiError } from './errors';
import type { Address, AddressInput, GeoPlace } from './types';

const guard = async <T>(job: Promise<T>): Promise<T> => {
  try {
    return await job;
  } catch (error) {
    throw toApiError(error);
  }
};

export const listAddresses = async () => (await guard(http.get<Address[]>('/api/me/addresses'))).data;
export const createAddress = async (input: AddressInput) => (await guard(http.post<Address>('/api/me/addresses', input))).data;
export const updateAddress = async (id: string, input: Partial<AddressInput>) =>
  (await guard(http.patch<Address>(`/api/me/addresses/${id}`, input))).data;
export const makeDefaultAddress = (id: string) => updateAddress(id, { isDefault: true });
export const removeAddress = async (id: string) => {
  await guard(http.delete(`/api/me/addresses/${id}`));
};

export const searchPlaces = async (query: string, language: string) =>
  (await guard(http.get<GeoPlace[]>('/api/geo/search', { params: { q: query, lang: language } }))).data;

export const reverseGeocode = async (latitude: number, longitude: number, language: string) =>
  (await guard(http.get<GeoPlace | null>('/api/geo/reverse', { params: { lat: latitude, lng: longitude, lang: language } }))).data;
