import { create } from 'zustand';

const useRegisterStore = create(set => ({
	email: '',
	password: '',
	username: '',
	currencyId: null,
	currentBalance: '',

	setEmail: email => set({ email }),
	setPassword: password => set({ password }),
	setUsername: username => set({ username }),
	setCurrencyId: currencyId => set({ currencyId }),
	setCurrentBalance: currentBalance => set({ currentBalance }),

	reset: () =>
		set({
			email: '',
			password: '',
			username: '',
			currencyId: null,
			currentBalance: '',
		}),
}));

export default useRegisterStore;
