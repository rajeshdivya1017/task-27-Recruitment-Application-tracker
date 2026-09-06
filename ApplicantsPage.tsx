
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import FilterBar from "../components/FilterBar";
import ApplicantForm from "../components/ApplicantForm";
import Modal from "../components/Modal";
import StatusBadge from "../components/StatusBadge";

import {
  useApplicants,
  useCreateApplicant,
} from "../hooks/useApplicants";

import { useFilterStore } from "../store/useFilterStore";

import type {
  ApplicantFilters,
  ApplicantFormData,
} from "../types";

const ApplicantsPage = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const department = useFilterStore(
    (state) => state.department,
  );

  const jobStatus = useFilterStore(
    (state) => state.jobStatus,
  );

  const jobType = useFilterStore(
    (state) => state.jobType,
  );

  const applicantStatus = useFilterStore(
    (state) => state.applicantStatus,
  );

  const search = useFilterStore(
    (state) => state.search,
  );

  const filters: ApplicantFilters = {
    ...(department !== "All" && {
      department,
    }),
    ...(jobStatus !== "All" && {
      job_status: jobStatus,
    }),
    ...(jobType !== "All" && {
      job_type: jobType,
    }),
    ...(applicantStatus !== "All" && {
      status: applicantStatus,
    }),
    ...(search.trim() && {
      search: search.trim(),
    }),
  };

  const {
    data: applicants,
    isLoading,
    isError,
    error,
  } = useApplicants(filters);

  const createApplicantMutation =
    useCreateApplicant();

  const handleCreateApplicant = async (
    data: ApplicantFormData,
  ) => {
    try {
      await createApplicantMutation.mutateAsync(data);

      setIsModalOpen(false);
    } catch (err) {
      console.error(
        "Failed to create applicant:",
        err,
      );

      alert(
        err instanceof Error
          ? err.message
          : "Failed to create applicant.",
      );
    }
  };

  const handleApplicantClick = (
    applicantId: number,
  ) => {
    navigate(`/applicants/${applicantId}`);
  };

  return (
    <main className="applicants-page">
      <div className="page-header">
        <div>
          <h1>Applicants</h1>

          <p>
            Manage applicants and track their recruitment
            status.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
        >
          Add Applicant
        </button>
      </div>

      <FilterBar />

      {isLoading && (
        <div className="page-state">
          <p>Loading applicants...</p>
        </div>
      )}

      {isError && (
        <div className="page-state error-state">
          <p>
            Failed to load applicants:{" "}
            {error instanceof Error
              ? error.message
              : "Something went wrong."}
          </p>
        </div>
      )}

      {!isLoading &&
        !isError &&
        applicants?.length === 0 && (
          <div className="page-state">
            <p>
              No applicants found for the selected
              filters.
            </p>
          </div>
        )}

      {!isLoading &&
        !isError &&
        applicants &&
        applicants.length > 0 && (
          <section className="applicants-table-container">
            <table className="applicants-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Job</th>
                  <th>Experience</th>
                  <th>Status</th>
                  <th>Applied On</th>
                </tr>
              </thead>

              <tbody>
                {applicants.map((applicant) => (
                  <tr
                    key={applicant.id}
                    onClick={() =>
                      handleApplicantClick(
                        applicant.id,
                      )
                    }
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    <td>{applicant.full_name}</td>

                    <td>{applicant.email}</td>

                    <td>{applicant.phone}</td>

                    <td>
                      {applicant.job_title ??
                        `Job #${applicant.job_id}`}
                    </td>

                    <td>
                      {applicant.experience_yrs} years
                    </td>

                    <td>
                      <StatusBadge
                        status={applicant.status}
                      />
                    </td>

                    <td>{applicant.applied_on}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Applicant"
      >
        <ApplicantForm
          onSubmit={handleCreateApplicant}
          onCancel={() => setIsModalOpen(false)}
          isLoading={
            createApplicantMutation.isPending
          }
        />
      </Modal>
    </main>
  );
};

export default ApplicantsPage;

