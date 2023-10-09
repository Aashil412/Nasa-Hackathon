import { ReactNode, createContext, useEffect } from "react";
import { useContext} from "react";
import { useState } from "react";
import { apiClient } from "../../api/apiClient";
import { loginService } from "./AuthenticationApiService";
// 1. create context
// interface IAuth = {
//   isAuthenticated: boolean;
//   successfulSignup: boolean;
//   login:(username: String, password: String) => Promise<boolean>;
//   setSignup: (value: boolean) => void;
//   logout: () => void;
//   username: String | null;
//   token: String | null;
// };

const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

export default function AuthProvider({ children }) {

    const [isAuthenticated, setAuthenticated] = useState(false)
    const [email, setEmail] = useState(null)
    const [username, setUsername] = useState(null)
    const [successfulSignup, setSuccessfulSignup] = useState(false)

    function setSignup(value) {
      setSuccessfulSignup(value);
  }

    async function login(email, password) {
        try {
        const response = await loginService(email, password)
        console.log('RESPONSE', email)
        if (response.status == 200){
            setAuthenticated(true)
            setEmail(email)
            setUsername(response.data.user.name);
            return true
        } else {
            logout()
            return false
        }
    } catch (error) {
        logout()
        return false

    }
    }

    function logout() {
        setAuthenticated(false);
        setEmail(null)
    }

    return (
        <AuthContext.Provider value={{isAuthenticated, login, logout, email, username, successfulSignup, setSignup}}>
            {children}
        </AuthContext.Provider>
    )
}

// Use auth provider as a paraent and wrap all of the elements
// that you want your context to be able to give data to.