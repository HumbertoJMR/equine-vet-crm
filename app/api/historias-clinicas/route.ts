import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const caballo_id = searchParams.get("caballo_id")
    const clinica_id = searchParams.get("clinica_id")

    let query = supabase
      .from("historias_clinicas")
      .select(`
        *,
        caballos (*),
        veterinarios (*)
      `)

    if (caballo_id) {
      query = query.eq("caballo_id", caballo_id)
    }

    if (clinica_id) {
      query = query.eq("clinica_id", clinica_id)
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
      .from("historias_clinicas")
      .insert([body])
      .select(`
        *,
        caballos (*),
        veterinarios (*)
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
      .from("historias_clinicas")
      .update(updateData)
      .eq("id", id)
      .select(`
        *,
        caballos (*),
        veterinarios (*)
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

    const { error } = await supabase.from("historias_clinicas").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 