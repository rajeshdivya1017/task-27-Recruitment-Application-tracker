
import { useState } from "react";

import FilterBar from "../components/FilterBar";
import JobCard from "../components/JobCard";
import JobForm from "../components/JobForm";
import Modal from "../components/Modal";
import { useJobs } from "../hooks/useJobs";
import { useFilterStore } from "../store/useFilterStore";

import type { JobFilters } from "../types";

const JobsPage = () => {
  const {
    department,
    jobStatus,
    jobType,
    search,
  } = useFilterStore();

  const filters: JobFilters = {
    ...(department !== "All" && {
      department,
    }),
    ...(jobStatus !== "All" && {
      status: jobStatus,
    }),
    ...(jobType !== "All" && {
      type: jobType,
    }),
    ...(search.trim() && {
      search: search.trim(),
    }),
  };

  const {
    data: jobs,
    isLoading,
    isError,
    error,
  } = useJobs(filters);

  const [isCreateModalOpen, setIsCreateModalOpen] =
    useState(false);

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleJobCreated = () => {
    setIsCreateModalOpen(false);
  };

  return (
    <main className="jobs-page">
      <div className="page-header">
        <div>
          <h1>Jobs</h1>

          <p>
            Manage job openings and track recruitment
            activity.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
        >
          + Create Job
        </button>
      </div>

      <FilterBar showApplicantStatus={false} />

      {isLoading && (
        <div className="page-state">
          <p>Loading jobs...</p>
        </div>
      )}

      {isError && (
        <div className="page-state error-state">
          <p>
            Failed to load jobs:{" "}
            {error instanceof Error
              ? error.message
              : "Something went wrong."}
          </p>
        </div>
      )}

      {!isLoading &&
        !isError &&
        jobs?.length === 0 && (
          <div className="page-state">
            <p>
              No jobs found for the selected filters.
            </p>
          </div>
        )}

      {!isLoading &&
        !isError &&
        jobs &&
        jobs.length > 0 && (
          <section className="jobs-grid">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
              />
            ))}
          </section>
        )}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        title="Create New Job"
      >
        <JobForm
          onSuccess={handleJobCreated}
          onCancel={handleCloseModal}
        />
      </Modal>
    </main>
  );
};

export default JobsPage;

