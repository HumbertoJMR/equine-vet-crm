import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Check auth users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
    
    // Check database users
    const { data: dbUsers, error: dbError } = await supabase
      .from("usuarios")
      .select("*")
      .eq("email", "humbertjmr96@gmail.com")

    if (authError || dbError) {
      return NextResponse.json({
        success: false,
        message: "Error checking users",
        authError: authError?.message,
        dbError: dbError?.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      authUsers: authUsers,
      dbUsers: dbUsers
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Server error",
      error: error
    }, { status: 500 })
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
