<slot />

<style>
	:global(body) {
		font-family: sans-serif;
		background-color: #222;
		display: flex;
		flex-direction: column;
		max-width: 500px;
	}
	:global(button) {
		background-color: #4caf50;
		padding: 0.7rem;
		margin-top: 10px;
		border: none;
		font-size: 1.1rem;
		color: #fff;
	}
	:global(input) {
		padding: 0.7rem;
		border: none;
		border-radius: 4px;
		background-color: #333;
		color: #fff;
	}
	:global(input:focus) {
		outline: #45a049 solid 1px;
	}
	:global(button:hover) {
		background-color: #45a049;
	}
	:global(button:active) {
		background-color: #3e8e41;
	}
</style>
