import styled from "styled-components";
import { DivisionKeys, type PlayerInformation } from "../types/player-information";

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
`;

const InputContainerRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`;

const InputLabel = styled.label`
  font-size: 14px;
  font-weight: bold;
`;

const InputField = styled.input`
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const DivisionOptions = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
`;

const DivisionOption = styled.button<{ selected?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 90px;
  padding: 8px 8px;
  max-height: 35px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: ${({ selected }) => (selected ? "#333" : "#fafafa")};
  color: ${({ selected }) => (selected ? "#fff" : "#333")};
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
  border-color: ${({ selected }) => (selected ? "#333" : "#ccc")};

  &:focus {
    outline: 2px solid #666;
    outline-offset: 2px;
  }
`;

const DivisionOptionLabel = styled.span`
  user-select: none;
  text-transform: capitalize;
`;

const InputHint = styled.span`
  font-size: 12px;
  color: #666;
`;

interface PlayerInformationProps {
  information: PlayerInformation;
  onChange: <K extends keyof PlayerInformation>(field: K, value: PlayerInformation[K]) => void;
}

function formatToDateInput(value: Date | undefined) {
  if (!value || !(value instanceof Date) || Number.isNaN(value.getTime())) return "";
  return value.toISOString().slice(0, 10);
}

function getLocaleDatePattern(locale: string): string {
  const formatter = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return formatter
    .formatToParts(new Date(2000, 11, 31))
    .map((part) => {
      if (part.type === "day") return "DD";
      if (part.type === "month") return "MM";
      if (part.type === "year") return "YYYY";
      return part.value;
    })
    .join("");
}

export default function PlayerInformationComponent({
  information,
  onChange,
}: PlayerInformationProps) {
  const userLocale = typeof navigator !== "undefined" ? navigator.language : "en-GB";
  const dateFormatHint = getLocaleDatePattern(userLocale);

  return (
    <InputContainer>
      <InputContainerRow>
        <InputLabel htmlFor="playerName">Player Name</InputLabel>
        <InputField
          id="playerName"
          type="text"
          value={information.playerName ?? ""}
          onChange={(e) => onChange("playerName", e.target.value)}
        />
      </InputContainerRow>
      <InputContainerRow>
        <InputLabel htmlFor="trainerName">Trainer Name</InputLabel>
        <InputField
          id="trainerName"
          type="text"
          value={information.trainerName ?? ""}
          onChange={(e) => onChange("trainerName", e.target.value)}
        />
      </InputContainerRow>
      <InputContainerRow>
        <InputLabel htmlFor="battleTeamName">Battle Team Name</InputLabel>
        <InputField
          id="battleTeamName"
          type="text"
          value={information.battleTeamName ?? ""}
          onChange={(e) => onChange("battleTeamName", e.target.value)}
        />
      </InputContainerRow>
      <InputContainerRow>
        <InputLabel htmlFor="switchName">Switch Name</InputLabel>
        <InputField
          id="switchName"
          type="text"
          value={information.switchName ?? ""}
          onChange={(e) => onChange("switchName", e.target.value)}
        />
      </InputContainerRow>
      <InputContainerRow>
        <InputLabel>Division</InputLabel>
        <DivisionOptions>
            {DivisionKeys.map((item) => (
              <DivisionOption
                type="button"
                key={item}
                selected={information.division === item}
                onClick={() =>
                  onChange(
                    "division",
                    information.division === item ? undefined : item,
                  )
                }
              >
                <DivisionOptionLabel>{item}</DivisionOptionLabel>
              </DivisionOption>
            ))}
        </DivisionOptions>
      </InputContainerRow>
      <InputContainerRow>
        <InputLabel htmlFor="dateOfBirth">Date of Birth</InputLabel>
        <InputHint>{`Format: ${dateFormatHint}`}</InputHint>
        <InputField
          id="dateOfBirth"
          type="date"
          lang={userLocale}
          value={formatToDateInput(information.dateOfBirth)}
          onChange={(e) =>
            onChange(
              "dateOfBirth",
              e.target.value ? new Date(e.target.value) : undefined,
            )
          }
        />
      </InputContainerRow>
      <InputContainerRow>
        <InputLabel htmlFor="playerId">Player ID</InputLabel>
        <InputField
          id="playerId"
          type="text"
          value={information.playerId ?? ""}
          onChange={(e) => onChange("playerId", e.target.value)}
        />
      </InputContainerRow>
      <InputContainerRow>
        <InputLabel htmlFor="supportId">Support ID</InputLabel>
        <InputField
          id="supportId"
          type="text"
          value={information.supportId ?? ""}
          onChange={(e) => onChange("supportId", e.target.value)}
        />
      </InputContainerRow>
    </InputContainer>
  );
}
