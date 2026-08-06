import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

export interface User {
    guidId: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (userData: User, token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const initializeAuth = () => {
            try {
                const storedToken = localStorage.getItem('Token');
                const storedUser = localStorage.getItem("User");

                if (storedToken && storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error("Failed to restore auth state:", error);
            } finally {
                setIsLoading(false);
            }
        };
        initializeAuth();
    }, []);

    const login = (userData: User, token: string) => {
        setUser(userData);
        localStorage.setItem('Token', token);
        localStorage.setItem("User", JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('Token');
        localStorage.removeItem("User");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};