import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createApplicant,
  deleteApplicant,
  fetchApplicantById,
  fetchApplicants,
  updateApplicantStatus,
} from "../api/applicants";

import type {
  Applicant,
  ApplicantFilters,
  ApplicantFormData,
  ApplicantStatusUpdate,
} from "../types";

export function useApplicants(
  filters: ApplicantFilters,
) {
  return useQuery<Applicant[]>({
    queryKey: ["applicants", filters],
    queryFn: () => fetchApplicants(filters),
  });
}

export function useApplicant(id: number) {
  return useQuery<Applicant>({
    queryKey: ["applicant", id],
    queryFn: () => fetchApplicantById(id),
    enabled: id > 0,
  });
}

export function useCreateApplicant() {
  const queryClient = useQueryClient();

  return useMutation<
    Applicant,
    Error,
    ApplicantFormData
  >({
    mutationFn: createApplicant,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["applicants"],
      });

      queryClient.invalidateQueries({
        queryKey: ["jobs"],
      });
    },
  });
}

export function useUpdateApplicantStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    Applicant,
    Error,
    {
      id: number;
      data: ApplicantStatusUpdate;
    }
  >({
    mutationFn: ({ id, data }) =>
      updateApplicantStatus(id, data),

    onSuccess: (updatedApplicant) => {
      queryClient.setQueryData(
        ["applicant", updatedApplicant.id],
        updatedApplicant,
      );

      queryClient.invalidateQueries({
        queryKey: ["applicants"],
      });

      queryClient.invalidateQueries({
        queryKey: ["jobs"],
      });
    },
  });
}

export function useDeleteApplicant() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: deleteApplicant,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["applicants"],
      });

      queryClient.invalidateQueries({
        queryKey: ["jobs"],
      });
    },
  });
}