
import { useNavigate } from "react-router-dom";

import StatusBadge from "./StatusBadge";

import {
  useDeleteJob,
  useUpdateJobStatus,
} from "../hooks/useJobs";

import type {
  Job,
  JobStatus,
} from "../types";

interface JobCardProps {
  job: Job;
}

const JobCard = ({ job }: JobCardProps) => {
  const navigate = useNavigate();

  const deleteJobMutation = useDeleteJob();
  const updateStatusMutation = useUpdateJobStatus();

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${job.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    deleteJobMutation.mutate(job.id);
  };

  const getNextStatus = (): JobStatus => {
    if (job.status === "Open") {
      return "Closed";
    }

    if (job.status === "Closed") {
      return "On Hold";
    }

    return "Open";
  };

  const handleStatusToggle = () => {
    const nextStatus = getNextStatus();

    updateStatusMutation.mutate({
      id: job.id,
      data: {
        status: nextStatus,
      },
    });
  };

  return (
    <article
      className="job-card"
      onClick={() => navigate(`/jobs/${job.id}`)}
    >
      <div className="job-card-header">
        <div>
          <h2>{job.title}</h2>

          <p>{job.department}</p>
        </div>

        <StatusBadge status={job.status} />
      </div>

      <div className="job-details">
        <p>
          <strong>Location:</strong>{" "}
          {job.location}
        </p>

        <p>
          <strong>Type:</strong>{" "}
          {job.type}
        </p>

        <p>
          <strong>Posted:</strong>{" "}
          {job.posted_on}
        </p>

        <p>
          <strong>Applicants:</strong>{" "}
          {job.applicant_count ?? 0}
        </p>
      </div>

      {job.description && (
        <p className="job-description">
          {job.description}
        </p>
      )}

      <div className="job-card-actions">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleStatusToggle();
          }}
          disabled={updateStatusMutation.isPending}
        >
          {updateStatusMutation.isPending
            ? "Updating..."
            : `Change to ${getNextStatus()}`}
        </button>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleDelete();
          }}
          disabled={deleteJobMutation.isPending}
        >
          {deleteJobMutation.isPending
            ? "Deleting..."
            : "Delete"}
        </button>
      </div>

      {updateStatusMutation.isError && (
        <p className="error-state">
          Failed to update job status. Please try again.
        </p>
      )}

      {deleteJobMutation.isError && (
        <p className="error-state">
          Failed to delete job. Please try again.
        </p>
      )}
    </article>
  );
};

export default JobCard;

