"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ItemInventario } from "@/lib/types"

interface InventarioFormProps {
  item?: ItemInventario
  onSuccess?: () => void
}

export function InventarioForm({ item, onSuccess }: InventarioFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { addInventarioItem, updateInventarioItem } = useStore()

  const [formData, setFormData] = useState({
    nombre: item?.nombre || "",
    categoria: item?.categoria || "",
    stock: item?.stock?.toString() || "",
    minimo: item?.minimo?.toString() || "",
    unidad: item?.unidad || "",
    precio: item?.precio?.toString() || "",
    proveedor: item?.proveedor || "",
    ultimaCompra: item?.ultimaCompra || "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

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
      if (!formData.nombre || !formData.categoria || !formData.unidad) {
        throw new Error("Por favor complete los campos obligatorios")
      }

      const itemData = {
        ...formData,
        stock: Number.parseInt(formData.stock) || 0,
        minimo: Number.parseInt(formData.minimo) || 0,
        precio: Number.parseFloat(formData.precio) || undefined,
      }

      if (item) {
        // Actualizar item existente
        updateInventarioItem(item.id, itemData)
        toast({
          title: "Item actualizado",
          description: `${formData.nombre} ha sido actualizado correctamente.`,
        })
      } else {
        // Crear nuevo item
        addInventarioItem(itemData)
        toast({
          title: "Item agregado",
          description: `${formData.nombre} ha sido agregado al inventario.`,
        })
      }

      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/inventario")
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="nombre">
            Nombre <span className="text-red-500">*</span>
          </Label>
          <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoria">
            Categoría <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.categoria} onValueChange={(value) => handleSelectChange("categoria", value)} required>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Medicamento">Medicamento</SelectItem>
              <SelectItem value="Insumo">Insumo</SelectItem>
              <SelectItem value="Equipo">Equipo</SelectItem>
              <SelectItem value="Alimento">Alimento</SelectItem>
              <SelectItem value="Otro">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">Stock actual</Label>
          <Input id="stock" name="stock" type="number" min="0" value={formData.stock} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="minimo">Stock mínimo</Label>
          <Input id="minimo" name="minimo" type="number" min="0" value={formData.minimo} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unidad">
            Unidad <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.unidad} onValueChange={(value) => handleSelectChange("unidad", value)} required>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar unidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Unidades">Unidades</SelectItem>
              <SelectItem value="Frascos">Frascos</SelectItem>
              <SelectItem value="Cajas">Cajas</SelectItem>
              <SelectItem value="Tubos">Tubos</SelectItem>
              <SelectItem value="Pares">Pares</SelectItem>
              <SelectItem value="Rollos">Rollos</SelectItem>
              <SelectItem value="Paquetes">Paquetes</SelectItem>
              <SelectItem value="Litros">Litros</SelectItem>
              <SelectItem value="Kg">Kg</SelectItem>
              <SelectItem value="Dosis">Dosis</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="precio">Precio unitario</Label>
          <Input
            id="precio"
            name="precio"
            type="number"
            step="0.01"
            min="0"
            value={formData.precio}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="proveedor">Proveedor</Label>
          <Input id="proveedor" name="proveedor" value={formData.proveedor} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ultimaCompra">Última compra</Label>
          <Input
            id="ultimaCompra"
            name="ultimaCompra"
            type="date"
            value={formData.ultimaCompra}
            onChange={handleChange}
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
          {isSubmitting ? "Guardando..." : item ? "Actualizar" : "Agregar"}
        </Button>
      </div>
    </form>
  )
}
