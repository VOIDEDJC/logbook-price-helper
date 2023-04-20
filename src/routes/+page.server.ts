import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const res = await fetch(
		'https://raw.githubusercontent.com/The-Forbidden-Trove/tft-data-prices/master/lsc/bulk-expedition.json'
	);
	const tft = await res.json();
	return {
		userSession: await prisma.session.findFirst(),
		tft: tft
	};
};

export const actions: Actions = {
	createSession: async ({ request }) => {
		let { accName, sessionID, league, stashIndex } = Object.fromEntries(
			await request.formData()
		) as unknown as {
			accName: string;
			sessionID: string;
			league: string;
			stashIndex: string;
		};
		try {
			let count = await prisma.session.count({});
			if (count > 0) {
				await prisma.session.deleteMany({});
			}
			await prisma.session.create({
				data: {
					accName: accName,
					sessionID: sessionID,
					league: league,
					stashIndex: stashIndex
				}
			});
		} catch (err) {
			console.error(err);
			return fail(500, { message: 'Could not save the Session.' });
		}
		return {
			status: 201
		};
	},
	fetchStashData: async ({ request }) => {
		let session = await prisma.session.findMany();

		const opts = {
			headers: {
				cookie: `POESESSID=${session[0].sessionID}`
			}
		};
		const res = await fetch(
			`https://www.pathofexile.com/character-window/get-stash-items?accountName=${session[0].accName}&realm=pc&league=${session[0].league}&tabIndex=${session[0].stashIndex}`,
			opts
		);
		if (res.status == 200) {
			const stashData = await res.json();
			await _storeStashData(stashData);
			return {
				status: 200
			};
		}
		return {
			status: 500,
			message: 'Could not fetch stash data'
		};
	}
};
export async function _storeStashData(stashData: any) {
	console.log(stashData.items.length);
	let sunCount = 0;
	let scytheCount = 0;
	let chaliceCount = 0;
	let circleCount = 0;
	for (var i = 0; i < stashData.items.length; i++) {
		let item = stashData.items[i];
		//console.log(item);
		if (item.baseType.toString() == 'Expedition Logbook') {
			console.log(item);
			for (var j = 0; j < item.logbookMods.length; j++) {
				console.log(item.logbookMods[j].faction.name);
				switch (item.logbookMods[j].faction.name) {
					case 'Knights of the Sun':
						sunCount++;
						break;
					case 'Black Scythe Mercenaries':
						scytheCount++;
						break;
					case 'Druids of the Broken Circle':
						circleCount++;
						break;
					case 'Order of the Chalice':
						chaliceCount++;
						break;
				}
			}
		}
	}
	console.log(sunCount + ' ' + scytheCount + ' ' + circleCount + ' ' + chaliceCount);
	await prisma.session.update({
		data: {
			sunCount: sunCount,
			scytheCount: scytheCount,
			circleCount: circleCount,
			chaliceCount: chaliceCount
		},
		where: {
			id: 1
		}
	});
}
