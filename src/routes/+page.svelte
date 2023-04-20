<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	$: ({ userSession, tft } = data);
</script>

<h1>Logbook Pricing Tool</h1>
<form action="?/createSession" method="POST">
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

<style>
	:global(body) {
		font-family: sans-serif;
		background-color: #333;
		display: flex;
		flex-direction: column;
		background-color: gray;
		min-height: 100vh;
	}
	.data-div {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-top: 10px;
	}
	form {
		background-color: #222;
		min-width: 30rem;
		padding: 16px;
		color: #fff;
		display: flex;
		flex-direction: column;
		max-width: 7%;
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
