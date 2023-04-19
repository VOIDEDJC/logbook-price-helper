import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { fail } from '@sveltejs/kit';
import bcrypt from 'bcrypt';

export const load: PageServerLoad = async () => {
	const res = await fetch(
		'https://raw.githubusercontent.com/The-Forbidden-Trove/tft-data-prices/master/lsc/bulk-expedition.json'
	);
	const tft = await res.json();
	return {
		userSession: await prisma.session.findMany(),
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
					sessionID: await bcrypt.hash(sessionID, 10),
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
