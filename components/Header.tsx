"use client"
import { useAppSelector } from "@/redux/store";
import React from "react";
import HeaderNav from "./HeaderNav";

export default function Header() {
  const breakPoint = useAppSelector((state) => state.views.breakPoint);

  return (
    <header className="header-flex">
      {breakPoint[1280] && (
        <div className="header-title">
          <h1>Class Scheduler</h1>
        </div>
      )}
      <HeaderNav />
    </header>
  );
}
