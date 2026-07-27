import styled from "styled-components";
import React, { useEffect } from "react";
import PlayerInformationComponent from "./components/PlayerInformation.component";
import { PlayerInformation } from "./types/player-information";
import getShowdownTeam from "../lib/utils/showdown-parser";
import { getVGCTeam } from "../lib/utils/vgc-team-parser";
import { Generations, type Generation, type GenerationNum } from "@pkmn/data";
import { Dex } from "@pkmn/dex";
import { generatePDF } from "./utils/pdf";

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`;

const DualColumnContainer = styled.div`
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
`;

export default function App() {
  const [generationNum] = React.useState<GenerationNum>(9);
  const [generation, setGeneration] = React.useState<Generation>();

  const [showdownTeamText, setShowdownTeamText] = React.useState("");
  const [playerInformation, setPlayerInformation] =
    React.useState<PlayerInformation>(() => new PlayerInformation());

  useEffect(() => {
    const newGeneration = new Generations(Dex).get(generationNum);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGeneration(newGeneration)
  }, [generationNum]);

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
    console.log(parsedTeam);
    const vgcTeam = getVGCTeam(parsedTeam, generation!.dex, 'champions')
    console.log(vgcTeam)    

    if (vgcTeam) {
      generatePDF(vgcTeam, playerInformation, 'champions', new Date().toISOString().split("T")[0]);
    }
  };

  return (
    <AppContainer>
      <h1>Showdown to VGC Team Sheet</h1>
      <p>Convert your Showdown team to a VGC team sheet!</p>
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

      <DownloadButton onClick={handleDownload}>
        Download VGC Team Sheet
      </DownloadButton>
    </AppContainer>
  );
}
