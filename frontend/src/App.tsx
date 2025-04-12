import { Route, Routes } from "react-router-dom";

import MaterialsPage from "@/pages/materials";
import PrivateRoute from "@/components/PrivateRoute";
import LoginPage from "@/pages/login";
import IndexPage from "@/pages/index";
import UsersPage from "@/pages/users";
import StepsPage from "@/pages/steps";
import RolesPage from "@/pages/roles";
import TraceabilityPage from "@/pages/traceability";

function App() {
  return (
    <Routes>
      <Route element={<LoginPage />} path="/login" />
      {/* Rotas protegidas */}
      <Route
        element={
          <PrivateRoute>
            <IndexPage />
          </PrivateRoute>
        }
        path="/"
      />
      <Route
        element={
          <PrivateRoute>
            <UsersPage />
          </PrivateRoute>
        }
        path="/users"
      />
      <Route
        element={
          <PrivateRoute>
            <MaterialsPage />
          </PrivateRoute>
        }
        path="/materials"
      />
      <Route
        element={
          <PrivateRoute>
            <StepsPage />
          </PrivateRoute>
        }
        path="/steps"
      />
      <Route
        element={
          <PrivateRoute>
            <RolesPage />
          </PrivateRoute>
        }
        path="/roles"
      />
      <Route
        element={
          <PrivateRoute>
            <TraceabilityPage />
          </PrivateRoute>
        }
        path="/traceability"
      />
    </Routes>
  );
}

export default App;
