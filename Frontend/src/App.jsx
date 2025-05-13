import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import CreateGroup from "./Pages/CreateGroup";
import StudentsInGroups from "./Pages/StudentsInGroups";
import ListOfStudent from "./Pages/ListOfStudets";

const App = () => {
  const { user, checkAuth, checkingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  const location = useLocation();

  const isStudentsInGroups = location.pathname === "/students-in-groups";
  const groups = isStudentsInGroups ? location.state?.groups : null;
  const subjectName = isStudentsInGroups ? location.state?.subjectName : null;
  const subjectId = isStudentsInGroups ? location.state?.subjectId : null;
  if (checkingAuth) return <LoadingSpinner />;

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={user ? <HomePage /> : <Navigate to={"login"} />}
        />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to={"/"} />}
        />
        <Route
          path="/signup"
          element={!user ? <SignUp /> : <Navigate to={"/"} />}
        />
        <Route
          path="/create-group"
          element={user ? <CreateGroup /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/students-in-groups"
          element={
            user ? (
              <StudentsInGroups
                groups={groups}
                subjectName={subjectName}
                subjectId={subjectId}
              />
            ) : (
              <Navigate to={"/login"} />
            )
          }
        />
        <Route
          path="/list/:groupId"
          element={
            user ? (
              <ListOfStudent
                groupName={location.state?.groupName}
                subjectName={location.state?.subjectName}
                subjectId={location.state?.subjectId}
              />
            ) : (
              <Navigate to={"/login"} />
            )
          }
        />
      </Routes>
      <Toaster />
    </>
  );
};

export default App;
