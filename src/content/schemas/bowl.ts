import { z } from 'astro/zod';
import { optNum, playerRef } from './shared';

export const bowlScoreRow = z.object({
	team: z.string(),
	firstHalf: optNum,
	secondHalf: optNum,
	final: optNum,
});

export const bowlTeamTotals = z.object({
	team: z.string(),
	receptions: optNum,
	touchdowns: optNum,
	kickAttempts: optNum,
	kickMakes: optNum,
	tackles: optNum,
	sacks: optNum,
	interceptions: optNum,
});

export const draftPick = z.object({
	pick: z.number().optional(),
	playerName: z.string(),
	player: playerRef,
	war: optNum,
});

export const combineRow = z.object({
	rank: z.number(),
	playerName: z.string(),
	player: playerRef,
	stars: z.number().min(1).max(5),
	grade: z.number().min(0).max(99).optional(),
});

export const bowlStatLeader = z.object({
	team: z.string(),
	category: z.enum(['REC', 'TD', 'KA/KM', 'TCKL', 'SACK', 'INT']),
	playerName: z.string(),
	player: playerRef,
	value: z.string(),
});

export const bowlCareerRow = z.object({
	playerName: z.string(),
	player: playerRef,
	titles: optNum,
	touchdowns: optNum,
	combineStars: z.number().min(1).max(5).optional(),
	war: optNum,
});

export type BowlScoreRow = z.infer<typeof bowlScoreRow>;
export type BowlTeamTotals = z.infer<typeof bowlTeamTotals>;
export type DraftPick = z.infer<typeof draftPick>;
export type CombineRow = z.infer<typeof combineRow>;
export type BowlStatLeader = z.infer<typeof bowlStatLeader>;
export type BowlCareerRow = z.infer<typeof bowlCareerRow>;
