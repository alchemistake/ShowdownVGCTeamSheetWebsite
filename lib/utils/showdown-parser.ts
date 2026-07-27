import { type GenerationNum, Generations } from "@pkmn/data";
import { Dex } from "@pkmn/dex";
import { Team } from "@pkmn/sets";
import type { ShowdownTeam } from "../types/showdown-team";

export default function getShowdownTeam(
  text: string,
  genNum: GenerationNum,
): ShowdownTeam {
  try {
    const gens = new Generations(Dex);
    const gen = gens.get(genNum);
	
    const teamImport = Team.fromString(text, gen as never);
    if (!teamImport) {
      throw new Error(
        "Failed to parse team. Please check the format and try again.",
      );
    }

    return teamImport;
  } catch (error) {
    console.error(error);
  }
}
