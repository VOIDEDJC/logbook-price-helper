<script context="module" lang="ts">
	import { fetch } from '@tauri-apps/api/http';
	import { chalicePriceStore, circlePriceStore, scythePriceStore, sunPriceStore } from './stores';

	let tft: any;

	export async function fetchPrices() {
		console.log('Fetching Prices');
		tft = await fetch(
			'https://raw.githubusercontent.com/The-Forbidden-Trove/tft-data-prices/master/lsc/bulk-expedition.json'
		);
		tft = tft.data;
		sunPriceStore.set(tft.data[4].chaos);
		scythePriceStore.set(tft.data[5].chaos);
		chalicePriceStore.set(tft.data[6].chaos);
		circlePriceStore.set(tft.data[7].chaos);
	}
</script>

<div class="price-container">
	Current TFT Prices:
	<div class="logbook-row">
		<div>Knights of the Sun</div>
		<div>{$sunPriceStore}c</div>
	</div>
	<div class="logbook-row">
		<div>Black Scythe Mercenaries</div>
		<div>{$scythePriceStore}c</div>
	</div>
	<div class="logbook-row">
		<div>Order of the Chalice</div>
		<div>{$chalicePriceStore}c</div>
	</div>
	<div class="logbook-row">
		<div>Druids of the Broken Circle</div>
		<div>{$circlePriceStore}c</div>
	</div>
</div>

<style>
	.price-container {
		display: flex;
		flex-direction: column;
		padding-top: 30px;
		max-width: 7%;
		min-width: 15rem;
	}
	.logbook-row {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-top: 10px;
		padding-left: 10px;
	}
</style>
