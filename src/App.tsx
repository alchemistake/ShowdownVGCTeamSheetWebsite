import styled from "styled-components";
import React from "react";
import PlayerInformationComponent from "./components/PlayerInformation.component";
import { PlayerInformation } from "./types/player-information";
import { type GenerationNum } from "@pkmn/data";
import { generatePDF } from "./utils/pdf";
import { getShowdownTeam, getVGCTeam, type VGCTeam } from "@kasp470f/showdown-to-vgc";

/** Strip Mega form suffixes (e.g. "-Mega", "-Mega-X", "-Mega-Y", "-Mega-Z") from Pokémon names. */
function normalizePokemonNames(team: VGCTeam): VGCTeam {
	return team.map((poke) => ({ ...poke, name: poke.name.replace(/-Mega(?:-[XYZ])?$/, "") }));
}

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AppTitle = styled.h1`
  margin-bottom: 0;
`;

const AppSubTitle = styled.p`
  color: #4d4d4d;
`;

const DualColumnContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ShowdownInput = styled.textarea`
  min-width: 250px;
  max-width: 350px;
  min-height: 300px;
  max-height: 720px;
  height: 1000px;
  resize: none;
  font-size: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;

  @media (max-width: 768px) {
    max-height: 300px;
  }
`;

const DownloadButton = styled.button`
  margin-top: 20px;
  padding: 10px 38px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: 50%;
  background-color: #fafafa;
`;

export default function App() {
  const [generationNum] = React.useState<GenerationNum>(9);

  const [showdownTeamText, setShowdownTeamText] = React.useState("");
  const [playerInformation, setPlayerInformation] =
    React.useState<PlayerInformation>(() => new PlayerInformation());

  const handlePlayerInformationChange = <K extends keyof PlayerInformation>(
    field: K,
    value: PlayerInformation[K],
  ) => {
    setPlayerInformation(
      (prev) =>
        ({
          ...prev,
          [field]: value,
        }) as PlayerInformation,
    );
  };

  const handleDownload = () => {
    if (showdownTeamText.trim().length === 0) return;

    const parsedTeam = getShowdownTeam(showdownTeamText, generationNum);
    if (!parsedTeam) return; 

    let vgcTeam = getVGCTeam(parsedTeam, generationNum, "champions");
    if (vgcTeam) {
      vgcTeam = normalizePokemonNames(vgcTeam);
      generatePDF(
        vgcTeam,
        playerInformation,
        "champions",
        new Date().toISOString().split("T")[0],
      );
    }
  };

  return (
    <AppContainer>
      <AppTitle>Showdown to VGC Team Sheet</AppTitle>
      <AppSubTitle>Convert your Showdown team to a VGC team sheet!</AppSubTitle>
      <DualColumnContainer>
        <ShowdownInput
          placeholder="Paste your Showdown team here..."
          spellCheck="false"
          value={showdownTeamText}
          onChange={(e) => setShowdownTeamText(e.target.value)}
        />

        <PlayerInformationComponent
          information={playerInformation}
          onChange={handlePlayerInformationChange}
        />
      </DualColumnContainer>

      <DownloadButton onClick={handleDownload} disabled={showdownTeamText.trim().length === 0}>
        Download VGC Team Sheet
      </DownloadButton>
    </AppContainer>
  );
}
