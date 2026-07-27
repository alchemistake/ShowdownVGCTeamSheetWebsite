export const DivisionKeys = ['Juniors', 'Seniors', 'Masters'] as const;
export type Divisions = (typeof DivisionKeys)[number];

export class PlayerInformation {
    playerName: string | undefined;
    trainerName: string | undefined;
    battleTeamName: string | undefined;
    switchName: string | undefined;
    division: Divisions | undefined;
    playerId: string | number | undefined;
    dateOfBirth: Date | undefined;
    supportId: string | number | undefined;
};