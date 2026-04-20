import { apiClient } from "@/lib/api-client";

const mockUser = {
  id: "1",
  name: "Admin User",
  email: "admin@example.com",
  avatar: null,
};

export const authService = {
  login: async (credentials) => {
    // REAL API: 
    // const response = await apiClient.post("/auth/login", credentials);
    // return response.data;
    
    // MOCK:
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.email === "admin@example.com" && credentials.password === "password") {
          resolve({ user: mockUser, token: "mock-jwt-token" });
        } else {
          reject(new Error("Invalid credentials"));
        }
      }, 500);
    });
  },

  getMe: async () => {
    // REAL API:
    // const response = await apiClient.get("/auth/me");
    // return response.data;

    // MOCK:
    return new Promise((resolve) => setTimeout(() => resolve(mockUser), 300));
  },

  logout: async () => {
    // REAL API:
    // await apiClient.post("/auth/logout");
    // return true;

    // MOCK:
    return new Promise((resolve) => setTimeout(() => resolve(true), 200));
  },
};
