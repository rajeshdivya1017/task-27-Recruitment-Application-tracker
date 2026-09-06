import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useDeleteJob,
  useJob,
  useUpdateJobStatus,
} from "../hooks/useJobs";

import { useApplicants } from "../hooks/useApplicants";

import StatusBadge from "../components/StatusBadge";

import type {
  ApplicantFilters,
  JobStatus,
} from "../types";

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const jobId = Number(id);

  const {
    data: job,
    isLoading,
    isError,
    error,
  } = useJob(jobId);

  const applicantFilters: ApplicantFilters = {
    job_id: jobId,
  };

  const {
    data: applicants,
    isLoading: applicantsLoading,
    isError: applicantsError,
  } = useApplicants(applicantFilters);

  const updateJobStatusMutation =
    useUpdateJobStatus();

  const deleteJobMutation =
    useDeleteJob();

  const handleStatusChange = async (
    status: JobStatus,
  ) => {
    if (!job || status === job.status) {
      return;
    }

    try {
      await updateJobStatusMutation.mutateAsync({
        id: job.id,
        data: {
          status,
        },
      });
    } catch (error) {
      console.error(
        "Failed to update job status:",
        error,
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update job status.",
      );
    }
  };

  const handleDeleteJob = async () => {
    if (!job) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${job.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteJobMutation.mutateAsync(job.id);

      navigate("/jobs");
    } catch (error) {
      console.error(
        "Failed to delete job:",
        error,
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete job.",
      );
    }
  };

  if (isLoading) {
    return (
      <main className="job-details-page">
        <div className="page-state">
          <p>Loading job details...</p>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="job-details-page">
        <div className="page-state error-state">
          <p>
            Failed to load job details:{" "}
            {error instanceof Error
              ? error.message
              : "Something went wrong."}
          </p>

          <Link to="/jobs">
            Back to Jobs
          </Link>
        </div>
      </main>
    );
  }

  if (!job) {
    return (
      <main className="job-details-page">
        <div className="page-state">
          <p>Job not found.</p>

          <Link to="/jobs">
            Back to Jobs
          </Link>
        </div>
      </main>
    );
  }

  const isUpdating =
    updateJobStatusMutation.isPending;

  const isDeleting =
    deleteJobMutation.isPending;

  const isBusy = isUpdating || isDeleting;

  return (
    <main className="job-details-page">
      <div className="page-header">
        <div>
          <Link to="/jobs">
            ← Back to Jobs
          </Link>

          <h1>{job.title}</h1>

          <p>
            {job.department} · {job.location}
          </p>
        </div>

        <StatusBadge status={job.status} />
      </div>

      <section className="job-details-card">
        <div className="job-detail-item">
          <span>Department</span>

          <strong>
            {job.department}
          </strong>
        </div>

        <div className="job-detail-item">
          <span>Location</span>

          <strong>
            {job.location}
          </strong>
        </div>

        <div className="job-detail-item">
          <span>Job Type</span>

          <strong>
            {job.type}
          </strong>
        </div>

        <div className="job-detail-item">
          <span>Status</span>

          <select
            value={job.status}
            onChange={(event) =>
              handleStatusChange(
                event.target.value as JobStatus,
              )
            }
            disabled={isBusy}
          >
            <option value="Open">
              Open
            </option>

            <option value="Closed">
              Closed
            </option>

            <option value="On Hold">
              On Hold
            </option>
          </select>

          {isUpdating && (
            <small>
              Updating status...
            </small>
          )}
        </div>

        <div className="job-detail-item">
          <span>Posted On</span>

          <strong>
            {job.posted_on}
          </strong>
        </div>

        <div className="job-detail-item">
          <span>Applicants</span>

          <strong>
            {job.applicant_count ?? 0}
          </strong>
        </div>
      </section>

      {job.description && (
        <section className="job-description-card">
          <h2>Job Description</h2>

          <p>{job.description}</p>
        </section>
      )}

      <section className="job-applicants-section">
        <div className="section-header">
          <h2>
            Applicants
          </h2>

          <span>
            {applicants?.length ?? 0} applicants
          </span>
        </div>

        {applicantsLoading && (
          <div className="page-state">
            <p>
              Loading applicants...
            </p>
          </div>
        )}

        {applicantsError && (
          <div className="page-state error-state">
            <p>
              Failed to load applicants.
            </p>
          </div>
        )}

        {!applicantsLoading &&
          !applicantsError &&
          applicants?.length === 0 && (
            <div className="page-state">
              <p>
                No applicants have applied
                for this job yet.
              </p>
            </div>
          )}

        {!applicantsLoading &&
          !applicantsError &&
          applicants &&
          applicants.length > 0 && (
            <div className="job-applicants-list">
              {applicants.map(
                (applicant) => (
                  <Link
                    key={applicant.id}
                    to={`/applicants/${applicant.id}`}
                    className="job-applicant-item"
                  >
                    <div>
                      <strong>
                        {applicant.full_name}
                      </strong>

                      <span>
                        {applicant.email}
                      </span>
                    </div>

                    <StatusBadge
                      status={applicant.status}
                    />
                  </Link>
                ),
              )}
            </div>
          )}
      </section>

      <section className="job-actions">
        <button
          type="button"
          onClick={handleDeleteJob}
          disabled={isBusy}
        >
          {isDeleting
            ? "Deleting..."
            : "Delete Job"}
        </button>
      </section>
    </main>
  );
};

export default JobDetail;