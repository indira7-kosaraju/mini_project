import { create } from 'zustand';
import { login as demoLogin } from '../services/mockApi';

export const useauthstore = create((set) => ({
    authuser: localStorage.getItem('username'),
    isLoggingIn: false,
    login: async (formData) => {
        set({ isLoggingIn: true });
        try {
            const data = await demoLogin(formData);

            localStorage.setItem('username', data.username);
            set({ authuser: data.username });

            return data;
        } catch (error) {
            console.error("Error:", error);
            throw error;
        } finally {
            set({ isLoggingIn: false });
        }
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('userType');
        localStorage.removeItem('userId');
        localStorage.removeItem('trainerName');
        set({ authuser: null });
    }
}));