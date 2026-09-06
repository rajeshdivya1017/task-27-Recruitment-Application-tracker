
import type {
  ApplicantStatus,
  Department,
  JobStatus,
  JobType,
} from "../types";

import { useFilterStore } from "../store/useFilterStore";

interface FilterBarProps {
  showApplicantStatus?: boolean;
}

const FilterBar = ({
  showApplicantStatus = true,
}: FilterBarProps) => {
  const {
    department,
    jobStatus,
    jobType,
    applicantStatus,
    search,
    setDepartment,
    setJobStatus,
    setJobType,
    setApplicantStatus,
    setSearch,
    resetFilters,
  } = useFilterStore();

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label htmlFor="search">
          Search
        </label>

        <input
          id="search"
          type="text"
          placeholder="Search jobs or applicants..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />
      </div>

      <div className="filter-group">
        <label htmlFor="department">
          Department
        </label>

        <select
          id="department"
          value={department}
          onChange={(event) =>
            setDepartment(
              event.target.value as
                | Department
                | "All",
            )
          }
        >
          <option value="All">
            All Departments
          </option>

          <option value="Engineering">
            Engineering
          </option>

          <option value="Sales">
            Sales
          </option>

          <option value="HR">
            HR
          </option>

          <option value="Marketing">
            Marketing
          </option>

          <option value="Finance">
            Finance
          </option>

          <option value="Operations">
            Operations
          </option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="job-status">
          Job Status
        </label>

        <select
          id="job-status"
          value={jobStatus}
          onChange={(event) =>
            setJobStatus(
              event.target.value as
                | JobStatus
                | "All",
            )
          }
        >
          <option value="All">
            All Job Statuses
          </option>

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
      </div>

      <div className="filter-group">
        <label htmlFor="job-type">
          Job Type
        </label>

        <select
          id="job-type"
          value={jobType}
          onChange={(event) =>
            setJobType(
              event.target.value as
                | JobType
                | "All",
            )
          }
        >
          <option value="All">
            All Job Types
          </option>

          <option value="Full-time">
            Full-time
          </option>

          <option value="Part-time">
            Part-time
          </option>

          <option value="Contract">
            Contract
          </option>

          <option value="Internship">
            Internship
          </option>
        </select>
      </div>

      {showApplicantStatus && (
        <div className="filter-group">
          <label htmlFor="applicant-status">
            Applicant Status
          </label>

          <select
            id="applicant-status"
            value={applicantStatus}
            onChange={(event) =>
              setApplicantStatus(
                event.target.value as
                  | ApplicantStatus
                  | "All",
              )
            }
          >
            <option value="All">
              All Applicant Statuses
            </option>

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
        </div>
      )}

      <button
        type="button"
        className="reset-filter-btn"
        onClick={resetFilters}
      >
        Reset Filters
      </button>
    </div>
  );
};

export default FilterBar;

