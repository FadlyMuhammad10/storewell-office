"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Menu, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [login, setLogin] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-primary bg-background shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-3xl font-black text-primary tracking-tight">
              STOREWELL
            </h1>
          </div>
          {/* Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-foreground hover:text-accent transition-colors font-bold text-lg uppercase tracking-wide"
            >
              Home
            </Link>
            <a
              href="#products"
              className="text-foreground hover:text-accent transition-colors font-bold text-lg uppercase tracking-wide"
            >
              Store
            </a>
            <a
              href="#"
              className="text-foreground hover:text-accent transition-colors font-bold text-lg uppercase tracking-wide"
            >
              About
            </a>
            <a
              href="#"
              className="text-foreground hover:text-accent transition-colors font-bold text-lg uppercase tracking-wide"
            >
              Contact
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {login ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="hidden sm:flex hover:bg-primary/10"
                  >
                    <User className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">user</p>
                    <p className="text-xs text-muted-foreground">
                      user@email.com
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Orders</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="lg"
                  className="hidden sm:flex hover:bg-primary/10"
                >
                  <User className="h-6 w-6" />
                </Button>
              </Link>
            )}

            <Link href="/cart">
              <Button
                variant="ghost"
                size="lg"
                className="relative hover:bg-primary/10"
              >
                <ShoppingBag className="h-6 w-6" />
                <Badge className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 text-xs bg-accent font-bold">
                  {login ? 1 : 0}
                </Badge>
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="lg"
              className="md:hidden hover:bg-primary/10"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
