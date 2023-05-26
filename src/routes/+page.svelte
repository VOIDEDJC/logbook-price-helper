<script lang="ts">
	import { onMount } from 'svelte';
	import Session_Module, { loadSession } from '../lib/Session_Module.svelte';
	import TFT_Module, { fetchPrices } from '../lib/TFT_Module.svelte';
	import Stash_Module, { fetchStashData } from '$lib/Stash_Module.svelte';
	import TextArea_Module from '$lib/TextArea_Module.svelte';

	onMount(async () => {
		await fetchPrices();
		await loadSession();
		await fetchStashData();
	});
</script>

<div class="content">
	<div class="input-col">
		<Session_Module />

		<TFT_Module />
	</div>
	<div class="logbook-col">
		<div class="logbook-container">
			<Stash_Module />
		</div>
		<TextArea_Module />
	</div>
</div>

<style>
	.content {
		display: flex;
		flex-direction: row;
		color: #fff;
	}
	.logbook-container {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	.logbook-col {
		display: flex;
		flex-direction: column;
		padding: 16px;
		padding-left: 3rem;
		max-width: 10%;
		min-width: 25rem;
	}
	.input-col {
		min-width: 20rem;
		padding: 16px;
		display: flex;
		flex-direction: column;
		max-width: 7%;
	}
</style>
