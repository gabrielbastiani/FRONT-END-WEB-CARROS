/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";


interface PrivateProps {
    children: ReactNode;
}

export function Private({ children }: PrivateProps): any {
    const { isAuthenticated, loadingAuth } = useContext(AuthContext);

    if(loadingAuth) {
        return <div></div>
    }

    if(!isAuthenticated) {
        return <Navigate to="/login" />
    }

    return children;
}