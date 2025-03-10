import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'https://localhost:7292/api/auth';

export const useAuthStore = create(set => ({
	user: null,
	token: localStorage.getItem('token') || null,
	userParameters: null,
	setUserParameters: updatedParameters =>
		set(state => ({
			userParameters: { ...state.userParameters, ...updatedParameters },
		})),
	userUpdateTimestamp: 0,
	logout: () => set({ user: null, userUpdateTimestamp: Date.now() }),
	setUser: userData => set({ user: userData, userUpdateTimestamp: Date.now() }),
	login: async (email, password) => {
		try {
			const { data } = await axios.post(`${API_URL}/login`, {
				email,
				password,
			});
			if (data && data.sessionToken && data.userId) {
				set({ user: data, token: data.sessionToken });
				localStorage.setItem('token', data.sessionToken);
				localStorage.setItem('userData', JSON.stringify(data));
				return data;
			}
			return false;
		} catch {
			return false;
		}
	},
	register: async (username, email, password, currencyId) => {
		try {
			const { data } = await axios.post(`${API_URL}/register`, {
				username,
				email,
				password,
				currencyId,
			});
			set({ user: data.user, token: data.sessionToken });
			localStorage.setItem('token', data.sessionToken);
			localStorage.setItem('userData', JSON.stringify(data.user));
			return true;
		} catch {
			return false;
		}
	},
	logout: () => {
		set({ user: null, token: null });
		localStorage.removeItem('userData');
		localStorage.removeItem('token');
	},
}));
