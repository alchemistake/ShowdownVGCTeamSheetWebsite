import type { PokemonSet, StatsTable } from "@pkmn/data";

type ExcludedPokemonSet = Omit<PokemonSet, 'evs' | 'ivs' | 'shiny' | 'happiness' | 'pokeball' | 'hpType' | 'dynamaxLevel' | 'gigantamax'>;

export interface VGCPokemon extends Partial<ExcludedPokemonSet> {
    stats: StatsTable<number>;
}

export type VGCTeam = VGCPokemon[] | undefined;