"use client";

import { useAuth } from "@/context/AuthContext";
import { supabaseClient } from "@/lib/supabaseClient";
import { FC } from "react";
import { useRouter, usePathname } from "next/navigation";

const Header: FC = () => {
  const { session } = useAuth();

  const router = useRouter();
  const pathname = usePathname();

  return pathname === "/sign-in" ? (
    <></>
  ) : (
    <header className="bg-blue-100 p-4 flex justify-end gap-4">
      {session ? (
        <>
          <span>{session?.user.email}</span>
          <button
            className="underline hover:text-gray-500"
            onClick={() => supabaseClient.auth.signOut()}
          >
            Sign Out
          </button>
        </>
      ) : (
        <button
          className="underline hover:text-gray-500"
          onClick={() => router.push("/sign-in")}
        >
          Sign In
        </button>
      )}
    </header>
  );
};

export default Header;
