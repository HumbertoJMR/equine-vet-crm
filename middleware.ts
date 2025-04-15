import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(request: NextRequest) {
  try {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req: request, res })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Si el usuario no está autenticado y la ruta no es /login, redirigir a /login
    if (!session && !request.nextUrl.pathname.startsWith("/login")) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // Si el usuario está autenticado y la ruta es /login, redirigir a /
    if (session && request.nextUrl.pathname.startsWith("/login")) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    return res
  } catch (error) {
    console.error("Error en middleware:", error)
    // En caso de error de autenticación, permitir que la solicitud continúe
    // y dejar que la página maneje el estado no autenticado
    return NextResponse.next()
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}
