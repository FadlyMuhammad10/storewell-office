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
import { logOut } from "@/redux/slices/authSlice";
import { RootState } from "@/redux/store";
import { postLogout } from "@/services/auth";
import { LogOut, Menu, Search, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

export default function Navbar() {
  const dispatch = useDispatch();
  const login = useSelector((state: RootState) => state.auth.isLogin);
  const cartCount = useSelector((state: RootState) => state.cart.count);
  const user = useSelector((state: RootState) => state.auth.user);
  const refreshToken = useSelector(
    (state: RootState) => state.auth.refreshToken,
  );

  const handleLogout = async () => {
    dispatch(logOut());
    await postLogout(refreshToken!);
  };

  return (
    <header className="sticky top-0 z-50 w-full shadow-sm bg-background">
      <div className="page-container flex h-20 items-center justify-between tracking-wide">
        <div className="flex items-center gap-6 md:gap-8">
          <Link href="/" className="flex items-center">
            <h1 className="text-lg font-bold text-primary tracking-tight">
              STOREWELL
            </h1>
          </Link>

          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link
              href="/"
              className="text-primary hover:text-primary transition-colors font-semibold text-xs"
            >
              Clothing
            </Link>
            <Link
              href="/products"
              className="text-primary-foreground hover:text-primary transition-colors font-semibold text-xs"
            >
              Shoes
            </Link>
            <a
              href="#"
              className="text-primary-foreground hover:text-primary transition-colors font-semibold text-xs"
            >
              Bags
            </a>
            <a
              href="#"
              className="text-primary-foreground hover:text-primary transition-colors font-semibold text-xs"
            >
              Accessories
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-4 sm:gap-5">
          <div className="relative">
            <Search className="h-4 w-4 text-primary" />
          </div>
          {login ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <User className="h-4 w-4 text-primary hover:cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/dashboard/orders">Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2 text-destructive" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <div className="hidden sm:flex">
                <User className="h-4 w-4 text-primary" />
              </div>
            </Link>
          )}

          <Link href="/cart">
            <div className="relative">
              <ShoppingBag className="h-4 w-4 text-primary" />
              <Badge className="absolute text-white -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 text-[8px] bg-primary font-light">
                {login ? cartCount : 0}
              </Badge>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="lg"
            className="md:hidden hover:bg-primary/10"
          >
            <Menu className="h-5 w-5 text-primary" />
          </Button>
        </div>
      </div>
    </header>
  );
}
