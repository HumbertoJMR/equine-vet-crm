"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { User, LogOut } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"
import { useAuth } from "@/lib/auth"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function MainNav() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  // No mostrar la navegación en la página de login
  if (pathname === "/login") {
    return null
  }

  const routes = [
    { href: "/", label: "Dashboard" },
    { href: "/caballos", label: "Caballos" },
    { href: "/propietarios", label: "Propietarios" },
    { href: "/historias-clinicas", label: "Historias Clínicas" },
    { href: "/facturas", label: "Facturas" },
    { href: "/agenda", label: "Agenda" },
    { href: "/eventos", label: "Eventos" },
    { href: "/servicios", label: "Servicios" }, // Añadir esta línea
    { href: "/inventario", label: "Inventario" },
  ]

  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Equinmedical Logo" width={40} height={40} />
          <h1 className="text-xl font-bold">Equinmedical</h1>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === route.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {route.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{user.nombre.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.nombre}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/perfil">
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm">
                Iniciar Sesión
              </Button>
            </Link>
          )}
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
