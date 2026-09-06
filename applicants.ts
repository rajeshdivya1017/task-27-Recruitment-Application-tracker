import api from "./axios";

import type {
  Applicant,
  ApplicantFilters,
  ApplicantFormData,
  ApplicantStatusUpdate,
} from "../types";

export const fetchApplicants = (
  filters: ApplicantFilters,
): Promise<Applicant[]> => {
  return api
    .get<Applicant[]>("/api/applicants", {
      params: filters,
    })
    .then((response) => response.data);
};

export const fetchApplicantById = (
  id: number,
): Promise<Applicant> => {
  return api
    .get<Applicant>(`/api/applicants/${id}`)
    .then((response) => response.data);
};

export const createApplicant = (
  data: ApplicantFormData,
): Promise<Applicant> => {
  return api
    .post<Applicant>("/api/applicants", data)
    .then((response) => response.data);
};

export const updateApplicantStatus = async (
  id: number,
  data: ApplicantStatusUpdate,
): Promise<Applicant> => {
  await api.put(
    `/api/applicants/${id}/status`,
    data,
  );

  return fetchApplicantById(id);
};

export const deleteApplicant = (
  id: number,
): Promise<void> => {
  return api
    .delete(`/api/applicants/${id}`)
    .then(() => undefined);
};