import { apiClient } from "../../api/apiClient"
// export const executeBasicAuthenticationService = (token)=> apiClient.get(`/login`, {
//     headers: {
//         Authorization: token
//     }
// })

export const loginService = async (email, password)=> {
  console.log('sending request with:', {email, password})
  return await apiClient.post(`/login`, {email, password})
}

export const signUpService = (username, email, password)=> apiClient.post(`/signup`, {email, username, password})