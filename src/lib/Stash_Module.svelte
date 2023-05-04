<script context="module" lang="ts">
	import { fetch } from '@tauri-apps/api/http';
	import { store } from '../lib/store';

	import {
		accNameStore,
		sessionIDStore,
		leagueStore,
		stashIndexStore,
		sunPriceStore,
		scythePriceStore,
		chalicePriceStore,
		circlePriceStore,
		sunCountStore,
		scytheCountStore,
		chaliceCountStore,
		circleCountStore
	} from '../lib/stores.js';

	let accName = '';
	let sessionID = '';
	let league = '';
	let stashIndex = '';

	accNameStore.subscribe((value) => {
		accName = value;
	});
	sessionIDStore.subscribe((value) => {
		sessionID = value;
	});
	leagueStore.subscribe((value) => {
		league = value;
	});
	stashIndexStore.subscribe((value) => {
		stashIndex = value;
	});

	let stashData: any;

	async function loadStashData() {
		stashData = await store.get('stashData');
		sunCountStore.set(stashData.sunCount);
		scytheCountStore.set(stashData.scytheCount);
		chaliceCountStore.set(stashData.chaliceCount);
		circleCountStore.set(stashData.circleCount);
	}

	export async function fetchStashData() {
		const options = {
			method: 'GET',
			headers: {
				cookie: `POESESSID=${sessionID}`
			}
		};

		const res = await fetch(
			`https://www.pathofexile.com/character-window/get-stash-items?accountName=${accName}&realm=pc&league=${league}&tabIndex=${stashIndex}`,
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

		sunCountStore.set(factionCount[0]);
		scytheCountStore.set(factionCount[1]);
		chaliceCountStore.set(factionCount[2]);
		circleCountStore.set(factionCount[3]);
		await store.save();
	}
</script>

<div class="logbook-col">
	Your Logbook Data:
	<div class="logbook-row">{$sunCountStore}x Knights of the Sun</div>
	<div class="logbook-row">{$scytheCountStore}x Black Scythe Mercenaries</div>
	<div class="logbook-row">{$chaliceCountStore}x Order of the Chalice</div>
	<div class="logbook-row">{$circleCountStore}x Druids of the Broken Circle</div>
	<button on:click={fetchStashData}>Fetch Stash Data</button>
</div>
<div class="logbook-col">
	Values:
	<div class="logbook-row">{$sunCountStore * $sunPriceStore}c</div>
	<div class="logbook-row">{$scytheCountStore * $scythePriceStore}c</div>
	<div class="logbook-row">{$chaliceCountStore * $chalicePriceStore}c</div>
	<div class="logbook-row">{$circleCountStore * $circlePriceStore}c</div>
	<div class="logbook-row total-value-row">
		Total Value: {$sunCountStore * $sunPriceStore +
			$scytheCountStore * $scythePriceStore +
			$chaliceCountStore * $chalicePriceStore +
			$circleCountStore * $circlePriceStore}c
	</div>
</div>

<style>
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
</style>
