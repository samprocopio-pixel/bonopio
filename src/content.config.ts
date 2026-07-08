import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { lawtonStatLine, lawtonStandingsRow, lawtonScheduleRow } from './content/schemas/lawton';
import {
	hittingLine,
	pitchingLine,
	regionGroup,
	boroughsStandingsRow,
	boroughsOverallRow,
} from './content/schemas/boroughs';
import {
	bgaCareerRow,
	bgaIndividualRanking,
	bgaTeamRanking,
	bgaVenueIndividualResult,
	bgaVenueTeamResult,
} from './content/schemas/bga';
import { bowlScoreRow, bowlTeamTotals, draftPick, combineRow, bowlStatLeader, bowlCareerRow } from './content/schemas/bowl';

const players = defineCollection({
	loader: glob({ pattern: '**/*.json', base: './src/content/players' }),
	schema: z.object({
		name: z.string(),
		hometown: z.string().optional(),
		bio: z.string().optional(),
		photo: z.string().optional(),
		active: z.boolean().default(true),
		aliases: z
			.object({
				lawton: z.array(z.string()).default([]),
				boroughs: z.array(z.string()).default([]),
				bgaTour: z.array(z.string()).default([]),
				bowl: z.array(z.string()).default([]),
			})
			.default({ lawton: [], boroughs: [], bgaTour: [], bowl: [] }),
	}),
});

const lawtonSeasons = defineCollection({
	loader: glob({ pattern: '*.json', base: './src/content/lawtonSeasons' }),
	schema: z.object({
		year: z.number(),
		stats: z.array(lawtonStatLine).default([]),
		standings: z.array(lawtonStandingsRow).default([]),
		schedule: z.array(lawtonScheduleRow).default([]),
	}),
});

const lawtonCareer = defineCollection({
	loader: glob({ pattern: '*.json', base: './src/content/lawtonCareer' }),
	schema: z.object({
		stats: z.array(lawtonStatLine).default([]),
	}),
});

const boroughsSeasons = defineCollection({
	loader: glob({ pattern: '*.json', base: './src/content/boroughsSeasons' }),
	schema: z.object({
		year: z.number(),
		championTeam: z.string().optional(),
		standings: z.array(boroughsStandingsRow).default([]),
		hittingByRegion: z.array(regionGroup(hittingLine)).default([]),
		pitchingByRegion: z.array(regionGroup(pitchingLine)).default([]),
		overall: z.array(boroughsOverallRow).default([]),
	}),
});

const boroughsCareer = defineCollection({
	loader: glob({ pattern: '*.json', base: './src/content/boroughsCareer' }),
	schema: z.object({
		hittingByRegion: z.array(regionGroup(hittingLine)).default([]),
		pitchingByRegion: z.array(regionGroup(pitchingLine)).default([]),
		overall: z.array(boroughsOverallRow).default([]),
	}),
});

const bgaCareer = defineCollection({
	loader: glob({ pattern: '*.json', base: './src/content/bgaCareer' }),
	schema: z.object({
		rows: z.array(bgaCareerRow).default([]),
	}),
});

const bgaSeasons = defineCollection({
	loader: glob({ pattern: '*.json', base: './src/content/bgaSeasons' }),
	schema: z.object({
		year: z.number(),
		venues: z.array(z.string()).default([]),
		individualRankings: z.array(bgaIndividualRanking).default([]),
		teamRankings: z.array(bgaTeamRanking).default([]),
	}),
});

const bgaVenues = defineCollection({
	// files live at <year>/<venue-slug>.json, e.g. 2011/interbay.json
	loader: glob({ pattern: '**/*.json', base: './src/content/bgaVenues' }),
	schema: z.object({
		year: z.number(),
		venue: z.string(),
		individualResults: z.array(bgaVenueIndividualResult).default([]),
		teamResults: z.array(bgaVenueTeamResult).default([]),
	}),
});

const bowlEditions = defineCollection({
	loader: glob({ pattern: '*.md', base: './src/content/bowlEditions' }),
	schema: z.object({
		edition: z.enum(['I', 'II', 'III']),
		title: z.string(),
		date: z.coerce.date().optional(),
		finalScore: z.array(bowlScoreRow).length(2),
		playerOfTheGame: reference('players'),
		teamTotals: z.array(bowlTeamTotals).length(2),
		rosters: z
			.array(
				z.object({
					team: z.string(),
					picks: z.array(draftPick),
				}),
			)
			.length(2),
		combineRankings: z.array(combineRow).optional(),
		statLeaders: z.array(bowlStatLeader).default([]),
	}),
});

const bowlCareer = defineCollection({
	loader: glob({ pattern: '*.json', base: './src/content/bowlCareer' }),
	schema: z.object({
		rows: z.array(bowlCareerRow).default([]),
	}),
});

const news = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
	schema: z.object({
		title: z.string(),
		pubDate: z.coerce.date(),
		summary: z.string().optional(),
		draft: z.boolean().default(false),
	}),
});

export const collections = {
	players,
	lawtonSeasons,
	lawtonCareer,
	boroughsSeasons,
	boroughsCareer,
	bgaCareer,
	bgaSeasons,
	bgaVenues,
	bowlEditions,
	bowlCareer,
	news,
};
