import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Obtener todos los usuarios
    const { data: usuarios, error } = await supabase.from("usuarios").select("*")

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Agrupar usuarios por email
    const usuariosPorEmail: Record<string, any[]> = {}

    usuarios?.forEach((usuario) => {
      if (!usuariosPorEmail[usuario.email]) {
        usuariosPorEmail[usuario.email] = []
      }
      usuariosPorEmail[usuario.email].push(usuario)
    })

    // Encontrar emails con múltiples usuarios
    const emailsConDuplicados: Record<string, any[]> = {}

    Object.entries(usuariosPorEmail).forEach(([email, users]) => {
      if (users.length > 1) {
        emailsConDuplicados[email] = users
      }
    })

    return NextResponse.json({
      totalUsuarios: usuarios?.length || 0,
      emailsUnicos: Object.keys(usuariosPorEmail).length,
      emailsConDuplicados,
      hayDuplicados: Object.keys(emailsConDuplicados).length > 0,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST() {
  try {
    const supabase = createServerSupabaseClient()

    // Obtener todos los usuarios
    const { data: usuarios, error } = await supabase.from("usuarios").select("*")

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Agrupar usuarios por email
    const usuariosPorEmail: Record<string, any[]> = {}

    usuarios?.forEach((usuario) => {
      if (!usuariosPorEmail[usuario.email]) {
        usuariosPorEmail[usuario.email] = []
      }
      usuariosPorEmail[usuario.email].push(usuario)
    })

    // Corregir duplicados (mantener solo el más reciente)
    const resultados: Record<string, any> = {}

    for (const [email, users] of Object.entries(usuariosPorEmail)) {
      if (users.length > 1) {
        // Ordenar por fecha de creación (más reciente primero)
        const ordenados = [...users].sort(
          (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime(),
        )

        // Mantener el más reciente
        const mantener = ordenados[0]
        const eliminar = ordenados.slice(1)

        resultados[email] = {
          mantenido: mantener,
          eliminados: [],
        }

        // Eliminar los duplicados
        for (const usuario of eliminar) {
          const { error: deleteError } = await supabase.from("usuarios").delete().eq("id", usuario.id)

          if (deleteError) {
            resultados[email].error = deleteError.message
          } else {
            resultados[email].eliminados.push(usuario)
          }
        }
      }
    }

    return NextResponse.json({
      mensaje: "Proceso de corrección completado",
      resultados,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
