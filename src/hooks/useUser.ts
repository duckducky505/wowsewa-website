import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useLocalStorage } from "./useLocalStorage";

export interface User {
    id: string;
    name: string;
    role: string;
}

export const useUser = () => {
    const { user, setUser } = useContext(AuthContext);
    const { setItem, removeItem } = useLocalStorage();

    const addUser = (user: User) => {
        setUser(user);
        setItem("user", JSON.stringify(user));
    };

    const removeUser = () => {
        setUser(null);
        // Was setItem("user", ""), which leaves the key present with an
        // empty string. JSON.parse("") throws, so the next page load's
        // hydration effect in useAuth would crash instead of just finding
        // nothing. removeItem actually deletes the key.
        removeItem("user");
    };

    return { user, addUser, removeUser, setUser };
};