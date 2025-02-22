import { Navigate, useLocation } from "react-router-dom";
import Loading from "../loading/Loading";
import useAuth from "../hooks/useAuth";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  // console.log(location);
  if (loading) {
    return <Loading></Loading>;
  }
  if (user && user?.email) {
    return children;
  }
  return <Navigate state={location?.pathname} to={"/"}></Navigate>;
};

export default PrivateRoute;
