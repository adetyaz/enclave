<script lang="ts">
	import { toastStore } from '$lib/stores/toastStore';
	import { fly, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { CheckCircle, XCircle, AlertTriangle, Info, X } from '@lucide/svelte';

	let toasts = $derived($toastStore.toasts);

	const iconMap = {
		success: CheckCircle,
		error: XCircle,
		warning: AlertTriangle,
		info: Info
	};

	const colorMap = {
		success: 'bg-white border-l-4 border-green-500 shadow-lg',
		error: 'bg-white border-l-4 border-red-500 shadow-lg',
		warning: 'bg-white border-l-4 border-yellow-500 shadow-lg',
		info: 'bg-white border-l-4 border-blue-500 shadow-lg'
	};

	const iconColorMap = {
		success: 'text-green-500',
		error: 'text-red-500',
		warning: 'text-yellow-500',
		info: 'text-blue-500'
	};
</script>

<!-- Toast Container -->
<div class="fixed top-4 right-4 z-50 space-y-3 w-96 max-w-sm">
	{#each toasts as toast (toast.id)}
		<div
			class="rounded-lg p-4 {colorMap[toast.type]} backdrop-blur-sm"
			transition:fly={{ delay: 0, duration: 300, x: 300, y: 0, easing: quintOut }}
			role="alert"
		>
			<div class="flex items-start space-x-3">
				<div class="flex-shrink-0">
					{#if toast.type === 'success'}
						<CheckCircle class="h-5 w-5 {iconColorMap[toast.type]}" />
					{:else if toast.type === 'error'}
						<XCircle class="h-5 w-5 {iconColorMap[toast.type]}" />
					{:else if toast.type === 'warning'}
						<AlertTriangle class="h-5 w-5 {iconColorMap[toast.type]}" />
					{:else if toast.type === 'info'}
						<Info class="h-5 w-5 {iconColorMap[toast.type]}" />
					{/if}
				</div>
				<div class="flex-1 min-w-0">
					<p class="text-sm font-medium text-gray-900">{toast.title}</p>
					{#if toast.message}
						<p class="text-sm text-gray-700 mt-1">{toast.message}</p>
					{/if}
				</div>
				{#if toast.dismissible}
					<div class="flex-shrink-0">
						<button
							type="button"
							class="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
							onclick={() => toastStore.removeToast(toast.id)}
							aria-label="Close notification"
						>
							<X class="h-4 w-4" />
						</button>
					</div>
				{/if}
			</div>
		</div>
	{/each}
</div>

<style>
	/* Additional animations can be added here */
</style>
