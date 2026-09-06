import type {
  ApplicantStatus,
  JobStatus,
} from "../types";

interface StatusBadgeProps {
  status: JobStatus | ApplicantStatus;
}

const StatusBadge = ({
  status,
}: StatusBadgeProps) => {
  const statusClass = status
    .toLowerCase()
    .replace(/\s+/g, "-");

  return (
    <span
      className={`status-badge ${statusClass}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;

