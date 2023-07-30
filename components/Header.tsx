"use client"
import { useAppSelector } from "@/redux/store";
import React from "react";
import HeaderNav from "./HeaderNav";

export default function Header() {
  const { appState } = useAppSelector((state) => state.classes);
  const breakPoint = useAppSelector((state) => state.views.breakPoint);

  const styles = {
    display: appState === "complete" ? "flex" : "hidden",
  };

  return (
    <header className="header" style={styles}>
      {breakPoint[1280] && (
        <div className="header-title">
          <h1>Class Scheduler</h1>
        </div>
      )}
      <HeaderNav />
    </header>
  );
}
