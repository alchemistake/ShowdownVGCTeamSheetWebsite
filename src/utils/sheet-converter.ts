import { StatKeys, type Stats } from "../types/stats";
import type { PokemonSet } from "../types/pokemon-set";
import type { VGCSheet, VGCSheetPokemon } from "../types/vgc-sheet";
import { statEvaluatorOriginal, statEvaluatorChampions } from "./statEvaluator";
import { FormRequiredSpecies } from "../data/form-required-species";
import type { Dex } from "@pkmn/data";
import type { Species } from "@pkmn/dex-types";
import type { PlayerInformation } from "../types/player-information";

/**
 * Converts a list of Pokémon sets into a VGC (Video Game Championships) team sheet format.
 *
 * @param teamSetList - An array of Pokémon sets to convert
 * @param dex - The Pokédex data source used to retrieve species information
 *
 * @returns A VGCSheet containing formatted data for each Pokémon in the team, or undefined
 */
export function getVGCSheet(teamSetList: PokemonSet[], dex: Dex, format: 'gen9' | 'champions', info: PlayerInformation): VGCSheet | undefined {
	const teamDexIds = teamSetList.map((set) => set.species);
	if (teamDexIds.length === 0 || teamDexIds.length > 6) return;

	const speciesData = teamDexIds.map((id) => dex.species.get(id));
	if (speciesData.length === 0) return;

	if (speciesData.length !== teamSetList.length) {
		console.error("Mismatch between species data and team set list lengths");
		return;
	}

	const vgcSheetData: VGCSheet = {
		format: format,
		team: [],
		playerInformation: info
	};
	const isChampionsFormat = vgcSheetData.format === "champions";

	for (const [index, set] of teamSetList.entries()) {
		const species = speciesData[index];

		const vgcPokemon = createVGCSheetPokemon(set, species, isChampionsFormat);
		vgcSheetData.team.push(vgcPokemon);
	}

	return vgcSheetData;
}

/**
 * Converts a PokemonSet into a VGCSheetPokemon format.
 *
 * This function transforms Pokémon data into the format required for VGC team sheets,
 * calculating the final stats based on species base stats, IVs, EVs, level, and nature.
 *
 * @param set - The Pokémon set containing species, moves, ability, item, etc.
 * @param species - The Dex entry containing base stats and types information for the Pokémon
 * @returns A VGCSheetPokemon object with all required fields for a VGC team sheet
 */
function createVGCSheetPokemon(set: PokemonSet, species: Species, isChampionsFormat: boolean): VGCSheetPokemon {
	const getName = () => {
		if (FormRequiredSpecies.some(formSpecies => species.name == formSpecies)) {
			return `${species.baseSpecies}-${species.baseForme}`;
		}
		return species.name;
	}

	const vgcPokemon: VGCSheetPokemon = {
		name: getName(),
		tera: isChampionsFormat ? 'None' : set.teraType ?? species.types[0], // Default to first type if Tera Type is not specified in non-Champions format
		ability: set.ability,
		item: set.item,
		moves: set.moves,
		level: set.level,
		stats: {} as Stats,
		nature: set.nature,
	};

	for (const statKey of StatKeys) {
		if (isChampionsFormat) {
			vgcPokemon.stats[statKey] = statEvaluatorChampions(
				statKey,
				species.baseStats[statKey],
				set.evs[statKey] ?? 0,
				set.nature.length > 0 ? set.nature : "Serious",
			);
		} else {
			vgcPokemon.stats[statKey] = statEvaluatorOriginal(
				statKey,
				species.baseStats[statKey],
				set.ivs[statKey] ?? 0,
				set.evs[statKey] ?? 0,
				set.level,
				set.nature.length > 0 ? set.nature : "Serious",
			);
		}
	}

	return vgcPokemon;
}
