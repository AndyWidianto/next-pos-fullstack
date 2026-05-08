import { User } from '@prisma/client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';


interface UserAuth extends Omit<User, "password" | "createdAt" | "updatedAt" | "refreshToken"> {}
interface AuthState {
  user: UserAuth | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  login: (userData: UserAuth, token: string) => void;
  logout: () => void;
  updateProfile: (updatedData: Partial<UserAuth>) => void;
  setAccessToken: (token: string) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      accessToken: null,
      login: (userData: UserAuth, token: string) => set({
        user: userData,
        accessToken: token,
        isAuthenticated: true
      }),

      logout: () => set({
        user: null,
        isAuthenticated: false
      }),

      updateProfile: (updatedData) => set((state) => ({
        user: state.user
          ? { ...state.user, ...updatedData } // Gabungkan data lama dengan data baru
          : null
      })),
      setAccessToken: (token: string) => set({
        accessToken: token
      })
    }),
    {
      name: 'auth-storage', // Nama key di LocalStorage
    }
  )
);

export default useAuthStore;