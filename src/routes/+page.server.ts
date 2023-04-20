import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { fail } from '@sveltejs/kit';
import bcrypt from 'bcrypt';

export const load: PageServerLoad = async () => {
	const userSession = await prisma.session.findMany();
	var stashData;
	const res = await fetch(
		'https://raw.githubusercontent.com/The-Forbidden-Trove/tft-data-prices/master/lsc/bulk-expedition.json'
	);
	const tft = await res.json();
	console.log(tft);
	const res2 = await fetch(
		`https://www.pathofexile.com/character-window/get-stash-items?accountName=${userSession[0].accName}}&realm=pc&league=${userSession[0].league}}&tabIndex=${userSession[0].stashIndex}`
	);
	if (res2.status == 200) {
		stashData = await res2.json();
	}
	return {
		userSession: userSession,
		tft: tft,
		stashData: stashData
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
			return fail(500, { message: 'Could not create the Session.' });
		}
		return {
			status: 201
		};
	}
};
