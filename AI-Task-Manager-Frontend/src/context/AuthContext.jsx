import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    const [userName, setUserName] = useState(
        localStorage.getItem("userName")
    );

    const login = (jwtToken, name) => {

        localStorage.setItem("token", jwtToken);
        localStorage.setItem("userName", name);

        setToken(jwtToken);
        setUserName(name);
    };

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("userName");

        setToken(null);
        setUserName(null);
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider
            value={{
                token,
                userName,
                login,
                logout,
                isAuthenticated,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};