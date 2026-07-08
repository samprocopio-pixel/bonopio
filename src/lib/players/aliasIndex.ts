import { getCollection } from 'astro:content';

export type AliasIndex = Map<string, string[]>;

function normalize(name: string): string {
	return name.trim().toLowerCase();
}

export async function buildAliasIndex(): Promise<AliasIndex> {
	const players = await getCollection('players');
	const index: AliasIndex = new Map();

	const add = (alias: string, slug: string) => {
		const key = normalize(alias);
		if (!key) return;
		const existing = index.get(key);
		if (existing) {
			if (!existing.includes(slug)) existing.push(slug);
		} else {
			index.set(key, [slug]);
		}
	};

	for (const player of players) {
		add(player.data.name, player.id);
		for (const alias of player.data.aliases.lawton) add(alias, player.id);
		for (const alias of player.data.aliases.boroughs) add(alias, player.id);
		for (const alias of player.data.aliases.bgaTour) add(alias, player.id);
		for (const alias of player.data.aliases.bowl) add(alias, player.id);
	}

	return index;
}

export function resolvePlayers(name: string, index: AliasIndex): string[] {
	return index.get(normalize(name)) ?? [];
}

export function matchesPlayer(
	slug: string,
	playerName: string,
	playerRef: { collection: 'players'; id: string } | undefined,
	index: AliasIndex,
): boolean {
	if (playerRef?.id === slug) return true;
	return resolvePlayers(playerName, index).includes(slug);
}
