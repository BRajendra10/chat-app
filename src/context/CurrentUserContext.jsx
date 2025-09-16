import { createContext, useState } from "react";

export const CurrentUserContext = createContext();

export function CurrentUserContextProvider({ children }) {
    const [user, setUser] = useState([]);

    const handleUser = (eliment) => setUser(eliment);

    return (
        <CurrentUserContext.Provider value={{user, handleUser}}>
            {children}
        </CurrentUserContext.Provider>
    )
}

