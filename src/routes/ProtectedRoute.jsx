import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoute = ({allowedRoles}) => {

    const token = localStorage.getItem("Token");

    if(token == null) return <Navigate to= "/login"/>

    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const role = decodedToken.role || decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    if(allowedRoles.includes(role)){
        return <Outlet/>
    }
    else {
        return <Navigate to={role === "Admin" ? "/admin/dashboard" : "/customer/dashboard"} replace />;
    }

}

export default ProtectedRoute;