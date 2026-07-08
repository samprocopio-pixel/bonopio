import { z } from 'astro/zod';
import { optNum, playerRef } from './shared';

export const bgaCareerRow = z.object({
	rank: optNum,
	firstName: z.string(),
	lastName: z.string(),
	player: playerRef,
	careerAvg: optNum,
	interbayAvg: optNum,
	jacksonAvg: optNum,
	jeffersonAvg: optNum,
	greenlakeAvg: optNum,
	war: optNum,
	byVenueYear: z
		.array(
			z.object({
				year: z.number(),
				venue: z.string(),
				avg: optNum,
			}),
		)
		.default([]),
});

export const bgaIndividualRanking = z.object({
	rank: optNum,
	playerName: z.string(),
	player: playerRef,
	avg: optNum,
	totalPoints: optNum,
	interbay: optNum,
	jackson: optNum,
	jefferson: optNum,
	greenlake: optNum,
	war: optNum,
});

export const bgaTeamRanking = z.object({
	team: z.string(),
	totalPoints: optNum,
});

export const bgaVenueIndividualResult = z.object({
	rank: optNum,
	playerName: z.string(),
	player: playerRef,
	par: optNum,
});

export const bgaVenueTeamResult = z.object({
	team: z.string(),
	roundScores: z.array(z.number()).default([]),
	total: optNum,
});

export type BgaCareerRow = z.infer<typeof bgaCareerRow>;
export type BgaIndividualRanking = z.infer<typeof bgaIndividualRanking>;
export type BgaTeamRanking = z.infer<typeof bgaTeamRanking>;
export type BgaVenueIndividualResult = z.infer<typeof bgaVenueIndividualResult>;
export type BgaVenueTeamResult = z.infer<typeof bgaVenueTeamResult>;
