import { getCollection, getEntry } from 'astro:content';
import { buildAliasIndex, matchesPlayer } from './aliasIndex';
import type { LawtonStatLine } from '../../content/schemas/lawton';
import type { HittingLine, PitchingLine } from '../../content/schemas/boroughs';
import type { BgaIndividualRanking, BgaVenueIndividualResult } from '../../content/schemas/bga';

export interface PlayerProfile {
	slug: string;
	name: string;
	hometown?: string;
	bio?: string;
	lawtonAppearances: { year: number; stat: LawtonStatLine }[];
	boroughsHittingAppearances: { year: number; region: string; stat: HittingLine }[];
	boroughsPitchingAppearances: { year: number; region: string; stat: PitchingLine }[];
	bgaSeasonAppearances: { year: number; ranking: BgaIndividualRanking }[];
	bgaVenueAppearances: { year: number; venue: string; venueSlug: string; result: BgaVenueIndividualResult }[];
	bowlAppearances: { edition: string; title: string; wasPlayerOfTheGame: boolean }[];
}

export async function getAllPlayerSlugs(): Promise<string[]> {
	const players = await getCollection('players');
	return players.map((p) => p.id);
}

export async function getPlayerProfile(slug: string): Promise<PlayerProfile | undefined> {
	const player = await getEntry('players', slug);
	if (!player) return undefined;

	const index = await buildAliasIndex();

	const [lawtonSeasons, boroughsSeasons, bgaSeasons, bgaVenues, bowlEditions] = await Promise.all([
		getCollection('lawtonSeasons'),
		getCollection('boroughsSeasons'),
		getCollection('bgaSeasons'),
		getCollection('bgaVenues'),
		getCollection('bowlEditions'),
	]);

	const lawtonAppearances = lawtonSeasons.flatMap((season) =>
		season.data.stats
			.filter((stat) => matchesPlayer(slug, stat.playerName, stat.player, index))
			.map((stat) => ({ year: season.data.year, stat })),
	);

	const boroughsHittingAppearances = boroughsSeasons.flatMap((season) =>
		season.data.hittingByRegion.flatMap((group) =>
			group.rows
				.filter((row) => matchesPlayer(slug, row.playerName, row.player, index))
				.map((stat) => ({ year: season.data.year, region: group.region, stat })),
		),
	);

	const boroughsPitchingAppearances = boroughsSeasons.flatMap((season) =>
		season.data.pitchingByRegion.flatMap((group) =>
			group.rows
				.filter((row) => matchesPlayer(slug, row.playerName, row.player, index))
				.map((stat) => ({ year: season.data.year, region: group.region, stat })),
		),
	);

	const bgaSeasonAppearances = bgaSeasons.flatMap((season) =>
		season.data.individualRankings
			.filter((ranking) => matchesPlayer(slug, ranking.playerName, ranking.player, index))
			.map((ranking) => ({ year: season.data.year, ranking })),
	);

	const bgaVenueAppearances = bgaVenues.flatMap((venue) =>
		venue.data.individualResults
			.filter((result) => matchesPlayer(slug, result.playerName, result.player, index))
			.map((result) => ({
				year: venue.data.year,
				venue: venue.data.venue,
				venueSlug: venue.id.split('/')[1] ?? venue.id,
				result,
			})),
	);

	const bowlAppearances = bowlEditions
		.filter((edition) => {
			const onRoster = edition.data.rosters.some((r) =>
				r.picks.some((pick) => matchesPlayer(slug, pick.playerName, pick.player, index)),
			);
			const wasPotg = edition.data.playerOfTheGame.id === slug;
			return onRoster || wasPotg;
		})
		.map((edition) => ({
			edition: edition.data.edition,
			title: edition.data.title,
			wasPlayerOfTheGame: edition.data.playerOfTheGame.id === slug,
		}));

	return {
		slug,
		name: player.data.name,
		hometown: player.data.hometown,
		bio: player.data.bio,
		lawtonAppearances,
		boroughsHittingAppearances,
		boroughsPitchingAppearances,
		bgaSeasonAppearances,
		bgaVenueAppearances,
		bowlAppearances,
	};
}
