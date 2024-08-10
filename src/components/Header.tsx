"use client";

import { useAuth } from "@/context/AuthContext";
import { supabaseClient } from "@/lib/supabaseClient";
import { FC } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const Header: FC = () => {
  const { session, profile } = useAuth();

  const router = useRouter();
  const pathname = usePathname();

  return pathname === "/sign-in" ? (
    <></>
  ) : (
    <header className="bg-blue-100 p-4 flex justify-between">
      <div className="flex gap-4">
        <span>Coin API</span>
        <nav className="flex gap-2">
          <Link href="/">Home</Link>
          <Link href="/posts">Post</Link>
        </nav>
      </div>
      {session ? (
        <div className="flex gap-4">
          <span>
            Hello,{" "}
            {profile
              ? `${profile.nickname}(#${session.user.id.substring(
                  session.user.id.length - 4
                )})`
              : session.user.email}
          </span>
          <button
            className="underline hover:text-gray-500"
            onClick={() => supabaseClient.auth.signOut()}
          >
            Sign Out
          </button>
        </div>
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
