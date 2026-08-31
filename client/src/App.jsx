import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import JobSeekerDashboard from "./pages/JobSeekerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import Applications from "./pages/Applications";
import RecruiterApplicants from "./pages/RecruiterApplicants";


function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/jobs"
                    element={<Jobs />}
                />

                <Route
                    path="/jobs/:jobId"
                    element={<JobDetails />}
                />
                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />
                <Route
    path="/profile"
    element={
        <ProtectedRoute allowedRoles={["jobseeker", "recruiter", "admin"]}>
            <Profile />
        </ProtectedRoute>
    }
/>
<Route
    path="/recruiter/dashboard"
    element={
        <ProtectedRoute allowedRoles={["recruiter", "admin"]}>
            <RecruiterDashboard />
        </ProtectedRoute>
    }
/>
<Route
    path="/dashboard"
    element={
        <ProtectedRoute allowedRoles={["jobseeker"]}>
            <JobSeekerDashboard />
        </ProtectedRoute>
    }
/>
<Route
    path="/applications"
    element={
        <ProtectedRoute allowedRoles={["jobseeker"]}>
            <Applications />
        </ProtectedRoute>
    }
/>

<Route
    path="/recruiter/applicants"
    element={<RecruiterApplicants />}
/>


            </Routes>
        </BrowserRouter>
    );
}

export default App;