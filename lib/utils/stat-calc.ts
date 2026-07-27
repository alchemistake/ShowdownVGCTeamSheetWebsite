import type { StatID } from "@pkmn/data";
import natureCalc from "./nature-calc";

export function calcStatOriginal(
	stat: StatID,
	baseStat: number,
	iv: number,
	ev: number,
	level: number,
	nature: string,
): number {
	if (stat === "hp") {
		if (baseStat === 1) return 1;

		return Math.floor(((2 * baseStat + iv + Math.floor(ev / 4)) * level) / 100) + level + 10;
	} else {
		const natureMultiplierValue = natureCalc(stat, nature);
		return Math.floor(
			(Math.floor(((2 * baseStat + iv + Math.floor(ev / 4)) * level) / 100) + 5) * natureMultiplierValue,
		);
	}
}

export function calcStatChampions(
  stat: StatID,
  baseStat: number,
  sp: number,
  nature: string,
): number {
  if (stat === "hp") {
    if (baseStat === 1) return 1;

    return baseStat + sp + 75;
  } else {
    const natureMultiplierValue = natureCalc(stat, nature);

    return Math.floor(natureMultiplierValue * (baseStat + sp + 20));
  }
}
