import { Patient } from "./patient.model";

export interface PaginatedResponse {
  skip: number;
  limit: number;
  total: number;
  data: Patient[];
}