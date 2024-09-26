"use client";
import { useEffect, useMemo, useState } from "react";
import s from "./page.module.css";
import { Reorder } from "framer-motion";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  return (
    <>
      <button disabled>Resume Game (No current games)</button>
      <a href="/new">
        <button>New Game</button>
      </a>
    </>
  );
}
