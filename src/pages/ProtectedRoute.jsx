import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/FakeAuthContext"
import { useEffect } from "react";

function ProtectedRoute({children}) {
    const isAuth = useAuth();
    const navigate = useNavigate();

    useEffect(function(){
        if (!isAuth) navigate("/");
    }, [isAuth, navigate])
    return children;
}

export default ProtectedRoute
