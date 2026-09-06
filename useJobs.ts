
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createJob,
  deleteJob,
  fetchJobById,
  fetchJobs,
  fetchStats,
  updateJobStatus,
} from "../api/jobs";

import type {
  Job,
  JobFilters,
  JobFormData,
  JobStatusUpdate,
  Stats,
} from "../types";

export function useJobs(
  filters: JobFilters,
) {
  return useQuery<Job[]>({
    queryKey: ["jobs", filters],
    queryFn: () => fetchJobs(filters),
  });
}

export function useJob(id: number) {
  return useQuery<Job>({
    queryKey: ["job", id],
    queryFn: () => fetchJobById(id),
    enabled: id > 0,
  });
}

export function useStats() {
  return useQuery<Stats>({
    queryKey: ["stats"],
    queryFn: fetchStats,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation<Job, Error, JobFormData>({
    mutationFn: createJob,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["jobs"],
      });
    },
  });
}

export function useUpdateJobStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    { message: string },
    Error,
    {
      id: number;
      data: JobStatusUpdate;
    }
  >({
    mutationFn: ({ id, data }) =>
      updateJobStatus(id, data),

    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["jobs"],
      });

      queryClient.invalidateQueries({
        queryKey: ["job", variables.id],
      });
    },
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: deleteJob,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["jobs"],
      });
    },
  });
}

