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
import { GetCategoriesTree } from "@/services/participant";
import { CategoryTree } from "@/types";
import {
  ChevronDown,
  LogOut,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function getCategoryList(response: unknown): CategoryTree[] {
  if (!response || typeof response !== "object") return [];

  const firstData = (response as { data?: unknown }).data;
  if (Array.isArray(firstData)) return firstData as CategoryTree[];

  if (firstData && typeof firstData === "object") {
    const nestedData = (firstData as { data?: unknown }).data;
    if (Array.isArray(nestedData)) return nestedData as CategoryTree[];

    if ("id" in firstData) return [firstData as CategoryTree];
  }

  return [];
}

function categoryHref(id: number) {
  return `/products?category_id=${id}`;
}

function CategoryChildren({
  categories,
  level = 0,
  onNavigate,
}: {
  categories: CategoryTree[];
  level?: number;
  onNavigate: () => void;
}) {
  return (
    <ul className={level === 0 ? "space-y-3" : "mt-2 space-y-2 pl-3"}>
      {categories.map((category) => (
        <li key={category.id}>
          <Link
            href={categoryHref(category.id)}
            onClick={onNavigate}
            className="text-sm text-primary-foreground transition-colors hover:text-primary hover:underline"
          >
            {category.name}
          </Link>
          {category.children?.length > 0 && (
            <CategoryChildren
              categories={category.children}
              level={level + 1}
              onNavigate={onNavigate}
            />
          )}
        </li>
      ))}
    </ul>
  );
}

export default function Navbar() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const login = useSelector((state: RootState) => state.auth.isLogin);
  const cartCount = useSelector((state: RootState) => state.cart.count);
  const user = useSelector((state: RootState) => state.auth.user);
  const refreshToken = useSelector(
    (state: RootState) => state.auth.refreshToken,
  );
  const [categories, setCategories] = useState<CategoryTree[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeCategoryMenus = useCallback(() => {
    setActiveCategoryId(null);
    setMobileMenuOpen(false);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadCategories() {
      const response = await GetCategoriesTree();
      if (mounted) setCategories(getCategoryList(response));
    }

    loadCategories();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    closeCategoryMenus();
  }, [pathname, closeCategoryMenus]);

  const activeCategory = categories.find(
    (category) => category.id === activeCategoryId,
  );

  const handleLogout = async () => {
    dispatch(logOut());
    await postLogout(refreshToken!);
  };

  return (
    <header
      className="sticky top-0 z-50 w-full bg-background shadow-sm"
      onMouseLeave={() => setActiveCategoryId(null)}
    >
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
              onFocus={() => setActiveCategoryId(null)}
              className="text-xs font-semibold text-primary-foreground transition-colors hover:text-primary"
            >
              Home
            </Link>
            <Link
              href="/brands"
              onMouseEnter={() => setActiveCategoryId(null)}
              onFocus={() => setActiveCategoryId(null)}
              className={`flex h-20 items-center border-b-2 text-xs font-semibold transition-colors hover:border-primary hover:text-primary ${
                pathname === "/brands"
                  ? "border-primary text-primary"
                  : "border-transparent text-primary-foreground"
              }`}
            >
              Brands
            </Link>
            {categories.map((category) => {
              const isActive = activeCategoryId === category.id;

              return (
                <div key={category.id}>
                  {category.children?.length > 0 ? (
                    <button
                      type="button"
                      aria-expanded={isActive}
                      aria-controls={`category-menu-${category.id}`}
                      onMouseEnter={() => setActiveCategoryId(category.id)}
                      onFocus={() => setActiveCategoryId(category.id)}
                      onClick={() =>
                        setActiveCategoryId(isActive ? null : category.id)
                      }
                      className={`flex h-20 items-center gap-1 border-b-2 text-xs font-semibold transition-colors ${
                        isActive
                          ? "border-primary text-primary"
                          : "border-transparent text-primary-foreground hover:text-primary"
                      }`}
                    >
                      {category.name}
                      <ChevronDown
                        className={`size-3 transition-transform ${isActive ? "rotate-180" : ""}`}
                      />
                    </button>
                  ) : (
                    <Link
                      href={categoryHref(category.id)}
                      className="flex h-20 items-center border-b-2 border-transparent text-xs font-semibold text-primary-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      {category.name}
                    </Link>
                  )}
                </div>
              );
            })}
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
            type="button"
            aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="md:hidden hover:bg-primary/10"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-primary" />
            ) : (
              <Menu className="h-5 w-5 text-primary" />
            )}
          </Button>
        </div>
      </div>

      {activeCategory && activeCategory.children?.length > 0 && (
        <div
          id={`category-menu-${activeCategory.id}`}
          onMouseEnter={() => setActiveCategoryId(activeCategory.id)}
          className="absolute left-0 top-full hidden max-h-[calc(100vh-5rem)] w-full overflow-y-auto border-t border-black/10 bg-background shadow-lg md:block"
        >
          <div className="page-container py-10 text-primary">
            <div className="flex items-baseline gap-4 border-b border-black/10 pb-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary-foreground">
                Root category
              </span>
              <Link
                href={categoryHref(activeCategory.id)}
                onClick={closeCategoryMenus}
                className="text-2xl font-semibold hover:underline"
              >
                {activeCategory.name}
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-10 pt-6 lg:grid-cols-3">
              {activeCategory.children.map((category) => (
                <section key={category.id}>
                  <Link
                    href={categoryHref(category.id)}
                    onClick={closeCategoryMenus}
                    className="block border-b border-black/10 pb-3 text-xs font-bold uppercase tracking-wider hover:underline"
                  >
                    {category.name}
                  </Link>
                  {category.children?.length > 0 && (
                    <CategoryChildren
                      categories={category.children}
                      onNavigate={closeCategoryMenus}
                    />
                  )}
                </section>
              ))}
            </div>
          </div>
        </div>
      )}

      {mobileMenuOpen && (
        <nav className="absolute left-0 top-full max-h-[calc(100vh-5rem)] w-full overflow-y-auto border-t border-black/10 bg-background px-4 py-5 shadow-lg md:hidden">
          <Link
            href="/"
            onClick={closeCategoryMenus}
            className="block border-b border-black/10 py-3 text-sm font-semibold text-primary"
          >
            Home
          </Link>
          <Link
            href="/brands"
            onClick={closeCategoryMenus}
            className={`block border-b border-black/10 py-3 text-sm font-semibold text-primary ${
              pathname === "/brands" ? "underline underline-offset-4" : ""
            }`}
          >
            Brands
          </Link>
          {categories.map((category) => (
            <details key={category.id} className="border-b border-black/10">
              <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-sm font-semibold text-primary [&::-webkit-details-marker]:hidden">
                {category.name}
                {category.children?.length > 0 && (
                  <ChevronDown className="size-4" />
                )}
              </summary>
              <div className="pb-4 pl-3">
                <Link
                  href={categoryHref(category.id)}
                  onClick={closeCategoryMenus}
                  className="mb-3 block text-sm font-medium text-primary hover:underline"
                >
                  View all {category.name}
                </Link>
                {category.children?.length > 0 && (
                  <CategoryChildren
                    categories={category.children}
                    onNavigate={closeCategoryMenus}
                  />
                )}
              </div>
            </details>
          ))}
        </nav>
      )}
    </header>
  );
}
