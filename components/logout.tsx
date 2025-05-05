"use client";

import { LOCAL_STORAGE_KEY } from "@/api";
import React from "react";
import { Button } from "./ui/button";

const LogoutButton: React.FC = () => {
  const onLogout = () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);

      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <Button
      onClick={onLogout}
      className="flex items-center px-4 py-2 text-white transition"
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
