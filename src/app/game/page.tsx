"use client";
import { useEffect, useMemo, useState } from "react";
import s from "./page.module.css";
import { Reorder } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { PlayersInfo } from "@/models/playersInfo";
import { SessionStorageKey } from "../../constants/sessionStorage";
import { useSessionStorage } from "../../hooks/useSessionStorage";
import { redirect, useRouter } from "next/navigation";
import { Role } from "@/models/roles";

const usePlayerIndex = ({ playersCount }: { playersCount: number }) => {
  const [index, setIndex] = useState<number>(0);

  const next = () => {
    setIndex((v) => Math.min(v + 1, playersCount * 2 - 1));
  };

  const previous = () => {
    setIndex((v) => Math.max(v - 1, 0));
  };

  const isWaiting = index % 2 === 0;

  const playerIndex = (index - (isWaiting ? 0 : 1)) / 2;

  return {
    next,
    previous,
    isWaiting,
    playerIndex,
  };
};

export default function Game() {
  const [players, setPlayers] = useState<string[]>([]);
  const [playerNames, setPlayerNames] = useState<{ [key: string]: string }>({});
  const [roleMappings, setRoleMappings] = useState<{ [key: string]: Role }>({});

  const storage = useSessionStorage();
  const router = useRouter();
  const { next, previous, isWaiting, playerIndex } = usePlayerIndex({
    playersCount: players.length,
  });

  useEffect(() => {
    const playersInfo = storage.getPlayersInfo();
    if (playersInfo === null) {
      router.push("/new");
      return;
    }
    setPlayers(playersInfo.playerIdOrder);
    setPlayerNames(playersInfo.nameMappings);
    setRoleMappings(playersInfo.roleMappings);
  }, []);

  const currentPlayerId = players[playerIndex];
  const currentPlayerName = playerNames[currentPlayerId];
  return (
    <>
      {isWaiting ? (
        <div className={s.roleCard}>Pass phone to {currentPlayerName}...</div>
      ) : (
        <div className={s.roleCard}>
          <div className={s.playerName}>{currentPlayerName}</div>
          <div className={s.roleName}>
            Your role is: <strong>{roleMappings[currentPlayerId]}</strong>
          </div>
        </div>
      )}
      <div className={s.buttons}>
        <button onClick={previous} disabled={isWaiting && playerIndex < 1}>
          Previous
        </button>
        <button onClick={next}>Next</button>
      </div>
    </>
  );
}
