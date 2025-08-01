import { apiClient } from '../api/client'
import type {
  AccommodationType,
  AccommodationTypeCreate,
  AccommodationTypeUpdate,
  Accommodation,
  AccommodationCreate,
  AccommodationUpdate,
} from '../types/accommodation'

export class AccommodationService {
  // Accommodation Types
  static async getAccommodationTypes(): Promise<AccommodationType[]> {
    const response = await apiClient.get('/api/v1/accommodation-types/')
    return response.data
  }

  static async createAccommodationType(data: AccommodationTypeCreate): Promise<AccommodationType> {
    const response = await apiClient.post('/api/v1/accommodation-types/', data)
    return response.data
  }

  static async updateAccommodationType(
    id: number,
    data: AccommodationTypeUpdate,
  ): Promise<AccommodationType> {
    const response = await apiClient.put(`/api/v1/accommodation-types/${id}`, data)
    return response.data
  }

  static async deleteAccommodationType(id: number): Promise<void> {
    await apiClient.delete(`/api/v1/accommodation-types/${id}`)
  }

  // Accommodations
  static async getAccommodations(): Promise<Accommodation[]> {
    const response = await apiClient.get('/api/v1/accommodations/')
    return response.data
  }

  static async createAccommodation(data: AccommodationCreate): Promise<Accommodation> {
    const response = await apiClient.post('/api/v1/accommodations/', data)
    return response.data
  }

  static async updateAccommodation(id: number, data: AccommodationUpdate): Promise<Accommodation> {
    const response = await apiClient.put(`/api/v1/accommodations/${id}`, data)
    return response.data
  }

  static async deleteAccommodation(id: number): Promise<void> {
    await apiClient.delete(`/api/v1/accommodations/${id}`)
  }
}
