import { writable } from 'svelte/store';

export interface Toast {
	id: string;
	type: 'success' | 'error' | 'warning' | 'info';
	title: string;
	message?: string;
	duration?: number;
	dismissible?: boolean;
}

export interface ToastStore {
	toasts: Toast[];
}

function createToastStore() {
	const { subscribe, update } = writable<ToastStore>({ toasts: [] });

	return {
		subscribe,
		addToast: (toast: Omit<Toast, 'id'>) => {
			const id = Math.random().toString(36).substr(2, 9);
			const newToast: Toast = {
				id,
				duration: 5000,
				dismissible: true,
				...toast
			};

			update((state) => ({
				...state,
				toasts: [...state.toasts, newToast]
			}));

			// Auto-dismiss after duration
			if (newToast.duration && newToast.duration > 0) {
				setTimeout(() => {
					removeToast(id);
				}, newToast.duration);
			}

			return id;
		},
		removeToast: (id: string) => {
			update((state) => ({
				...state,
				toasts: state.toasts.filter((toast) => toast.id !== id)
			}));
		},
		clearAll: () => {
			update(() => ({ toasts: [] }));
		}
	};
}

const removeToast = (id: string) => {
	toastStore.removeToast(id);
};

export const toastStore = createToastStore();

// Helper functions for common toast types
export const toast = {
	success: (title: string, message?: string) =>
		toastStore.addToast({ type: 'success', title, message, duration: 4000 }),
	error: (title: string, message?: string) =>
		toastStore.addToast({ type: 'error', title, message, duration: 6000 }),
	warning: (title: string, message?: string) =>
		toastStore.addToast({ type: 'warning', title, message, duration: 5000 }),
	info: (title: string, message?: string) =>
		toastStore.addToast({ type: 'info', title, message, duration: 4000 })
};
