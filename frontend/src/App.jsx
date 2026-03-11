import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import AuthLoader from "./components/AuthLoader";
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Purchases from "./pages/Purchases";

const ProtectedRoute = ({ userData, children }) => {
  if (!userData) return <Navigate to="/login" replace />;
  return children;
};

const App = () => {
  useGetCurrentUser();

  const { userData, loading } = useSelector((state) => state.user);
  console.log("loading: ", loading);
  console.log("userData: ", userData);

  if (loading) {
    return <AuthLoader />;
  }

  return (
    <Routes>
      <>
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={userData ? <Navigate to="/dashboard" replace /> : <Login />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute userData={userData}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/purchases"
          element={
            <ProtectedRoute userData={userData}>
              <Purchases />
            </ProtectedRoute>
          }
        />
      </>
    </Routes>
  );
};

export default App;
