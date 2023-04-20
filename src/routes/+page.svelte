<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	$: ({ userSession, tft } = data);
</script>

<div class="content">
	<form action="?/createSession" method="POST">
		Add or Renew your Session:
		<div class="data-div">
			<label for="accName">Account Name:</label>
			{#if userSession}
				<input type="text" id="accName" name="accName" value={userSession.accName} required />
			{:else}
				<input type="text" id="accName" name="accName" required />
			{/if}
		</div>
		<div class="data-div">
			<label for="sessionID">SessionID:</label>
			{#if userSession}
				<input
					type="password"
					id="sessionID"
					name="sessionID"
					value={userSession.sessionID}
					required
				/>
			{:else}
				<input type="password" id="sessionID" name="sessionID" required />
			{/if}
		</div>
		<div class="data-div">
			<label for="league">League:</label>
			{#if userSession}
				<input type="text" id="league" name="league" value={userSession.league} required />
			{:else}
				<input type="text" id="league" name="league" required />
			{/if}
		</div>
		<div class="data-div">
			<label for="stashIndex">stashIndex:</label>
			{#if userSession}
				<input
					type="number"
					id="stashIndex"
					name="stashIndex"
					value={userSession.stashIndex}
					required
				/>
			{:else}
				<input type="number" id="stashIndex" name="stashIndex" required />
			{/if}
		</div>
		<div><button type="submit">Add or Renew Session</button></div>
	</form>
	<div class="price-container">
		Current Prices:
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
	<div class="logbook-container">
		Your Logbooks:
		<form action="?/fetchStashData" method="POST">
			<button type="submit">Fetch Stash Data</button>
		</form>
	</div>
</div>

<style>
	:global(body) {
		font-family: sans-serif;
		background-color: #222;
		display: flex;
		flex-direction: column;
	}
	.content {
		display: flex;
		flex-direction: row;
		color: #fff;
	}
	.price-container {
		display: flex;
		flex-direction: column;
		padding: 16px;
		max-width: 7%;
		min-width: 15rem;
	}
	.logbook-row {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-top: 10px;
	}
	.logbook-container {
		display: flex;
		flex-direction: column;
		padding: 16px;
		max-width: 7%;
		min-width: 15rem;
	}
	form {
		background-color: #222;
		min-width: 30rem;
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
