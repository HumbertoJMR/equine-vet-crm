"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import type { Usuario } from "@/lib/types"
import { dbToUsuario } from "@/lib/db-utils"

type AuthContextType = {
  user: Usuario | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkUser = async () => {
      try {
        setLoading(true)

        // Obtener la sesión actual
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        // Si hay un error o no hay sesión, simplemente establecer el estado como no autenticado
        if (sessionError || !session) {
          setUser(null)
          setIsAuthenticated(false)
          setLoading(false)
          return
        }

        // Si hay una sesión, obtener los datos del usuario
        if (session?.user?.email) {
          // Usuario autenticado, obtener datos de la tabla usuarios
          const { data: userData, error: userError } = await supabase
            .from("usuarios")
            .select("*")
            .eq("email", session.user.email)
            .eq("activo", true)
            .single()

          if (userError) {
            console.error("Error al obtener datos del usuario:", userError)
            setUser(null)
            setIsAuthenticated(false)
          } else if (userData) {
            const appUser = dbToUsuario(userData)
            setUser(appUser)
            setIsAuthenticated(true)
          } else {
            console.warn("Usuario autenticado pero no encontrado en la tabla usuarios")
            setUser(null)
            setIsAuthenticated(false)
          }
        } else {
          setUser(null)
          setIsAuthenticated(false)
        }
      } catch (err) {
        console.error("Error al verificar usuario:", err)
        setError("Error al verificar usuario")
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    // Suscribirse a cambios en el estado de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        checkUser()
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        setIsAuthenticated(false)
      }
    })

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe()
      }
    }
  }, [supabase])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)

      // Autenticar con Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        throw authError
      }

      if (!authData.user) {
        throw new Error("No se pudo autenticar")
      }

      // Verificar si el usuario existe en la tabla usuarios
      const { data: userData, error: userError } = await supabase
        .from("usuarios")
        .select("*")
        .eq("email", email)
        .eq("activo", true)
        .single()

      if (userError) {
        throw userError
      }

      if (!userData) {
        throw new Error("Usuario no encontrado en el sistema")
      }

      const appUser = dbToUsuario(userData)

      setUser(appUser)
      setIsAuthenticated(true)
      router.push("/")
      return true
    } catch (err: any) {
      console.error("Error al iniciar sesión:", err)
      setError(err.message || "Error al iniciar sesión")
      setUser(null)
      setIsAuthenticated(false)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      await supabase.auth.signOut()
      setUser(null)
      setIsAuthenticated(false)
      router.push("/login")
    } catch (err) {
      console.error("Error al cerrar sesión:", err)
      setError("Error al cerrar sesión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}
