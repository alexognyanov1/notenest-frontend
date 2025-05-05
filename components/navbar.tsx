"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Logo from "../public/Note_Nest.png";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { checkAuth } from "@/api";
import LogoutButton from "./logout";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      const loggedIn = await checkAuth();
      setIsLoggedIn(loggedIn);
    };

    checkAuthentication();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex justify-center">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src={Logo}
              alt="Note Nest Logo"
              style={{ width: "auto" }}
              className="h-16"
            />
          </Link>
        </div>

        <div className="ml-auto flex items-center space-x-2">
          {isLoggedIn ? (
            <div className="flex items-center space-x-2">
              <Link href="/upload">
                <Button>Upload</Button>
              </Link>
              <Link href="/my-notes">
                <Button>My Notes</Button>
              </Link>
              <LogoutButton />
            </div>
          ) : (
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
