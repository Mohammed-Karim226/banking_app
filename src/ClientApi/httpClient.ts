import axios from "axios";

// Create an Axios instance
const httpClient = axios.create({
  baseURL: "https://api.example.com", // Replace with your API base URL
  timeout: 10000, // Request timeout (in milliseconds)
  headers: {
    "Content-Type": "application/json",
    // Add other default headers here
  },
});

// Optional: Add interceptors for request and response handling
httpClient.interceptors.request.use(
  (config) => {
    // Modify request config if needed (e.g., add authentication token)
    // config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle response errors (e.g., log out on 401 unauthorized)
    // if (error.response.status === 401) {
    //   // handle unauthorized access (e.g., redirect to login)
    // }
    return Promise.reject(error);
  }
);

export default httpClient;
