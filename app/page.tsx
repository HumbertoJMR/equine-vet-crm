"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Plus,
  AlertTriangle,
  Calendar,
  Package2,
  HopIcon as HorseshoeIcon,
  DollarSign,
  BarChart3,
  TrendingUp,
} from "lucide-react"

// Importa useEffect y useRouter
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"

export default function Dashboard() {
  const { caballos, citas, historiasClinicas, inventario, facturas, eventos, getAnalytics } = useStore()
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  // Estado para simular carga de datos
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simular carga de datos
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Redirigir al login si no está autenticado y no está cargando
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [loading, isAuthenticated, router])

  // Si está cargando o no está autenticado, mostrar un indicador de carga
  if (loading || !isAuthenticated) {
    return (
      <div className="container py-6 flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Obtener analíticas
  const analytics = getAnalytics()

  // Calcular datos para el dashboard
  const citasHoy = citas.filter((cita) => {
    const hoy = new Date().toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    return cita.fecha === hoy && !cita.completada
  })

  const medicamentosBajos = inventario.filter((item) => item.stock < item.minimo)

  const proximasCitas = citas
    .filter((cita) => !cita.completada)
    .sort((a, b) => {
      const fechaA = new Date(a.fecha.split(" ").reverse().join("-"))
      const fechaB = new Date(b.fecha.split(" ").reverse().join("-"))
      return fechaA.getTime() - fechaB.getTime()
    })
    .slice(0, 5)

  const proximosEventos = eventos
    .filter((evento) => evento.estado === "programado" || evento.estado === "en_curso")
    .sort((a, b) => {
      const fechaA = new Date(a.fecha.split(" ").reverse().join("-"))
      const fechaB = new Date(b.fecha.split(" ").reverse().join("-"))
      return fechaA.getTime() - fechaB.getTime()
    })
    .slice(0, 3)

  // Renderizar skeleton loaders durante la carga
  if (isLoading) {
    return (
      <div className="container py-6">
        <h2 className="text-3xl font-bold tracking-tight mb-6">Dashboard</h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-5 w-24 bg-muted rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-12 bg-muted rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 mt-6">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 w-32 bg-muted rounded animate-pulse"></div>
                <div className="h-4 w-48 bg-muted rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="flex items-center justify-between border-b pb-2">
                      <div className="space-y-2">
                        <div className="h-5 w-24 bg-muted rounded animate-pulse"></div>
                        <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-5 w-16 bg-muted rounded animate-pulse"></div>
                        <div className="h-4 w-12 bg-muted rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6">
      <h2 className="text-3xl font-bold tracking-tight mb-6">Dashboard</h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-blue-500" />
              Citas Hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{citasHoy.length}</div>
            <Link href="/agenda" className="text-xs text-blue-600 hover:underline">
              Ver agenda
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <HorseshoeIcon className="h-4 w-4 mr-2 text-green-500" />
              Caballos Registrados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{caballos.length}</div>
            <Link href="/caballos" className="text-xs text-green-600 hover:underline">
              Ver caballos
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
              Medicamentos Bajos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{medicamentosBajos.length}</div>
            <Link href="/inventario" className="text-xs text-red-600 hover:underline">
              Ver inventario
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-purple-500" />
              Ingresos Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">${analytics.totalIngresos.toFixed(2)}</div>
            <Link href="/facturas" className="text-xs text-purple-600 hover:underline">
              Ver facturas
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-500" />
              Próximas Citas
            </CardTitle>
            <CardDescription>Citas programadas para los próximos días</CardDescription>
          </CardHeader>
          <CardContent>
            {proximasCitas.length > 0 ? (
              <div className="space-y-4">
                {proximasCitas.map((cita) => {
                  const caballo = caballos.find((c) => c.id === cita.caballoId)
                  return (
                    <div key={cita.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">{caballo?.nombre || "Caballo no encontrado"}</p>
                        <p className="text-sm text-muted-foreground">{cita.tipo}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{cita.fecha}</p>
                        <p className="text-sm text-muted-foreground">{cita.hora}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Calendar className="h-10 w-10 text-muted-foreground mb-2" />
                <h3 className="font-medium mb-1">No hay citas programadas</h3>
                <p className="text-sm text-muted-foreground mb-4">Agenda una nueva cita para comenzar</p>
              </div>
            )}
            <Link href="/agenda">
              <Button variant="outline" className="w-full mt-4">
                <Plus className="mr-2 h-4 w-4" /> Agendar nueva cita
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package2 className="h-5 w-5 mr-2 text-red-500" />
              Inventario Crítico
            </CardTitle>
            <CardDescription>Medicamentos e insumos con stock bajo</CardDescription>
          </CardHeader>
          <CardContent>
            {medicamentosBajos.length > 0 ? (
              <div className="space-y-4">
                {medicamentosBajos.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{item.nombre}</p>
                      <p className="text-sm text-muted-foreground">{item.categoria}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-16 rounded-full bg-gray-200">
                        <div
                          className="h-2.5 rounded-full bg-red-500"
                          style={{ width: `${(item.stock / item.minimo) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">
                        {item.stock}/{item.minimo}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Package2 className="h-10 w-10 text-muted-foreground mb-2" />
                <h3 className="font-medium mb-1">Inventario en buen estado</h3>
                <p className="text-sm text-muted-foreground mb-4">No hay items con stock bajo</p>
              </div>
            )}
            <Link href="/inventario">
              <Button variant="outline" className="w-full mt-4">
                <Plus className="mr-2 h-4 w-4" /> Agregar nuevo item
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-purple-500" />
              Ingresos Mensuales
            </CardTitle>
            <CardDescription>Ingresos de los últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.ingresosUltimos6Meses.length > 0 ? (
              <div className="space-y-4">
                {analytics.ingresosUltimos6Meses.map((mes, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{mes.mes}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500"
                          style={{
                            width: `${
                              (mes.ingresos / Math.max(...analytics.ingresosUltimos6Meses.map((m) => m.ingresos), 1)) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">${mes.ingresos.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <BarChart3 className="h-10 w-10 text-muted-foreground mb-2" />
                <h3 className="font-medium mb-1">No hay datos disponibles</h3>
                <p className="text-sm text-muted-foreground mb-4">Registra historias clínicas para generar ingresos</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
              Próximos Eventos
            </CardTitle>
            <CardDescription>Eventos programados</CardDescription>
          </CardHeader>
          <CardContent>
            {proximosEventos.length > 0 ? (
              <div className="space-y-4">
                {proximosEventos.map((evento) => (
                  <div key={evento.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{evento.nombre}</p>
                      <p className="text-sm text-muted-foreground">{evento.ubicacion}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{evento.fecha}</p>
                      <Link href={`/eventos/${evento.id}`}>
                        <Button variant="ghost" size="sm">
                          Ver detalles
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Calendar className="h-10 w-10 text-muted-foreground mb-2" />
                <h3 className="font-medium mb-1">No hay eventos programados</h3>
                <p className="text-sm text-muted-foreground mb-4">Registra un nuevo evento para comenzar</p>
              </div>
            )}
            <Link href="/eventos">
              <Button variant="outline" className="w-full mt-4">
                <Plus className="mr-2 h-4 w-4" /> Crear nuevo evento
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
