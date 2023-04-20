<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	$: ({ userSession, tft } = data);
</script>

<h1>Logbook Pricing Tool</h1>
<div class="content">
	<form action="?/createSession" method="POST">
		Add or Renew your Session:
		<div class="data-div">
			<label for="accName">Account Name:</label>
			<input type="text" id="accName" name="accName" value={userSession[0].accName} required />
		</div>
		<div class="data-div">
			<label for="sessionID">SessionID:</label>
			<input type="password" id="sessionID" name="sessionID" />
		</div>
		<div class="data-div">
			<label for="league">League:</label>
			<input type="text" id="league" name="league" value={userSession[0].league} />
		</div>
		<div class="data-div">
			<label for="stashIndex">stashIndex:</label>
			<input type="number" id="stashIndex" name="stashIndex" value={userSession[0].stashIndex} />
		</div>
		<div><button type="submit">Add or Renew Session</button></div>
	</form>
	<div class="current-prices">
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
</div>

<style>
	:global(body) {
		font-family: sans-serif;
		background-color: #222;
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
	.content {
		display: flex;
		flex-direction: row;
		color: #fff;
	}
	.current-prices {
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
