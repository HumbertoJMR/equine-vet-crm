import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const caballo_id = searchParams.get("caballo_id")
    const veterinario_id = searchParams.get("veterinario_id")
    const clinica_id = searchParams.get("clinica_id")
    const fecha_inicio = searchParams.get("fecha_inicio")
    const fecha_fin = searchParams.get("fecha_fin")

    let query = supabase
      .from("citas")
      .select(`
        *,
        caballos (*),
        veterinarios (*),
        servicios (*)
      `)

    if (caballo_id) {
      query = query.eq("caballo_id", caballo_id)
    }

    if (veterinario_id) {
      query = query.eq("veterinario_id", veterinario_id)
    }

    if (clinica_id) {
      query = query.eq("clinica_id", clinica_id)
    }

    if (fecha_inicio && fecha_fin) {
      query = query.gte("fecha", fecha_inicio).lte("fecha", fecha_fin)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from("citas")
      .insert([body])
      .select(`
        *,
        caballos (*),
        veterinarios (*),
        servicios (*)
      `)
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const body = await request.json()
    const { id, ...updateData } = body

    const { data, error } = await supabase
      .from("citas")
      .update(updateData)
      .eq("id", id)
      .select(`
        *,
        caballos (*),
        veterinarios (*),
        servicios (*)
      `)
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    const { error } = await supabase.from("citas").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 