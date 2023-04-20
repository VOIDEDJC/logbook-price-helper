import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const userSession = await prisma.session.findMany();
	const res = await fetch(
		'https://raw.githubusercontent.com/The-Forbidden-Trove/tft-data-prices/master/lsc/bulk-expedition.json'
	);
	const tft = await res.json();
	return {
		userSession: userSession,
		tft: tft
		//stashData: stashData
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
