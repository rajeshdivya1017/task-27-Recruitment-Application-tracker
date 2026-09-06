import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import ApplicantsPage from "./pages/ApplicantsPage";
import ApplicantDetail from "./pages/ApplicantDetail";
import Dashboard from "./pages/Dashboard";
import JobDetail from "./pages/JobDetail";
import JobsPage from "./pages/JobsPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/jobs"
          element={<JobsPage />}
        />

        <Route
          path="/jobs/:id"
          element={<JobDetail />}
        />

        <Route
          path="/applicants"
          element={<ApplicantsPage />}
        />

        <Route
          path="/applicants/:id"
          element={<ApplicantDetail />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

