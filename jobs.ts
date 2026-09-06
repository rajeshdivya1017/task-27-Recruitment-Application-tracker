
import api from "./axios";

import type {
  Job,
  JobFilters,
  JobFormData,
  JobStatusUpdate,
  Stats,
} from "../types";

export const fetchJobs = (
  filters: JobFilters,
): Promise<Job[]> => {
  return api
    .get<Job[]>("/api/jobs", {
      params: filters,
    })
    .then((response) => response.data);
};

export const fetchJobById = (
  id: number,
): Promise<Job> => {
  return api
    .get<Job>(`/api/jobs/${id}`)
    .then((response) => response.data);
};

export const createJob = (
  data: JobFormData,
): Promise<Job> => {
  return api
    .post<Job>("/api/jobs", data)
    .then((response) => response.data);
};

export const updateJobStatus = (
  id: number,
  data: JobStatusUpdate,
): Promise<{ message: string }> => {
  return api
    .put<{ message: string }>(
      `/api/jobs/${id}`,
      data,
    )
    .then((response) => response.data);
};

export const deleteJob = (
  id: number,
): Promise<void> => {
  return api
    .delete(`/api/jobs/${id}`)
    .then(() => undefined);
};

export const fetchStats = (): Promise<Stats> => {
  return api
    .get<Stats>("/api/stats")
    .then((response) => response.data);
};

