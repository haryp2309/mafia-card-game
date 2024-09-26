import { PlayersInfo } from "@/models/playersInfo";
import { SessionStorageKey } from "../constants/sessionStorage";

export const useSessionStorage = () => {
  const setPlayersInfo = (playersInfo: PlayersInfo) => {
    sessionStorage.setItem(
      SessionStorageKey.PLAYERS_INFO,
      JSON.stringify(playersInfo)
    );
  };

  const getPlayersInfo = () => {
    const playersInfoJson = sessionStorage.getItem(
      SessionStorageKey.PLAYERS_INFO
    );
    if (playersInfoJson === null) {
      return null;
    }
    return JSON.parse(playersInfoJson) as PlayersInfo;
  };

  return {
    setPlayersInfo,
    getPlayersInfo,
  };
};
