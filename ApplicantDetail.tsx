import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useApplicant,
  useDeleteApplicant,
  useUpdateApplicantStatus,
} from "../hooks/useApplicants";

import StatusBadge from "../components/StatusBadge";

import type { ApplicantStatus } from "../types";

const ApplicantDetail = () => {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const applicantId = Number(id);

  const {
    data: applicant,
    isLoading,
    isError,
    error,
  } = useApplicant(applicantId);

  const updateStatusMutation =
    useUpdateApplicantStatus();

  const deleteApplicantMutation =
    useDeleteApplicant();

  const handleStatusChange = async (
    status: ApplicantStatus,
  ) => {
    if (!applicant || status === applicant.status) {
      return;
    }

    try {
      await updateStatusMutation.mutateAsync({
        id: applicant.id,
        data: {
          status,
        },
      });
    } catch (error) {
      console.error(
        "Failed to update applicant status:",
        error,
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update applicant status.",
      );
    }
  };

  const handleDelete = async () => {
    if (!applicant) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${applicant.full_name}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteApplicantMutation.mutateAsync(
        applicant.id,
      );

      navigate("/applicants");
    } catch (error) {
      console.error(
        "Failed to delete applicant:",
        error,
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete applicant.",
      );
    }
  };

  if (isLoading) {
    return (
      <main className="applicant-detail-page">
        <div className="page-state">
          <p>Loading applicant...</p>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="applicant-detail-page">
        <div className="page-state error-state">
          <p>
            Failed to load applicant:{" "}
            {error instanceof Error
              ? error.message
              : "Something went wrong."}
          </p>

          <Link to="/applicants">
            Back to Applicants
          </Link>
        </div>
      </main>
    );
  }

  if (!applicant) {
    return (
      <main className="applicant-detail-page">
        <div className="page-state">
          <p>Applicant not found.</p>

          <Link to="/applicants">
            Back to Applicants
          </Link>
        </div>
      </main>
    );
  }

  const isUpdating =
    updateStatusMutation.isPending;

  const isDeleting =
    deleteApplicantMutation.isPending;

  const isBusy = isUpdating || isDeleting;

  return (
    <main className="applicant-detail-page">
      <div className="page-header">
        <div>
          <Link to="/applicants">
            ← Back to Applicants
          </Link>

          <h1>{applicant.full_name}</h1>

          <p>
            Applicant details and recruitment status.
          </p>
        </div>

        <StatusBadge status={applicant.status} />
      </div>

      <section className="applicant-detail-card">
        <div className="detail-row">
          <strong>Full Name</strong>
          <span>{applicant.full_name}</span>
        </div>

        <div className="detail-row">
          <strong>Email</strong>
          <span>{applicant.email}</span>
        </div>

        <div className="detail-row">
          <strong>Phone</strong>
          <span>{applicant.phone}</span>
        </div>

        <div className="detail-row">
          <strong>Job</strong>
          <span>
            {applicant.job_title ??
              `Job #${applicant.job_id}`}
          </span>
        </div>

        <div className="detail-row">
          <strong>Experience</strong>
          <span>
            {applicant.experience_yrs} years
          </span>
        </div>

        <div className="detail-row">
          <strong>Applied On</strong>
          <span>{applicant.applied_on}</span>
        </div>

        <div className="detail-row">
          <strong>Status</strong>

          <select
            value={applicant.status}
            onChange={(event) =>
              handleStatusChange(
                event.target.value as ApplicantStatus,
              )
            }
            disabled={isBusy}
          >
            <option value="Applied">
              Applied
            </option>

            <option value="Screening">
              Screening
            </option>

            <option value="Interview">
              Interview
            </option>

            <option value="Offered">
              Offered
            </option>

            <option value="Hired">
              Hired
            </option>

            <option value="Rejected">
              Rejected
            </option>
          </select>

          {isUpdating && (
            <small>
              Updating status...
            </small>
          )}
        </div>

        {applicant.resume_url && (
          <div className="detail-row">
            <strong>Resume</strong>

            <a
              href={applicant.resume_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Resume
            </a>
          </div>
        )}

        {applicant.notes && (
          <div className="detail-row">
            <strong>Notes</strong>

            <span>{applicant.notes}</span>
          </div>
        )}
      </section>

      <section className="applicant-danger-zone">
        <button
          type="button"
          disabled={isBusy}
          onClick={handleDelete}
        >
          {isDeleting
            ? "Deleting..."
            : "Delete Applicant"}
        </button>
      </section>
    </main>
  );
};

export default ApplicantDetail;