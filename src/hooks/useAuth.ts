import { useEffect } from "react";
import { useUser, User } from "./useUser";
import { useLocalStorage } from "./useLocalStorage";

export const useAuth = () => {
    const { user, addUser, removeUser, setUser } = useUser();
    const { getItem } = useLocalStorage();

    useEffect(() => {
        const stored = getItem("user");
        if (stored) {
            try {
                addUser(JSON.parse(stored));
            } catch {
                // Corrupt or stale value (e.g. the old empty-string bug) —
                // drop it instead of crashing the whole app on load.
                removeUser();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const login = (user: User) => {
        addUser(user);
    };

    const logout = () => {
        removeUser();
        localStorage.removeItem("Token");
    };

    return { user, role: user?.role?.toLowerCase() ?? null, login, logout, setUser };
};