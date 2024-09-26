export enum Role {
  farmer = "Farmer",
  mafia = "Mafia",
  doctor = "Doctor",
  police = "Police",
}

export type NonStandardRole = Exclude<Role, Role.farmer>;
