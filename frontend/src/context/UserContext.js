import React, { createContext, useEffect, useState } from "react";

export const UserContext = createContext()

export const UserProvider = (props) => {
    const [token, setToken] = useState(localStorage.getItem("AwesometheToken"))
    useEffect(() => {
        const fetchUser = async () => {
            const req = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },

            };
            const res = await fetch("/api/users/me" , req)
            if (!res.ok) {
                setToken(null);
            }
            localStorage.setItem("AwesometheToken" , token);
        };
        fetchUser();
    }, [token]);
    return (
        <UserContext.Provider value={[token, setToken]}>
            {props.children}
        </UserContext.Provider>
    )
};
