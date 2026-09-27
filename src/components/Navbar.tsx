"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User } from "next-auth";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user as User;

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight hover:text-primary transition-colors"
        >
          Mystery Message
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <span className="hidden sm:block text-sm text-muted-foreground">
                Welcome,{" "}
                <span className="font-semibold text-foreground">
                  {user?.username || user?.email}
                </span>
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut()}
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button size="sm">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;