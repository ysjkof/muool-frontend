import React from "react";
import { Outlet, Link } from "react-router-dom";
import { Header } from "../component/header";

export function Home() {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
}
