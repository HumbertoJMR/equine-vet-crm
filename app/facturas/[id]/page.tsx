"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { Factura } from "@/components/factura"

export default function FacturaPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { getHistoria, getFactura, addFactura, getCaballo } = useStore()
  const [isLoading, setIsLoading] = useState(true)
  const [facturaId, setFacturaId] = useState<string | null>(null)

  // Verificar si el ID es de una historia clínica o una factura
  useEffect(() => {
    const historia = getHistoria(params.id)
    const factura = getFactura(params.id)

    if (factura) {
      // Si es una factura, mostrarla directamente
      setFacturaId(params.id)
      setIsLoading(false)
    } else if (historia) {
      // Si es una historia clínica, verificar si ya tiene factura
      if (historia.facturaGenerada && historia.facturaId) {
        setFacturaId(historia.facturaId)
        setIsLoading(false)
      } else {
        // Generar nueva factura
        const caballo = getCaballo(historia.caballoId)
        if (caballo) {
          const newFacturaId = addFactura({
            historiaClinicaId: historia.id,
            caballoId: historia.caballoId,
            propietarioId: caballo.propietarioId,
            fecha: historia.fecha,
            servicios: historia.servicios,
            observaciones: historia.observaciones || "",
            totalNeto: historia.totalNeto,
            iva: historia.iva,
            totalConIva: historia.totalConIva,
          })
          setFacturaId(newFacturaId)
        }
        setIsLoading(false)
      }
    } else {
      // No se encontró ni historia ni factura
      router.push("/historias-clinicas")
    }
  }, [params.id, getHistoria, getFactura, addFactura, getCaballo, router])

  if (isLoading) {
    return (
      <div className="container py-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!facturaId) {
    return (
      <div className="container py-6">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <h3 className="font-medium mb-1">No se pudo generar la factura</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Hubo un problema al generar la factura. Por favor, inténtelo de nuevo.
          </p>
          <Link href="/historias-clinicas">
            <Button>Volver a Historias Clínicas</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6">
      <div className="mb-6">
        <Link href="/historias-clinicas" className="flex items-center text-muted-foreground hover:text-foreground mb-2">
          <ChevronLeft className="h-4 w-4 mr-1" /> Volver a Historias Clínicas
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Factura</h1>
        <p className="text-muted-foreground">Visualización e impresión de factura</p>
      </div>

      <Factura facturaId={facturaId} />
    </div>
  )
}
