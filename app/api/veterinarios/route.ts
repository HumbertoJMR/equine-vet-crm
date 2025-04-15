import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const clinica_id = searchParams.get("clinica_id")
    const especialidad = searchParams.get("especialidad")

    let query = supabase
      .from("veterinarios")
      .select(`
        *,
        citas (*),
        historias_clinicas (*),
        eventos (*)
      `)

    if (clinica_id) {
      query = query.eq("clinica_id", clinica_id)
    }

    if (especialidad) {
      query = query.eq("especialidad", especialidad)
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
      .from("veterinarios")
      .insert([body])
      .select(`
        *,
        citas (*),
        historias_clinicas (*),
        eventos (*)
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
      .from("veterinarios")
      .update(updateData)
      .eq("id", id)
      .select(`
        *,
        citas (*),
        historias_clinicas (*),
        eventos (*)
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

    const { error } = await supabase.from("veterinarios").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 