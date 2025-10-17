<script lang="ts">
	import { toastStore, type Toast } from '$lib/stores/toastStore';
	import { fly, scale } from 'svelte/transition';
	import { CheckCircle, XCircle, Info, AlertTriangle, X } from '@lucide/svelte';

	type ToastType = 'success' | 'error' | 'info' | 'warning';

	const iconMap: Record<ToastType, any> = {
		success: CheckCircle,
		error: XCircle,
		info: Info,
		warning: AlertTriangle
	};

	const toastStyles: Record<ToastType, { bg: string; border: string; icon: string; text: string }> =
		{
			success: {
				bg: 'bg-white',
				border: 'border-l-4 border-l-green-500 border-gray-200',
				icon: 'text-green-500',
				text: 'text-gray-900'
			},
			error: {
				bg: 'bg-white',
				border: 'border-l-4 border-l-red-500 border-gray-200',
				icon: 'text-red-500',
				text: 'text-gray-900'
			},
			info: {
				bg: 'bg-white',
				border: 'border-l-4 border-l-blue-500 border-gray-200',
				icon: 'text-blue-500',
				text: 'text-gray-900'
			},
			warning: {
				bg: 'bg-white',
				border: 'border-l-4 border-l-amber-500 border-gray-200',
				icon: 'text-amber-500',
				text: 'text-gray-900'
			}
		};
</script>

<!-- Toast Container with proper positioning and stacking -->
<div class="fixed inset-0 z-[9999] pointer-events-none">
	<div class="flex flex-col items-end justify-start min-h-screen p-4 space-y-3 sm:p-6">
		<div class="w-full max-w-sm space-y-3">
			{#each $toastStore.toasts as toastItem (toastItem.id)}
				{@const IconComponent = iconMap[toastItem.type]}
				{@const styles = toastStyles[toastItem.type]}
				<div
					in:fly={{ x: 300, duration: 300, delay: 0 }}
					out:scale={{ duration: 200 }}
					class="w-full pointer-events-auto transform"
				>
					<div
						class="flex items-start gap-3 p-4 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 backdrop-blur-sm {styles.bg} {styles.border}"
					>
						<div class="flex-shrink-0 pt-0.5">
							<IconComponent class="h-5 w-5 {styles.icon}" />
						</div>
						<div class="flex-1 min-w-0">
							<p class="text-sm font-medium {styles.text}">
								{toastItem.title}
							</p>
							{#if toastItem.message}
								<p class="mt-1 text-xs text-gray-600">
									{toastItem.message}
								</p>
							{/if}
						</div>
						{#if toastItem.dismissible}
							<div class="flex-shrink-0">
								<button
									onclick={() => toastStore.removeToast(toastItem.id)}
									class="inline-flex rounded-md p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
									aria-label="Dismiss notification"
								>
									<X class="h-4 w-4" />
								</button>
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
