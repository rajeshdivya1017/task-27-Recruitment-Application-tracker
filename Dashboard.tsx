
import {
  BadgeCheck,
  BriefcaseBusiness,
  FileText,
  MessagesSquare,
  SearchCheck,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";

import { useStats } from "../hooks/useJobs";

const Dashboard = () => {
  const {
    data: stats,
    isLoading,
    isError,
    error,
  } = useStats();

  if (isLoading) {
    return (
      <main className="dashboard-page">
        <div className="page-state">
          <p>Loading dashboard...</p>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="dashboard-page">
        <div className="page-state error-state">
          <p>
            Failed to load dashboard:{" "}
            {error instanceof Error
              ? error.message
              : "Something went wrong."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>

          <p>
            Recruitment and applicant overview.
          </p>
        </div>
      </div>

      <section className="stats-grid">
        <article className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon">
              <BriefcaseBusiness size={20} />
            </div>

            <span>Total Jobs</span>
          </div>

          <strong>
            {stats?.total_jobs ?? 0}
          </strong>
        </article>

        <article className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon">
              <BriefcaseBusiness size={20} />
            </div>

            <span>Open Jobs</span>
          </div>

          <strong>
            {stats?.open_jobs ?? 0}
          </strong>
        </article>

        <article className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon">
              <Users size={20} />
            </div>

            <span>Total Applicants</span>
          </div>

          <strong>
            {stats?.total_applicants ?? 0}
          </strong>
        </article>

        <article className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon">
              <UserCheck size={20} />
            </div>

            <span>Hired Applicants</span>
          </div>

          <strong>
            {stats?.hired ?? 0}
          </strong>
        </article>
      </section>

      <section className="status-summary">
        <h2>Applicant Status</h2>

        <div className="status-grid">
          <div className="status-item">
            <FileText size={20} />

            <span>Applied</span>

            <strong>
              {stats?.by_status.Applied ?? 0}
            </strong>
          </div>

          <div className="status-item">
            <SearchCheck size={20} />

            <span>Screening</span>

            <strong>
              {stats?.by_status.Screening ?? 0}
            </strong>
          </div>

          <div className="status-item">
            <MessagesSquare size={20} />

            <span>Interview</span>

            <strong>
              {stats?.by_status.Interview ?? 0}
            </strong>
          </div>

          <div className="status-item">
            <BadgeCheck size={20} />

            <span>Offered</span>

            <strong>
              {stats?.by_status.Offered ?? 0}
            </strong>
          </div>

          <div className="status-item">
            <UserCheck size={20} />

            <span>Hired</span>

            <strong>
              {stats?.by_status.Hired ?? 0}
            </strong>
          </div>

          <div className="status-item">
            <UserX size={20} />

            <span>Rejected</span>

            <strong>
              {stats?.by_status.Rejected ?? 0}
            </strong>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;

