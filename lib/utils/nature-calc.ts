import type { StatID } from "@pkmn/data";
import { NATURES } from "@smogon/calc";

export default function calcNatureMultiplier(stat: StatID, nature: string): number {
    const natureObj = NATURES[nature];
    if (natureObj) {
        const positive = natureObj[0];
        const negative = natureObj[1];
        if (positive === stat) {
            return 1.1;
        } else if (negative === stat) {
            return 0.9;
        }
    }
    return 1.0;
}
