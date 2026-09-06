import { create } from "zustand";

import type {
  ApplicantStatus,
  Department,
  JobStatus,
  JobType,
} from "../types";

interface FilterState {
  department: Department | "All";
  jobStatus: JobStatus | "All";
  jobType: JobType | "All";
  applicantStatus: ApplicantStatus | "All";
  search: string;

  setDepartment: (value: Department | "All") => void;
  setJobStatus: (value: JobStatus | "All") => void;
  setJobType: (value: JobType | "All") => void;
  setApplicantStatus: (
    value: ApplicantStatus | "All",
  ) => void;
  setSearch: (value: string) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>(
  (set) => ({
    department: "All",
    jobStatus: "All",
    jobType: "All",
    applicantStatus: "All",
    search: "",

    setDepartment: (value) =>
      set({ department: value }),

    setJobStatus: (value) =>
      set({ jobStatus: value }),

    setJobType: (value) =>
      set({ jobType: value }),

    setApplicantStatus: (value) =>
      set({ applicantStatus: value }),

    setSearch: (value) =>
      set({ search: value }),

    resetFilters: () =>
      set({
        department: "All",
        jobStatus: "All",
        jobType: "All",
        applicantStatus: "All",
        search: "",
      }),
  }),
);