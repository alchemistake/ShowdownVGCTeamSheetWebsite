import { Generations, type PokemonSet } from '@pkmn/data';
import { Dex } from '@pkmn/dex';
import { Team } from '@pkmn/sets';
import type { Stat } from '../types/stats';

const DEFAULT_GEN = 9;

export interface ParsedSet {
	species?: string;
	item?: string;
	ability?: string;
	level?: number;
	nature?: string;
	baseStats?: Record<Stat, number>;
	evs?: Partial<Record<Stat, number>>;

	moves: string[];
}

export function parseShowdownTeam(text: string): PokemonSet[] {
	const gens = new Generations(Dex);
	const gen = gens.get(DEFAULT_GEN);
	const teamImport = Team.fromString(text, gen as never);
	if (!teamImport) throw new Error('Failed to parse team. Please check the format and try again.');

	return teamImport.team.map((set) => {
		const parsedSet = parseShowdownSet(set);
		if (!parsedSet) throw new Error('Failed to parse set. Please check the format and try again.');

		return parsedSet;
	});
}

export function parseShowdownSet(
	set: Partial<PokemonSet<string>>,
): PokemonSet | null {
	if (!set) throw new Error('Failed to parse set. Please check the format and try again.');
	if (!set.species) return null;

	const maxIVs = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };

	const parsed: PokemonSet = {
		name: set.name || set.species,
		item: set.item || '',
		ability: set.ability || '',
		nature: set.nature || '',
		species: set.species,
		gender: set.gender || '',
		evs: set.evs || { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
		level: set.level || 50,
		moves: set.moves || [],
		ivs: maxIVs,
		teraType: set.teraType,
	};

	return parsed;
}
