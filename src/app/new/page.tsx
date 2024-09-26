"use client";
import { ChangeEvent, Fragment, useEffect, useMemo, useState } from "react";
import s from "./page.module.css";
import { Reorder } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { PlayersInfo } from "@/models/playersInfo";
import { SessionStorageKey } from "../../constants/sessionStorage";
import { useSessionStorage } from "../../hooks/useSessionStorage";
import { redirect, useRouter } from "next/navigation";
import { NonStandardRole, Role } from "@/models/roles";

const shuffle = (sortedArray: string[]) => {
  const array = [...sortedArray];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const initialRoleCount: Record<NonStandardRole, number> = {
  [Role.mafia]: 0,
  [Role.doctor]: 0,
  [Role.police]: 0,
};
export default function NewGame() {
  const [players, setPlayers] = useState([uuidv4(), uuidv4(), uuidv4()]);
  const [playerNames, setPlayerNames] = useState<{ [key: string]: string }>({});
  const [roleCount, setRoleCount] =
    useState<Record<NonStandardRole, number>>(initialRoleCount);
  const farmersCount =
    players.length - Object.values(roleCount).reduce((a, b) => a + b);

  const storage = useSessionStorage();
  const router = useRouter();

  const handleAddPlayer = () => {
    setPlayers((v) => [...v, uuidv4()]);
  };

  const handleRemovePlayer = () => {
    setPlayers((v) => v.slice(0, v.length - 1));
  };

  const handleStartGame = () => {
    const correctRoleCount = { ...roleCount, [Role.farmer]: farmersCount };
    const shuffledPlayers = shuffle(players);
    const roles = Object.values(Role).flatMap((role) =>
      new Array<Role>(correctRoleCount[role]).fill(role)
    );
    const roleMappings = Object.fromEntries(
      roles.map((role, i) => [shuffledPlayers[i], role])
    );

    storage.setPlayersInfo({
      playerIdOrder: players,
      nameMappings: playerNames,
      roleMappings,
    });
    router.push("/game");
  };

  useEffect(() => {
    const playersInfo = storage.getPlayersInfo();
    if (playersInfo === null) {
      return;
    }
    setPlayers(playersInfo.playerIdOrder);
    setPlayerNames(playersInfo.nameMappings);
    const newRoleCount = Object.values(playersInfo.roleMappings).reduce(
      (newRoleCount, role) => {
        if (role !== Role.farmer) {
          newRoleCount[role] = newRoleCount[role] + 1;
        }
        return newRoleCount;
      },
      { ...initialRoleCount }
    );
    setRoleCount(newRoleCount);
  }, []);

  const handlePlayerNameChange =
    (playerId: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setPlayerNames((v) => ({
        ...v,
        [playerId]: e.target.value,
      }));
    };

  const allFieldsFilled = players.every(
    (v) => v in playerNames && playerNames[v].length > 0
  );

  const handleAddRole = (role: NonStandardRole) => () => {
    if (farmersCount > 0) {
      setRoleCount((v) => ({ ...v, [role]: v[role] + 1 }));
    }
  };

  const handleRemoveRole = (role: NonStandardRole) => () => {
    setRoleCount((v) => ({
      ...v,
      [role]: Math.max(0, v[role] - 1),
    }));
  };

  return (
    <>
      <div className={s.playerCounter}>
        <label>Players: {players.length}</label>
        <div className={s.playerCounterButtons}>
          <button onClick={handleAddPlayer}>+</button>
          <button onClick={handleRemovePlayer}>-</button>
        </div>
      </div>

      <Reorder.Group
        axis="y"
        values={players}
        onReorder={setPlayers}
        className={s.playersContainer}
        as="div"
      >
        {players.map((playerId, playerNumber) => (
          <Reorder.Item
            key={playerId}
            value={playerId}
            as="div"
            className={s.playerField}
          >
            <label>Player {playerNumber}: </label>
            <input
              value={playerNames[playerId] || ""}
              onChange={handlePlayerNameChange(playerId)}
            ></input>
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <div className={s.roleCounters}>
        {Object.values(Role).map((role) => (
          <Fragment key={role}>
            <label className={s.name}>
              <strong>{role}:</strong>{" "}
            </label>
            <label>
              {role === Role.farmer ? farmersCount : roleCount[role]}
            </label>
            {role !== Role.farmer ? (
              <>
                <button
                  disabled={farmersCount < 1}
                  onClick={handleAddRole(role)}
                >
                  +
                </button>
                <button
                  disabled={roleCount[role] < 1}
                  onClick={handleRemoveRole(role)}
                >
                  -
                </button>
              </>
            ) : (
              <></>
            )}
          </Fragment>
        ))}
      </div>
      <div className={s.buttonContainer}>
        <button onClick={handleStartGame} disabled={!allFieldsFilled}>
          Start Game
        </button>
      </div>
    </>
  );
}
