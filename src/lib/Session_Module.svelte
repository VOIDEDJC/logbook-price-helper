<script context="module" lang="ts">
	import { fetchStashData } from './Stash_Module.svelte';
	import { store } from './store';
	import { accNameStore, sessionIDStore, leagueStore, stashIndexStore } from './stores.js';
	let userSession: any;

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

	async function createSession() {
		if (accName == '' || sessionID == '' || league == '') {
		} else {
			await store.set('userSession', {
				accName: accName,
				sessionID: sessionID,
				league: league,
				stashIndex: stashIndex
			});
			await store.save();
			await loadSession();
			await fetchStashData();
		}
	}

	export async function loadSession() {
		userSession = await store.get('userSession');
		accNameStore.set(userSession.accName);
		sessionIDStore.set(userSession.sessionID);
		leagueStore.set(userSession.league);
		stashIndexStore.set(userSession.stashIndex);
	}
</script>

Create or Renew your Session:
<div class="data-div">
	<label for="accName">Account Name:</label>

	<input type="text" id="accName" name="accName" bind:value={$accNameStore} required />
</div>
<div class="data-div">
	<label for="sessionID">SessionID:</label>

	<input type="password" id="sessionID" name="sessionID" bind:value={$sessionIDStore} required />
</div>
<div class="data-div">
	<label for="league">League:</label>

	<input type="text" id="league" name="league" bind:value={$leagueStore} required />
</div>
<div class="data-div">
	<label for="stashIndex">Stash-Index:</label>

	<input type="number" id="stashIndex" name="stashIndex" bind:value={$stashIndexStore} required />
</div>
<div><button on:click={createSession}>Create or Renew Session</button></div>

<style>
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
</style>
