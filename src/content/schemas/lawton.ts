import { z } from 'astro/zod';
import { optNum, playerRef } from './shared';

export const lawtonStatLine = z.object({
	playerName: z.string(),
	player: playerRef,
	team: z.string().optional(),
	g: optNum,
	pts: optNum,
	ppg: optNum,
	reb: optNum,
	rpg: optNum,
	ast: optNum,
	apg: optNum,
	intangibles: optNum,
	ipg: optNum,
	w: optNum,
	winPct: optNum,
	pf: optNum,
	pa: optNum,
	plusMinus: optNum,
	war: optNum,
	draftPosition: z.string().optional(),
	bpiRank: optNum,
	value: optNum,
	bpi: optNum,
	rings: z.number().default(0),
});

export const lawtonStandingsRow = z.object({
	team: z.string(),
	g: optNum,
	w: optNum,
	l: optNum,
	pf: optNum,
	pa: optNum,
	diff: optNum,
});

export const lawtonScheduleRow = z.object({
	game: z.number(),
	round: z.string().optional(),
	home: z.string(),
	homeScore: optNum,
	away: z.string(),
	awayScore: optNum,
});

export type LawtonStatLine = z.infer<typeof lawtonStatLine>;
export type LawtonStandingsRow = z.infer<typeof lawtonStandingsRow>;
export type LawtonScheduleRow = z.infer<typeof lawtonScheduleRow>;
