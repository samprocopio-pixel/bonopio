import { getCollection } from 'astro:content';
import { getAllPlayerSlugs, getPlayerProfile } from './players/profile';

export interface RankingRow {
	rank: number;
	playerSlug?: string;
	playerName: string;
	value: string;
}

export interface RankingBoard {
	slug: string;
	title: string;
	description: string;
	rows: RankingRow[];
}

async function buildLawtonRingsBoard(): Promise<RankingBoard> {
	const careerEntries = await getCollection('lawtonCareer');
	const stats = careerEntries.flatMap((e) => e.data.stats);
	const sorted = [...stats].filter((s) => s.rings > 0).sort((a, b) => b.rings - a.rings);

	return {
		slug: 'lawton-rings-leaders',
		title: 'Lawton Rings Leaders',
		description: 'Most championships won across all Lawton seasons.',
		rows: sorted.map((s, i) => ({
			rank: i + 1,
			playerSlug: s.player?.id,
			playerName: s.playerName,
			value: `${s.rings} ring${s.rings === 1 ? '' : 's'}`,
		})),
	};
}

async function buildBgaCareerAvgBoard(): Promise<RankingBoard> {
	const careerEntries = await getCollection('bgaCareer');
	const rows = careerEntries.flatMap((e) => e.data.rows);
	const sorted = [...rows]
		.filter((r) => r.careerAvg !== undefined)
		.sort((a, b) => (a.careerAvg ?? Infinity) - (b.careerAvg ?? Infinity));

	return {
		slug: 'bga-career-average-leaders',
		title: 'BGA Career Average Leaders',
		description: 'Lowest career scoring average across all BGA Tour venues (lower is better).',
		rows: sorted.map((r, i) => ({
			rank: i + 1,
			playerSlug: r.player?.id,
			playerName: `${r.firstName} ${r.lastName}`,
			value: (r.careerAvg as number).toFixed(1),
		})),
	};
}

async function buildMostAppearancesBoard(): Promise<RankingBoard> {
	const slugs = await getAllPlayerSlugs();
	const profiles = await Promise.all(slugs.map((slug) => getPlayerProfile(slug)));

	const rows = profiles
		.filter((p): p is NonNullable<typeof p> => Boolean(p))
		.map((p) => {
			const count =
				p.lawtonAppearances.length +
				p.boroughsHittingAppearances.length +
				p.boroughsPitchingAppearances.length +
				p.bgaSeasonAppearances.length +
				p.bgaVenueAppearances.length +
				p.bowlAppearances.length;
			return { slug: p.slug, name: p.name, count };
		})
		.filter((p) => p.count > 0)
		.sort((a, b) => b.count - a.count);

	return {
		slug: 'most-combined-appearances',
		title: 'Most Combined Appearances Across All Leagues',
		description: 'Total recorded stat-line appearances across Lawton, Boroughs, BGA Tour, and Bonopio Bowl.',
		rows: rows.map((r, i) => ({
			rank: i + 1,
			playerSlug: r.slug,
			playerName: r.name,
			value: `${r.count} appearances`,
		})),
	};
}

const BOARD_BUILDERS = [buildLawtonRingsBoard, buildBgaCareerAvgBoard, buildMostAppearancesBoard];

export async function getRankingBoards(): Promise<RankingBoard[]> {
	return Promise.all(BOARD_BUILDERS.map((build) => build()));
}

export async function getRankingBoard(slug: string): Promise<RankingBoard | undefined> {
	const boards = await getRankingBoards();
	return boards.find((b) => b.slug === slug);
}
