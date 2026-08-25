// AuthContext.tsx
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { decodeToken, isTokenExpired, DecodedToken } from "../utils/jwt";

interface AuthContextType {
    user: DecodedToken | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<DecodedToken | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("Token");
        if (storedToken) {
            const decoded = decodeToken(storedToken);
            if (decoded && !isTokenExpired(decoded)) {
                setUser(decoded);
            } else {
                localStorage.removeItem("Token"); // stale/expired/tampered
            }
        }
        setIsLoading(false);
    }, []);

    const login = (token: string) => {
        const decoded = decodeToken(token);
        if (!decoded) throw new Error("Invalid token received from server");
        localStorage.setItem("Token", token);
        setUser(decoded);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("Token");
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};