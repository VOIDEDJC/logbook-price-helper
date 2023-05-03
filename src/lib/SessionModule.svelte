<script context="module" lang="ts">
	import { store } from './store';

	export let userSession: any;
	var accName = '';
	var sessionID = '';
	var league = '';
	var stashIndex = '';

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
			//fetchStashData();
		}
	}

	export async function loadSession() {
		console.log('loadSession:');

		userSession = await store.get('userSession');
		accName = userSession.accName;
		sessionID = userSession.sessionID;
		league = userSession.league;
		stashIndex = userSession.stashIndex;

		console.log(accName, sessionID, league, stashIndex);
		console.log(userSession);
		console.log(
			userSession.accName,
			userSession.sessionID,
			userSession.league,
			userSession.stashIndex
		);
	}

	export async function load() {
		console.log('loading module');
		await loadSession();
	}
</script>

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
