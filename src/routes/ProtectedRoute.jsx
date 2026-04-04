import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoute = ({allowedRoles}) => {

    const token = localStorage.getItem("Token");

    if(token == null) return <Navigate to= "/login"/>

    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const role = decodedToken.role || decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"].toLowerCase();
    const expireTime = decodedToken.exp; 

    if(Date.now()/1000 > expireTime) {
        localStorage.removeItem("Token");
        return <Navigate to="/login"/>
    }

    if(allowedRoles.includes(role)){
        return <Outlet/>
    }
    else {
        return <Navigate to={role === "admin" ? `/${role}/dashboard` : `/${role}/dashboard`} replace />;
    }

}

export default ProtectedRoute;