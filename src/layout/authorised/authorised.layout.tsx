import { Navigate, Outlet } from "react-router-dom";
import Header from "../../component/header";
import { ROUTE_CONST } from "../../constants/route-constant";
import { getLocalStorageItem } from "../../utils/local-storage";

const AuthorisedLayout = () => {
  const authToken = getLocalStorageItem("token") || '';

  if (!authToken) {
    return <Navigate to={ROUTE_CONST.AUTH.LOGIN} />;
  }
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
};

export default AuthorisedLayout;
