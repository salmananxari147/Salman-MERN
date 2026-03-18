import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../utils/api';

const useAuthStore = create(
    persist(
        (set, get) => ({
            userInfo: null,
            isLoading: false,
            error: null,

            login: async (email, password) => {
                set({ isLoading: true, error: null });
                try {
                    const { data } = await api.post('/users/login', { email, password });
                    set({ userInfo: data, isLoading: false });
                    return data;
                } catch (error) {
                    const message =
                        error.response && error.response.data.message
                            ? error.response.data.message
                            : error.message;
                    set({ error: message, isLoading: false });
                    throw new Error(message);
                }
            },

            register: async (name, email, password) => {
                set({ isLoading: true, error: null });
                try {
                    const { data } = await api.post('/users', { name, email, password });
                    set({ userInfo: data, isLoading: false });
                    return data;
                } catch (error) {
                    const message =
                        error.response && error.response.data.message
                            ? error.response.data.message
                            : error.message;
                    set({ error: message, isLoading: false });
                    throw new Error(message);
                }
            },

            logout: () => {
                set({ userInfo: null, error: null });
                // Can optionally clear other storages like cart on logout if required
            },

            clearError: () => set({ error: null }),
        }),
        {
            name: 'ecommerce-auth-storage',
        }
    )
);

export default useAuthStore;
