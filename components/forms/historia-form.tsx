"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Trash2, Plus, AlertTriangle } from "lucide-react"
import { CaballoForm } from "@/components/forms/caballo-form"
import { VeterinarioForm } from "@/components/forms/veterinario-form"
import type { HistoriaClinica, Servicio } from "@/lib/types"
import { Checkbox } from "@/components/ui/checkbox"

interface HistoriaFormProps {
  historia?: HistoriaClinica
  caballoId?: string
  eventoId?: string
  onSuccess?: (historiaId?: string) => void
}

export function HistoriaForm({ historia, caballoId, eventoId, onSuccess }: HistoriaFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { addHistoriaClinica, caballos, eventos, veterinarios, servicios, inventario, updateInventarioStock } =
    useStore()

  const [formData, setFormData] = useState({
    caballoId: historia?.caballoId || caballoId || "",
    fecha: historia?.fecha || new Date().toISOString().split("T")[0],
    tipo: historia?.tipo || "",
    veterinarioId: historia?.veterinarioId || "",
    observaciones: historia?.observaciones || "",
    eventoId: historia?.eventoId || eventoId || "",
    ivaRate: historia?.ivaRate?.toString() || "16", // Porcentaje de IVA por defecto
  })

  const [serviciosSeleccionados, setServiciosSeleccionados] = useState<Omit<Servicio, "id">[]>(
    historia?.servicios?.map((s) => ({
      descripcion: s.descripcion,
      cantidad: s.cantidad,
      precioUnitario: s.precioUnitario,
    })) || [{ descripcion: "", cantidad: 1, precioUnitario: 0 }],
  )

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCaballoDialogOpen, setIsCaballoDialogOpen] = useState(false)
  const [isVeterinarioDialogOpen, setIsVeterinarioDialogOpen] = useState(false)

  const [inventarioUsado, setInventarioUsado] = useState<{ itemId: string; cantidad: number }[]>([])
  const [showFacturaDialog, setShowFacturaDialog] = useState(false)
  const [createdHistoriaId, setCreatedHistoriaId] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleServicioChange = (index: number, field: keyof Omit<Servicio, "id">, value: string | number) => {
    const newServicios = [...serviciosSeleccionados]
    newServicios[index] = {
      ...newServicios[index],
      [field]: field === "descripcion" ? value : Number(value),
    }
    setServiciosSeleccionados(newServicios)
  }

  const addServicio = () => {
    setServiciosSeleccionados([...serviciosSeleccionados, { descripcion: "", cantidad: 1, precioUnitario: 0 }])
  }

  const removeServicio = (index: number) => {
    if (serviciosSeleccionados.length > 1) {
      const newServicios = [...serviciosSeleccionados]
      newServicios.splice(index, 1)
      setServiciosSeleccionados(newServicios)
    }
  }

  // Calcular totales
  const calcularTotalNeto = () => {
    return serviciosSeleccionados.reduce((total, servicio) => {
      return total + servicio.cantidad * servicio.precioUnitario
    }, 0)
  }

  const calcularIVA = () => {
    const ivaRateNumber = Number.parseFloat(formData.ivaRate) / 100
    return calcularTotalNeto() * ivaRateNumber
  }

  const calcularTotal = () => {
    return calcularTotalNeto() + calcularIVA()
  }

  const handleServicioSelect = (servicioId: string) => {
    const servicio = servicios.find((s) => s.id === servicioId)
    if (!servicio) return

    const newServicios = [...serviciosSeleccionados]
    const newServicio = {
      descripcion: servicio.nombre,
      cantidad: 1,
      precioUnitario: servicio.precio,
    }
    setServiciosSeleccionados([...serviciosSeleccionados, newServicio])
  }

  const handleInventarioChange = (itemId: string, checked: boolean, cantidad = 1) => {
    if (checked) {
      setInventarioUsado((prev) => [...prev, { itemId, cantidad }])
    } else {
      setInventarioUsado((prev) => prev.filter((item) => item.itemId !== itemId))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validación básica
      if (!formData.caballoId || !formData.tipo || !formData.veterinarioId) {
        throw new Error("Por favor complete los campos obligatorios")
      }

      // Validar servicios
      if (serviciosSeleccionados.some((s) => !s.descripcion)) {
        throw new Error("Todos los servicios deben tener una descripción")
      }

      // Formatear fecha para mostrar
      const fecha = new Date(formData.fecha)
      const fechaFormateada = fecha.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })

      // Calcular totales
      const totalNeto = calcularTotalNeto()
      const iva = calcularIVA()
      const totalConIva = calcularTotal()

      // Crear servicios con IDs
      const serviciosConId = serviciosSeleccionados.map((servicio) => ({
        ...servicio,
        id: Math.random().toString(36).substring(2, 9),
      }))

      // Crear nueva historia clínica
      const historiaId = await addHistoriaClinica({
        ...formData,
        // Asegurarse de que eventoId sea null si es "none"
        eventoId: formData.eventoId === "none" ? null : formData.eventoId,
        fecha: fechaFormateada,
        servicios: serviciosConId,
        totalNeto,
        iva,
        totalConIva,
        ivaRate: Number.parseFloat(formData.ivaRate),
        facturaGenerada: false,
        inventarioUsado: inventarioUsado,
      })

      // Actualizar inventario
      inventarioUsado.forEach((item) => {
        updateInventarioStock(item.itemId, item.cantidad)
      })

      toast({
        title: "Historia clínica agregada",
        description: "La historia clínica ha sido registrada correctamente.",
      })

      if (onSuccess) {
        onSuccess(historiaId)
      } else {
        router.push("/historias-clinicas")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Ha ocurrido un error",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCaballoSuccess = () => {
    setIsCaballoDialogOpen(false)
    // Seleccionar automáticamente el último caballo agregado
    if (caballos.length > 0) {
      const ultimoCaballo = caballos[caballos.length - 1]
      setFormData((prev) => ({ ...prev, caballoId: ultimoCaballo.id }))
    }
  }

  const handleVeterinarioSuccess = () => {
    setIsVeterinarioDialogOpen(false)
    // Seleccionar automáticamente el último veterinario agregado
    if (veterinarios.length > 0) {
      const ultimoVeterinario = veterinarios[veterinarios.length - 1]
      setFormData((prev) => ({ ...prev, veterinarioId: ultimoVeterinario.id }))
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="caballoId">
                Caballo <span className="text-red-500">*</span>
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsCaballoDialogOpen(true)}
                className="h-6 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" /> Nuevo
              </Button>
            </div>
            <Select
              value={formData.caballoId}
              onValueChange={(value) => handleSelectChange("caballoId", value)}
              disabled={!!caballoId}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar caballo" />
              </SelectTrigger>
              <SelectContent>
                {caballos.map((caballo) => (
                  <SelectItem key={caballo.id} value={caballo.id}>
                    {caballo.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fecha">
              Fecha <span className="text-red-500">*</span>
            </Label>
            <Input id="fecha" name="fecha" type="date" value={formData.fecha} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">
              Tipo de consulta <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.tipo} onValueChange={(value) => handleSelectChange("tipo", value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Revisión General">Revisión General</SelectItem>
                <SelectItem value="Vacunación">Vacunación</SelectItem>
                <SelectItem value="Tratamiento">Tratamiento</SelectItem>
                <SelectItem value="Revisión Dental">Revisión Dental</SelectItem>
                <SelectItem value="Herraje">Herraje</SelectItem>
                <SelectItem value="Emergencia">Emergencia</SelectItem>
                <SelectItem value="Control">Control</SelectItem>
                <SelectItem value="Otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="veterinarioId">
                Veterinario <span className="text-red-500">*</span>
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsVeterinarioDialogOpen(true)}
                className="h-6 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" /> Nuevo
              </Button>
            </div>
            <Select
              value={formData.veterinarioId}
              onValueChange={(value) => handleSelectChange("veterinarioId", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar veterinario" />
              </SelectTrigger>
              <SelectContent>
                {veterinarios.map((veterinario) => (
                  <SelectItem key={veterinario.id} value={veterinario.id}>
                    {veterinario.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventoId">Evento asociado</Label>
            <Select
              value={formData.eventoId}
              onValueChange={(value) => handleSelectChange("eventoId", value)}
              disabled={!!eventoId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar evento (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Ninguno</SelectItem>
                {eventos.map((evento) => (
                  <SelectItem key={evento.id} value={evento.id}>
                    {evento.nombre} ({evento.fecha})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ivaRate">Porcentaje de IVA (%)</Label>
            <Input
              id="ivaRate"
              name="ivaRate"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={formData.ivaRate}
              onChange={handleChange}
            />
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Servicios y Productos</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addServicio}>
                    <Plus className="h-4 w-4 mr-1" /> Agregar servicio
                  </Button>
                </div>

                <div className="grid grid-cols-12 gap-2 font-medium text-sm">
                  <div className="col-span-6">Descripción</div>
                  <div className="col-span-2">Cantidad</div>
                  <div className="col-span-3">Precio Unit.</div>
                  <div className="col-span-1"></div>
                </div>

                {serviciosSeleccionados.map((servicio, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-6">
                      <Input
                        value={servicio.descripcion}
                        onChange={(e) => handleServicioChange(index, "descripcion", e.target.value)}
                        placeholder="Descripción del servicio"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        min="1"
                        value={servicio.cantidad}
                        onChange={(e) => handleServicioChange(index, "cantidad", e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={servicio.precioUnitario}
                        onChange={(e) => handleServicioChange(index, "precioUnitario", e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeServicio(index)}
                        disabled={serviciosSeleccionados.length <= 1}
                        className="h-8 w-8 text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Neto:</span>
                    <span>${calcularTotalNeto().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>IVA ({formData.ivaRate}%):</span>
                    <span>${calcularIVA().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>${calcularTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="font-medium">Seleccionar servicios predefinidos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {servicios.map((servicio) => (
                <div
                  key={servicio.id}
                  className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleServicioSelect(servicio.id)}
                >
                  <div>
                    <p className="font-medium">{servicio.nombre}</p>
                    <p className="text-sm text-muted-foreground">{servicio.categoria}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${servicio.precio.toFixed(2)}</p>
                    <Button variant="ghost" size="sm" className="h-7">
                      <Plus className="h-4 w-4 mr-1" /> Añadir
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="font-medium">Inventario utilizado</h3>
                <p className="text-sm text-muted-foreground">
                  Selecciona los items de inventario utilizados durante esta consulta
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {inventario.map((item) => (
                    <div key={item.id} className="flex items-center space-x-2 border p-3 rounded-md">
                      <Checkbox
                        id={`item-${item.id}`}
                        onCheckedChange={(checked) => handleInventarioChange(item.id, checked as boolean)}
                      />
                      <div className="grid gap-1.5 leading-none w-full">
                        <div className="flex justify-between w-full">
                          <label
                            htmlFor={`item-${item.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {item.nombre}
                          </label>
                          <div className="flex items-center">
                            {item.stock <= item.minimo && (
                              <div className="flex items-center text-amber-500 mr-2 text-xs">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Stock bajo
                              </div>
                            )}
                            <span className="text-xs text-muted-foreground">
                              Disp: {item.stock} {item.unidad}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <label className="text-xs text-muted-foreground mr-2">Cantidad:</label>
                          <Input
                            type="number"
                            min="1"
                            max={item.stock}
                            defaultValue="1"
                            className="h-7 w-20"
                            onChange={(e) => {
                              const cantidad = Number.parseInt(e.target.value) || 1
                              const checkbox = document.getElementById(`item-${item.id}`) as HTMLInputElement
                              if (checkbox?.checked) {
                                handleInventarioChange(item.id, true, cantidad)
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              rows={3}
              placeholder="Observaciones adicionales"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={(e) => {
              e.preventDefault()
              if (onSuccess) {
                onSuccess()
              }
            }}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Registrar Historia y Generar Factura"}
          </Button>
        </div>
      </form>

      {/* Diálogo para crear nuevo caballo */}
      <Dialog open={isCaballoDialogOpen} onOpenChange={setIsCaballoDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Registrar Nuevo Caballo</DialogTitle>
          </DialogHeader>
          <CaballoForm onSuccess={handleCaballoSuccess} />
        </DialogContent>
      </Dialog>

      {/* Diálogo para crear nuevo veterinario */}
      <Dialog open={isVeterinarioDialogOpen} onOpenChange={setIsVeterinarioDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Registrar Nuevo Veterinario</DialogTitle>
          </DialogHeader>
          <VeterinarioForm onSuccess={handleVeterinarioSuccess} />
        </DialogContent>
      </Dialog>
    </>
  )
}
