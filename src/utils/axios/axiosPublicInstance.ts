import axios from "axios";

export const axiosPublicInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 180000,
  headers: {
    "Content-Type": "application/json",
  },
});
