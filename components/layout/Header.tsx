"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Menu, X, Phone, Heart, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { label: "Nhà đất bán", href: "/nha-dat-ban" },
  { label: "Tin tức", href: "/tin-tuc" },
  { label: "Liên hệ", href: "/lien-he" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const { favorites } = useFavorites();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img
              src="/Logo.png"
              alt="Muabannhahanoi.vn"
              className="h-20 w-auto object-contain"
            />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href ||
                    pathname.startsWith(link.href + "/")
                    ? "text-primary bg-accent"
                    : "text-foreground/80 hover:text-primary hover:bg-accent"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* DESKTOP CTA */}
          <div className="hidden lg:flex items-center gap-3 ml-4">
            <Link
              href="/yeu-thich"
              className={cn(
                "relative p-2 rounded-lg transition-colors",
                pathname === "/yeu-thich"
                  ? "text-primary bg-accent"
                  : "text-foreground/80 hover:text-primary hover:bg-accent"
              )}
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-medium rounded-full flex items-center justify-center">
                  {favorites.length > 9 ? "9+" : favorites.length}
                </span>
              )}
            </Link>

            <Button variant="outline" size="sm">
              <Phone className="w-4 h-4" />
              Hotline
            </Button>

            {user ? (
              <>
                <Link href="/dang-tin">
                  <Button size="sm">Đăng tin</Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Link href="/auth">
                <Button size="sm">
                  <User className="w-4 h-4 mr-1" />
                  Đăng nhập
                </Button>
              </Link>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-card animate-fade-in">
          <nav className="container-custom py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-4 py-3 rounded-lg text-base font-medium transition-colors",
                  pathname === link.href
                    ? "text-primary bg-accent"
                    : "text-foreground/80 hover:text-primary hover:bg-accent"
                )}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/yeu-thich"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-lg text-base font-medium transition-colors",
                pathname === "/yeu-thich"
                  ? "text-primary bg-accent"
                  : "text-foreground/80 hover:text-primary hover:bg-accent"
              )}
            >
              <Heart className="w-5 h-5" />
              Tin đã lưu
              {favorites.length > 0 && (
                <span className="ml-auto bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded-full">
                  {favorites.length}
                </span>
              )}
            </Link>

            <div className="flex gap-3 mt-4 pt-4 border-t border-border">
              <Button variant="outline" className="flex-1">
                <Phone className="w-4 h-4" />
                Hotline
              </Button>

              {user ? (
                <>
                  <Link href="/dang-tin" className="flex-1">
                    <Button className="w-full">Đăng tin</Button>
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <Link href="/auth" className="flex-1">
                  <Button className="w-full">
                    <User className="w-4 h-4 mr-1" />
                    Đăng nhập
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
