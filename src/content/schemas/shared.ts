import { reference } from 'astro:content';
import { z } from 'astro/zod';

export const playerRef = reference('players').optional();

export const optNum = z.number().optional();
