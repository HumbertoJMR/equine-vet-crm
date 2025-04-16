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
        setError(null)

        // Obtener la sesión actual
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("Error de sesión:", sessionError)
          throw sessionError
        }

        // Si no hay sesión, redirigir al login
        if (!session) {
          setUser(null)
          setIsAuthenticated(false)
          router.push('/login')
          return
        }

        // Si hay una sesión, obtener datos del usuario
        if (session?.user?.email) {
          const { data: userData, error: userError } = await supabase
            .from("usuarios")
            .select("*, clinicas(*)")
            .eq("email", session.user.email)
            .eq("activo", true)
            .single()

          if (userError) {
            console.error("Error al obtener datos del usuario:", userError)
            throw userError
          }

          if (!userData) {
            // Si el usuario no existe en la base de datos, intentar crearlo
            const { data: newUser, error: createError } = await supabase
              .from("usuarios")
              .insert([
                {
                  email: session.user.email,
                  nombre: session.user.user_metadata?.full_name || session.user.email,
                  rol: "admin",
                  activo: true,
                  clinica_id: "a0a80121-7ac0-4e1c-9cd4-8b8446119355" // ID actualizado de la clínica por defecto
                }
              ])
              .select("*, clinicas(*)")
              .single()

            if (createError) {
              console.error("Error al crear usuario:", createError)
              throw createError
            }

            if (newUser) {
              const appUser = dbToUsuario(newUser)
              setUser(appUser)
              setIsAuthenticated(true)
            }
          } else {
            const appUser = dbToUsuario(userData)
            setUser(appUser)
            setIsAuthenticated(true)
          }
        }
      } catch (err: any) {
        console.error("Error al verificar usuario:", err)
        setError(err.message)
        setUser(null)
        setIsAuthenticated(false)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        checkUser()
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        setIsAuthenticated(false)
        router.push('/login')
      }
    })

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe()
      }
    }
  }, [supabase, router])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)

      // Autenticar con Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      if (!authData.user) throw new Error("No se pudo autenticar")

      // La verificación del usuario en la base de datos se hará en el useEffect
      return true
    } catch (err: any) {
      console.error("Error al iniciar sesión:", err)
      setError(err.message || "Error al iniciar sesión")
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
      router.push('/login')
    } catch (err: any) {
      console.error("Error al cerrar sesión:", err)
      setError(err.message)
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
