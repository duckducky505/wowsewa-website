import React, { createContext, useState } from 'react';
import { User } from "../hooks/useUser";

interface AuthContextValue {
    user: User | null;
    setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextValue>({
    user: null,
    setUser: () => {},
});

// This was missing. Without a Provider that owns real state via useState,
// every setUser() call anywhere in the app hits the no-op default above,
// and `user` in context stays null forever no matter what useAuth/useUser do.
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};