"use client"

import { useRef } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Printer } from "lucide-react"

interface FacturaProps {
  facturaId: string
  onPrint?: () => void
}

export function Factura({ facturaId, onPrint }: FacturaProps) {
  const { getFactura, getCaballo, getPropietario, configuracion } = useStore()
  const facturaRef = useRef<HTMLDivElement>(null)

  const factura = getFactura(facturaId)

  if (!factura) {
    return <div>Factura no encontrada</div>
  }

  const caballo = getCaballo(factura.caballoId)
  const propietario = getPropietario(factura.propietarioId)

  const handlePrint = () => {
    if (facturaRef.current) {
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Factura ${factura.numero}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                .factura { max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; }
                .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
                .info { margin-bottom: 20px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
                th { background-color: #f2f2f2; }
                .totals { text-align: right; }
                .footer { margin-top: 30px; text-align: center; font-size: 12px; }
              </style>
            </head>
            <body>
              ${facturaRef.current.innerHTML}
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()

        if (onPrint) {
          onPrint()
        }
      }
    }
  }

  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex justify-end mb-4">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" /> Imprimir Factura
          </Button>
        </div>

        <div ref={facturaRef} className="border p-6 rounded-md">
          {/* Encabezado */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold">{configuracion.nombre}</h2>
              <div className="text-sm text-gray-600">
                {configuracion.telefonos.map((tel, i) => (
                  <div key={i}>{tel}</div>
                ))}
                {configuracion.instagram && <div>{configuracion.instagram}</div>}
                <div>{configuracion.email}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold mb-2">RECIBO</div>
              <div className="text-sm">
                <div>FECHA: {factura.fecha}</div>
                <div>N°: {factura.numero}</div>
              </div>
            </div>
          </div>

          {/* Información del cliente */}
          <div className="mb-6 border-b pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-semibold mb-1">NOMBRE/RAZÓN SOCIAL:</div>
                <div>{propietario?.nombre || "N/A"}</div>
              </div>
              <div>
                <div className="text-sm font-semibold mb-1">CÉDULA/RIF:</div>
                <div>{propietario?.cedula || propietario?.rif || "N/A"}</div>
              </div>
              <div>
                <div className="text-sm font-semibold mb-1">DIRECCIÓN:</div>
                <div>{propietario?.direccion || "N/A"}</div>
              </div>
              <div>
                <div className="text-sm font-semibold mb-1">TELÉFONO:</div>
                <div>{propietario?.telefono || "N/A"}</div>
              </div>
            </div>
          </div>

          {/* Ejemplares */}
          <div className="mb-6">
            <div className="text-sm font-semibold mb-1">EJEMPLARES:</div>
            <div>{caballo?.nombre || "N/A"}</div>
          </div>

          {/* Tabla de servicios */}
          <table className="w-full mb-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left py-2 px-2">DESCRIPCIÓN</th>
                <th className="text-center py-2 px-2">CANTIDAD</th>
                <th className="text-right py-2 px-2">PRECIO U.</th>
                <th className="text-right py-2 px-2">SUB TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {factura.servicios.map((servicio, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-2">{servicio.descripcion}</td>
                  <td className="py-2 px-2 text-center">{servicio.cantidad}</td>
                  <td className="py-2 px-2 text-right">${servicio.precioUnitario.toFixed(2)}</td>
                  <td className="py-2 px-2 text-right">${(servicio.cantidad * servicio.precioUnitario).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Observaciones */}
          <div className="mb-6">
            <div className="text-sm font-semibold mb-1">OBSERVACIONES:</div>
            <div className="border p-2 min-h-[60px]">{factura.observaciones || "N/A"}</div>
          </div>

          {/* Totales */}
          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-1">
                <div className="font-semibold">TOTAL NETO</div>
                <div>${factura.totalNeto.toFixed(2)}</div>
              </div>
              <div className="flex justify-between py-1">
                <div className="font-semibold">I.V.A 16%</div>
                <div>${factura.iva.toFixed(2)}</div>
              </div>
              <div className="flex justify-between py-1 border-t font-bold">
                <div>TOTAL OPERACIÓN</div>
                <div>${factura.totalConIva.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* Pie de página */}
          <div className="mt-8 text-center text-sm text-gray-500">Este documento no tiene validez fiscal</div>
        </div>
      </CardContent>
    </Card>
  )
}
