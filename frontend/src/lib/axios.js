import axios from "axios"


export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:2002/api" : "/api",
    withCredentials: true,
});