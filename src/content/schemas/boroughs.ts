import { z } from 'astro/zod';
import { optNum, playerRef } from './shared';

export const hittingLine = z.object({
	playerName: z.string(),
	player: playerRef,
	team: z.string().optional(),
	g: optNum,
	ab: optNum,
	h: optNum,
	bb: optNum,
	single: optNum,
	double: optNum,
	hr: optNum,
	r: optNum,
	rbi: optNum,
	k: optNum,
	avg: optNum,
	obp: optNum,
	war: optNum,
});

export const pitchingLine = z.object({
	playerName: z.string(),
	player: playerRef,
	team: z.string().optional(),
	g: optNum,
	ip: optNum,
	w: optNum,
	l: optNum,
	s: optNum,
	h: optNum,
	er: optNum,
	bb: optNum,
	k: optNum,
	hr: optNum,
	whip: optNum,
	era: optNum,
	war: optNum,
});

export const boroughsOverallRow = z.object({
	playerName: z.string(),
	player: playerRef,
	team: z.string().optional(),
	g: optNum,
	teamWins: optNum,
	championships: optNum,
	ab: optNum,
	h: optNum,
	hr: optNum,
	r: optNum,
	rbi: optNum,
	avg: optNum,
	hittingWar: optNum,
	gp: optNum,
	pitchingK: optNum,
	pitchingW: optNum,
	whip: optNum,
	era: optNum,
	pitchingWar: optNum,
	totalWar: optNum,
});

export const boroughsStandingsRow = z.object({
	team: z.string(),
	g: optNum,
	w: optNum,
	l: optNum,
	pf: optNum,
	pa: optNum,
	diff: optNum,
});

export function regionGroup<T extends z.ZodTypeAny>(rowSchema: T) {
	return z.object({
		region: z.string(),
		rows: z.array(rowSchema),
	});
}

export type HittingLine = z.infer<typeof hittingLine>;
export type PitchingLine = z.infer<typeof pitchingLine>;
export type BoroughsStandingsRow = z.infer<typeof boroughsStandingsRow>;
export type BoroughsOverallRow = z.infer<typeof boroughsOverallRow>;
