<script lang="ts">
	import { fetch } from '@tauri-apps/api/http';
	import { store } from '../lib/store';

	import { onMount } from 'svelte';
	import SessionModule, { loadSession } from '../lib/SessionModule.svelte';
	import { accNameStore, sessionIDStore, leagueStore, stashIndexStore } from '../lib/stores.js';

	let tft: any;
	let stashData: any;

	onMount(async () => {
		fetchPrices();
		await loadSession();

		await fetchStashData();
	});

	async function fetchPrices() {
		console.log('Fetching Prices');
		tft = await fetch(
			'https://raw.githubusercontent.com/The-Forbidden-Trove/tft-data-prices/master/lsc/bulk-expedition.json'
		);
		tft = tft.data;
	}

	async function loadStashData() {
		stashData = await store.get('stashData');
	}

	async function fetchStashData() {
		console.log('Fetching Stash Data');
		const options = {
			method: 'GET',
			headers: {
				cookie: `POESESSID=${$sessionIDStore}`
			}
		};
		const res = await fetch(
			`https://www.pathofexile.com/character-window/get-stash-items?accountName=${$accNameStore}&realm=pc&league=${$leagueStore}&tabIndex=${$stashIndexStore}`,
			options
		);

		if (res.status == 200) {
			await storeStashData(res);
		} else {
			await store.set('stashData', {
				sunCount: 0,
				scytheCount: 0,
				chaliceCount: 0,
				circleCount: 0
			});
		}
		await loadStashData();
	}

	async function storeStashData(stashData: any) {
		let factionCount = [0, 0, 0, 0];
		let bestFaction;
		for (var i = 0; i < stashData.data.items.length; i++) {
			let item = stashData.data.items[i];
			if (
				item.baseType.toString() == 'Expedition Logbook' &&
				(item.corrupted == false || item.corrupted == undefined)
			) {
				bestFaction = [0, 0, 0, 0];
				for (var j = 0; j < item.logbookMods.length; j++) {
					switch (item.logbookMods[j].faction.name) {
						case 'Knights of the Sun':
							bestFaction[0] = 4;
							break;
						case 'Black Scythe Mercenaries':
							bestFaction[1] = 3;
							break;
						case 'Order of the Chalice':
							bestFaction[2] = 2;
							break;
						case 'Druids of the Broken Circle':
							bestFaction[3] = 1;
							break;
					}
				}
				factionCount[bestFaction.indexOf(Math.max(...bestFaction))]++;
			}
		}

		await store.set('stashData', {
			sunCount: factionCount[0],
			scytheCount: factionCount[1],
			chaliceCount: factionCount[2],
			circleCount: factionCount[3]
		});
		await store.save();
	}
</script>

<div class="content">
	<div class="input-container">
		<SessionModule />
		{#if tft}
			<div class="price-container">
				Current TFT Prices:
				<div class="logbook-row">
					<div>{tft.data[4].name}</div>
					<div>{tft.data[4].chaos}c</div>
				</div>
				<div class="logbook-row">
					<div>{tft.data[5].name}</div>
					<div>{tft.data[5].chaos}c</div>
				</div>
				<div class="logbook-row">
					<div>{tft.data[6].name}</div>

					<div>{tft.data[6].chaos}c</div>
				</div>
				<div class="logbook-row">
					<div>{tft.data[7].name}</div>
					<div>{tft.data[7].chaos}c</div>
				</div>
			</div>
		{/if}
	</div>

	<div class="logbook-container">
		<div class="logbook-col">
			{#if stashData}
				Your Logbook Data:
				<div class="logbook-row">{stashData.sunCount}x Knights of the Sun</div>
				<div class="logbook-row">{stashData.scytheCount}x Black Scythe Mercenaries</div>
				<div class="logbook-row">{stashData.chaliceCount}x Order of the Chalice</div>
				<div class="logbook-row">{stashData.circleCount}x Druids of the Broken Circle</div>
			{/if}<button on:click={fetchStashData}>Fetch Stash Data</button>
		</div>
		<div class="logbook-col">
			{#if stashData}
				Values:
				<div class="logbook-row">{stashData.sunCount * tft.data[4].chaos}c</div>
				<div class="logbook-row">{stashData.scytheCount * tft.data[5].chaos}c</div>
				<div class="logbook-row">{stashData.chaliceCount * tft.data[6].chaos}c</div>
				<div class="logbook-row">{stashData.circleCount * tft.data[7].chaos}c</div>
				<div class="logbook-row total-value-row">
					Total Value: {stashData.sunCount * tft.data[4].chaos +
						stashData.scytheCount * tft.data[5].chaos +
						stashData.chaliceCount * tft.data[6].chaos +
						stashData.circleCount * tft.data[7].chaos}c
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.content {
		display: flex;
		flex-direction: row;
		color: #fff;
	}
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
	.total-value-row {
		padding-left: 0px;
		font-weight: bold;
		padding-top: 0.7rem;
	}
	.logbook-container {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding: 16px;
		padding-left: 3rem;
		max-width: 10%;
		min-width: 25rem;
	}
	.input-container {
		min-width: 20rem;
		padding: 16px;
		display: flex;
		flex-direction: column;
		max-width: 7%;
	}
</style>
