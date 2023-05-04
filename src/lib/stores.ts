import { writable } from 'svelte/store';

export let accNameStore = writable('');
export let sessionIDStore = writable('');
export let leagueStore = writable('');
export let stashIndexStore = writable('');

export let sunPriceStore = writable(0);
export let scythePriceStore = writable(0);
export let chalicePriceStore = writable(0);
export let circlePriceStore = writable(0);
