"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Settings, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/products", label: "Produtos", icon: Package },
  { href: "/sales", label: "Vendas", icon: ShoppingCart },
  { href: "/categories", label: "Categorias", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Barra superior mobile e tablet */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-slate-900 px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-emerald-500" />
          <h1 className="text-lg font-bold tracking-tight text-white">Apollo Admin</h1>
        </div>
        <button
          onClick={toggleMenu}
          className="text-white hover:text-emerald-500 transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay escuro quando menu está aberto */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 z-40 flex h-screen w-64 flex-col justify-between border-r bg-slate-950 text-white p-6 transition-transform duration-300 ease-in-out",
          "lg:translate-x-0 lg:fixed",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo - desktop */}
        <div>
          <div className="mb-8 hidden md:flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-500" />
            <h1 className="text-xl font-bold tracking-tight">Apollo Admin</h1>
          </div>

          {/* Espaçamento para mobile (compensar barra superior) */}
          <div className="h-14 md:hidden" />

          {/* Menu */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-slate-800 text-white"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                  )}
                >
                  <item.icon size={20} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}