import { type Dex, type PokemonSet } from "@pkmn/data";
import type { Format } from "../types/format";
import type { VGCPokemon, VGCTeam } from "../types/vgc-team";
import { FormRequiredSpecies } from "../data/form-required-species";
import { calcStatChampions, calcStatOriginal } from "./stat-calc";
import type { StatID } from "@pkmn/dex";
import type { Species } from "@pkmn/dex-types";
import type { ShowdownTeam } from "../types/showdown-team";

export function getVGCTeam(showdownTeam: ShowdownTeam, dex: Dex, format: Format): VGCTeam {
    if (!showdownTeam) return;

    const team = showdownTeam.team;
    if (!team) return;

    const teamDexIds = team.map((set) => set.species);
    if (teamDexIds.length === 0 || teamDexIds.length > 6) return;

    const speciesData = teamDexIds.map((id) => dex.species.get(id!));
    if (speciesData.length === 0) return;

    if (speciesData.length !== team.length) {
        console.error("Mismatch between species data and team set list lengths");
        return;
    }

    const isChampionsFormat = format === "champions";
    const vgcTeam: VGCTeam = [];

    team.forEach((set, index) => {
        const species = speciesData[index];

        const vgcPokemon = createVGCSheetPokemon(set, species, isChampionsFormat);
        vgcTeam.push(vgcPokemon);
    })

    return vgcTeam;
}

function createVGCSheetPokemon(set: Partial<PokemonSet<string>>, species: Species, isChampionsFormat: boolean): VGCPokemon {
    const getName = () => {
        if (FormRequiredSpecies.some(formSpecies => species.name == formSpecies)) {
            return `${species.baseSpecies}-${species.baseForme}`;
        }
        return species.name;
    }

    const nature = set.nature?.length ? set.nature : "Serious";
    const level = set.level ?? 50;
    const evs = (set.evs ?? {}) as Partial<Record<StatID, number>>;
    const ivs = (set.ivs ?? {}) as Partial<Record<StatID, number>>;

    const vgcPokemon: VGCPokemon = {
        name: getName(),
        teraType: isChampionsFormat ? undefined : set.teraType ?? species.types[0], // Default to first type if Tera Type is not specified in non-Champions format
        ability: set.ability,
        item: set.item,
        moves: set.moves ?? [],
        level,
        nature,
        gender: set.gender,
        species: set.species ?? species.name,
        stats: {
            hp: 0,
            atk: 0,
            def: 0,
            spa: 0,
            spd: 0,
            spe: 0
        }
    };

    for (const statKey of Object.keys(vgcPokemon.stats)) {
        const statId = statKey as StatID;
        if (isChampionsFormat) {
            vgcPokemon.stats[statId] = calcStatChampions(
                statId,
                species.baseStats[statId],
                evs[statId] ?? 0,
                nature,
            );
        } else {
            vgcPokemon.stats[statId] = calcStatOriginal(
                statId,
                species.baseStats[statId],
                ivs[statId] ?? 0,
                evs[statId] ?? 0,
                level,
                nature,
            );
        }
    }

    return vgcPokemon;
}
