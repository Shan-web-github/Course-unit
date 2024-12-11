import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SheetUpload from "./pages/SheetUpload";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import ChooseTimeTable from "./pages/ChooseTimeTable";
import CreateTimeTable from "./pages/CreateTimeTable";
import { AuthProvider } from "./Authcontext";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route
            path="/sheetupload"
            element={
              // <ProtectedRoute>
                <SheetUpload />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/createTimetable"
            element={
              <ProtectedRoute>
                <CreateTimeTable />
              </ProtectedRoute>
            }
          />
          <Route
            path="/choosetimeTable"
            element={
              <ProtectedRoute>
                <ChooseTimeTable />
              </ProtectedRoute>
            }
          />
          {/* <Route path="/" element={}/> */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
