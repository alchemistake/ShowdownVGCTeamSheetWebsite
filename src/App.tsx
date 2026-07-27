import styled from "styled-components";
import { parseShowdownTeam } from "./utils/parser";
import { getVGCSheet } from "./utils/sheet-converter";
import { Dex } from "@pkmn/dex";
import { Generations } from "@pkmn/data";
import React from "react";
import { generatePDF } from "./utils/pdf";
import PlayerInformationComponent from "./components/PlayerInformation.component";
import { PlayerInformation } from "./types/player-information";

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
  const [showdownTeam, setShowdownTeam] = React.useState("");
  const [playerInformation, setPlayerInformation] = React.useState<PlayerInformation>(() => new PlayerInformation());

  const dex = new Generations(Dex).get(9).dex;

  const handlePlayerInformationChange = <K extends keyof PlayerInformation>(
    field: K,
    value: PlayerInformation[K],
  ) => {
    setPlayerInformation((prev) => ({
      ...prev,
      [field]: value,
    } as PlayerInformation));
  };

  const handleDownload = () => {
    if (showdownTeam.trim().length === 0) return;

    const parsedTeam = parseShowdownTeam(showdownTeam);
    const vgcSheet = getVGCSheet(parsedTeam, dex, "champions", playerInformation);

    if (vgcSheet) {
      generatePDF(vgcSheet, new Date().toISOString().split("T")[0]);
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
          value={showdownTeam}
          onChange={(e) => setShowdownTeam(e.target.value)}
        />

        <PlayerInformationComponent information={playerInformation} onChange={handlePlayerInformationChange} />
      </DualColumnContainer>

      <DownloadButton onClick={handleDownload}>
        Download VGC Team Sheet
      </DownloadButton>
    </AppContainer>
  );
}
