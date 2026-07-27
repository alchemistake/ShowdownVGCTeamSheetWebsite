import type { PokemonSet, Team } from "@pkmn/sets";

export type ShowdownTeam = Team<Partial<PokemonSet<string>>> | undefined