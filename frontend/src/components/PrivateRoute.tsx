import { Navigate } from "react-router-dom";

import AuthService from "@/helpers/auth.service";

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const user = AuthService.getCurrentUser();

  if (!user) {
    return <Navigate replace to="/login" />; // redireciona para o login (ou home)
  }

  return children;
};

export default PrivateRoute;
