"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PropietarioForm } from "@/components/forms/propietario-form"
import { CaballerizaForm } from "@/components/forms/caballeriza-form"
import { Plus } from "lucide-react"
import type { Caballo } from "@/lib/types"

interface CaballoFormProps {
  caballo?: Caballo
  onSuccess?: () => void
}

export function CaballoForm({ caballo, onSuccess }: CaballoFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { addCaballo, updateCaballo, propietarios, caballerizas } = useStore()

  const [formData, setFormData] = useState({
    nombre: caballo?.nombre || "",
    raza: caballo?.raza || "",
    edad: caballo?.edad?.toString() || "",
    sexo: caballo?.sexo || "",
    color: caballo?.color || "",
    numeroChip: caballo?.numeroChip || "",
    propietarioId: caballo?.propietarioId || "",
    caballerizaId: caballo?.caballerizaId || "",
  })

  const [yearOfBirth, setYearOfBirth] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPropietarioDialogOpen, setIsPropietarioDialogOpen] = useState(false)
  const [isCaballerizaDialogOpen, setIsCaballerizaDialogOpen] = useState(false)

  // Calcular año de nacimiento cuando cambia la edad
  useEffect(() => {
    if (formData.edad) {
      const currentYear = new Date().getFullYear()
      setYearOfBirth(currentYear - Number.parseInt(formData.edad))
    } else {
      setYearOfBirth(null)
    }
  }, [formData.edad])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validación básica
      if (!formData.nombre || !formData.propietarioId || !formData.caballerizaId) {
        throw new Error("Por favor complete los campos obligatorios")
      }

      const caballoData = {
        ...formData,
        edad: Number.parseInt(formData.edad) || 0,
      }

      if (caballo) {
        // Actualizar caballo existente
        updateCaballo(caballo.id, caballoData)
        toast({
          title: "Caballo actualizado",
          description: `${formData.nombre} ha sido actualizado correctamente.`,
        })
      } else {
        // Crear nuevo caballo
        addCaballo(caballoData)
        toast({
          title: "Caballo agregado",
          description: `${formData.nombre} ha sido agregado correctamente.`,
        })
      }

      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/caballos")
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

  const handlePropietarioSuccess = () => {
    setIsPropietarioDialogOpen(false)
    // Seleccionar automáticamente el último propietario agregado
    if (propietarios.length > 0) {
      const ultimoPropietario = propietarios[propietarios.length - 1]
      setFormData((prev) => ({ ...prev, propietarioId: ultimoPropietario.id }))
    }
  }

  const handleCaballerizaSuccess = () => {
    setIsCaballerizaDialogOpen(false)
    // Seleccionar automáticamente la última caballeriza agregada
    if (caballerizas.length > 0) {
      const ultimaCaballeriza = caballerizas[caballerizas.length - 1]
      setFormData((prev) => ({ ...prev, caballerizaId: ultimaCaballeriza.id }))
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="nombre">
              Nombre <span className="text-red-500">*</span>
            </Label>
            <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="raza">Raza</Label>
            <Input id="raza" name="raza" value={formData.raza} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edad">Edad (años)</Label>
            <div className="flex items-center gap-2">
              <Input id="edad" name="edad" type="number" min="0" value={formData.edad} onChange={handleChange} />
              {yearOfBirth && (
                <div className="text-sm text-muted-foreground whitespace-nowrap">Año de nacimiento: {yearOfBirth}</div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sexo">Sexo</Label>
            <Select value={formData.sexo} onValueChange={(value) => handleSelectChange("sexo", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar sexo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Macho">Macho</SelectItem>
                <SelectItem value="Hembra">Hembra</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Input id="color" name="color" value={formData.color} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="numeroChip">Número de Chip</Label>
            <Input
              id="numeroChip"
              name="numeroChip"
              value={formData.numeroChip}
              onChange={handleChange}
              placeholder="Ej: 123456789012345"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="propietarioId">
                Propietario <span className="text-red-500">*</span>
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsPropietarioDialogOpen(true)}
                className="h-6 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" /> Nuevo
              </Button>
            </div>
            <Select
              value={formData.propietarioId}
              onValueChange={(value) => handleSelectChange("propietarioId", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar propietario" />
              </SelectTrigger>
              <SelectContent>
                {propietarios.map((propietario) => (
                  <SelectItem key={propietario.id} value={propietario.id}>
                    {propietario.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="caballerizaId">
                Caballeriza <span className="text-red-500">*</span>
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsCaballerizaDialogOpen(true)}
                className="h-6 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" /> Nueva
              </Button>
            </div>
            <Select
              value={formData.caballerizaId}
              onValueChange={(value) => handleSelectChange("caballerizaId", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar caballeriza" />
              </SelectTrigger>
              <SelectContent>
                {caballerizas.map((caballeriza) => (
                  <SelectItem key={caballeriza.id} value={caballeriza.id}>
                    {caballeriza.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            {isSubmitting ? "Guardando..." : caballo ? "Actualizar" : "Crear"}
          </Button>
        </div>
      </form>

      {/* Diálogo para crear nuevo propietario */}
      <Dialog open={isPropietarioDialogOpen} onOpenChange={setIsPropietarioDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Registrar Nuevo Propietario</DialogTitle>
          </DialogHeader>
          <PropietarioForm onSuccess={handlePropietarioSuccess} />
        </DialogContent>
      </Dialog>

      {/* Diálogo para crear nueva caballeriza */}
      <Dialog open={isCaballerizaDialogOpen} onOpenChange={setIsCaballerizaDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Registrar Nueva Caballeriza</DialogTitle>
          </DialogHeader>
          <CaballerizaForm onSuccess={handleCaballerizaSuccess} />
        </DialogContent>
      </Dialog>
    </>
  )
}
