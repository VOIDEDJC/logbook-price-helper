<script context="module" lang="ts">
	import { messageStore } from './stores.js';
	import {
		sunPriceStore,
		scythePriceStore,
		chalicePriceStore,
		circlePriceStore,
		sunCountStore,
		scytheCountStore,
		chaliceCountStore,
		circleCountStore
	} from '../lib/stores.js';

	let sunCount: number;
	let scytheCount: number;
	let chaliceCount: number;
	let circleCount: number;
	let sunPrice: number;
	let scythePrice: number;
	let chalicePrice: number;
	let circlePrice: number;

	sunCountStore.subscribe((value) => {
		sunCount = value;
	});
	scytheCountStore.subscribe((value) => {
		scytheCount = value;
	});
	chaliceCountStore.subscribe((value) => {
		chaliceCount = value;
	});
	circleCountStore.subscribe((value) => {
		circleCount = value;
	});
	sunPriceStore.subscribe((value) => {
		sunPrice = value;
	});
	scythePriceStore.subscribe((value) => {
		scythePrice = value;
	});
	chalicePriceStore.subscribe((value) => {
		chalicePrice = value;
	});
	circlePriceStore.subscribe((value) => {
		circlePrice = value;
	});

	export function generateMessage() {
		let message: string = 'WTS Softcore\n';
		message = message.concat('Logbooks ilvl81+ (non corrupted)\n');
		if (sunCount > 0) {
			message = message.concat(sunCount + 'x Sun - ' + sunPrice + 'c each\n');
		}
		if (scytheCount > 0) {
			message = message.concat(scytheCount + 'x Scythe - ' + scythePrice + 'c each\n');
		}
		if (chaliceCount > 0) {
			message = message.concat(chaliceCount + 'x Chalice - ' + chalicePrice + 'c each\n');
		}
		if (circleCount > 0) {
			message = message.concat(circleCount + 'x Circle - ' + circlePrice + 'c each\n');
		}
		message = message.concat('IGN: ');
		messageStore.set(message);
	}
</script>

<div>
	<textarea bind:value={$messageStore} />
</div>

<style>
	textarea {
		width: 100%;
		height: 8rem;
		margin-top: 6.2rem;
		color: #fff;
		background-color: #333;
		resize: none;
	}
</style>
