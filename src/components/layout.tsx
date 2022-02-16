import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./header";

export const Layout: React.FC = () => {
  return (
    <div className="divide-y divide-solid h-screen overflow-hidden">
      <Header />
      <Outlet />
    </div>
  );
};