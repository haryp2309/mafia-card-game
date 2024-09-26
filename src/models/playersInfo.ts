import { Role } from "./roles";

export type PlayersInfo = {
  playerIdOrder: string[];
  nameMappings: Record<string, string>;
  roleMappings: Record<string, Role>;
};
