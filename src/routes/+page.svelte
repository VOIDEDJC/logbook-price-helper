<script lang="ts">
	import type { PageData } from './$types';
	import { fetch } from '@tauri-apps/api/http';
	import { Store } from 'tauri-plugin-store-api';
	import { onMount } from 'svelte';

	export let data: PageData;

	onMount(() => {
		fetchPrices();
		loadSession();
		setTimeout(() => {
			fetchStashData();
		}, 1000);
	});
	const store = new Store('.settings.dat');

	var accName = '';
	var sessionID = '';
	var league = '';
	var stashIndex = '';

	// @ts-ignore
	$: ({ userSession, tft, stashData } = data);

	async function fetchPrices() {
		tft = await fetch(
			'https://raw.githubusercontent.com/The-Forbidden-Trove/tft-data-prices/master/lsc/bulk-expedition.json'
		);
		tft = tft.data;
	}

	async function createSession() {
		console.log(accName, sessionID, league, stashIndex);
		if (accName == '' || sessionID == '' || league == '') {
		} else {
			console.log(await store.get('userSession'));
			await store.set('userSession', {
				accName: accName,
				sessionID: sessionID,
				league: league,
				stashIndex: stashIndex
			});
			await store.save();
			await loadSession();
			fetchStashData();
		}
	}

	async function loadSession() {
		userSession = await store.get('userSession');
		accName = userSession.accName;
		sessionID = userSession.sessionID;
		league = userSession.league;
		stashIndex = userSession.stashIndex;
	}
	async function loadStashData() {
		stashData = await store.get('stashData');
	}
	async function fetchStashData() {
		const options = {
			method: 'GET',
			headers: {
				cookie: `POESESSID=${userSession.sessionID}`
			}
		};
		const res = await fetch(
			`https://www.pathofexile.com/character-window/get-stash-items?accountName=${accName}&realm=pc&league=${userSession.league}&tabIndex=${userSession.stashIndex}`,
			options
		);

		console.log(res);
		if (res.status == 200) {
			await _storeStashData(res);
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
	async function _storeStashData(stashData: any) {
		let factionCount = [0, 0, 0, 0];
		let bestFaction;
		for (var i = 0; i < stashData.data.items.length; i++) {
			let item = stashData.data.items[i];
			if (item.baseType.toString() == 'Expedition Logbook') {
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

				//factionCount[bestFaction.findIndex((count, index) => index !== 0 && count === Math.max(...bestFaction.slice(1)))]++;
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
		Create or Renew your Session:
		<div class="data-div">
			<label for="accName">Account Name:</label>

			<input type="text" id="accName" name="accName" bind:value={accName} required />
		</div>
		<div class="data-div">
			<label for="sessionID">SessionID:</label>

			<input type="password" id="sessionID" name="sessionID" bind:value={sessionID} required />
		</div>
		<div class="data-div">
			<label for="league">League:</label>

			<input type="text" id="league" name="league" bind:value={league} required />
		</div>
		<div class="data-div">
			<label for="stashIndex">Stashindex:</label>

			<input type="number" id="stashIndex" name="stashIndex" bind:value={stashIndex} required />
		</div>
		<div><button on:click={createSession}>Create or Renew Session</button></div>
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
	:global(body) {
		font-family: sans-serif;
		background-color: #222;
		display: flex;
		flex-direction: column;
		max-width: 500px;
	}
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
	.data-div {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-top: 10px;
	}
	label {
		padding-top: 15px;
		padding-bottom: 5px;
	}
	input {
		padding: 0.7rem;
		border: none;
		border-radius: 4px;
		background-color: #333;
		color: #fff;
	}
	input:focus {
		outline: #45a049 solid 1px;
	}
	button {
		background-color: #4caf50;
		padding: 0.7rem;
		margin-top: 10px;
		border: none;
		font-size: 1.1rem;
		color: #fff;
	}
	button:hover {
		background-color: #45a049;
	}
</style>
