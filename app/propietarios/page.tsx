"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, User, ChevronRight, Trash2, Phone, Mail, Building, MapPin } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PropietarioForm } from "@/components/forms/propietario-form"
import { CaballerizaForm } from "@/components/forms/caballeriza-form"
import { useToast } from "@/hooks/use-toast"

export default function Propietarios() {
  const { propietarios, caballerizas, searchPropietarios, searchCaballerizas, deletePropietario, deleteCaballeriza } =
    useStore()
  const { toast } = useToast()

  const [searchQuery, setSearchQuery] = useState("")
  const [isPropietarioDialogOpen, setIsPropietarioDialogOpen] = useState(false)
  const [isCaballerizaDialogOpen, setIsCaballerizaDialogOpen] = useState(false)
  const [editingPropietario, setEditingPropietario] = useState<string | null>(null)
  const [editingCaballeriza, setEditingCaballeriza] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("propietarios")

  // Filtrar propietarios según la búsqueda
  const filteredPropietarios = searchQuery
    ? searchPropietarios(searchQuery)
    : [...propietarios].sort((a, b) => a.nombre.localeCompare(b.nombre))

  // Filtrar caballerizas según la búsqueda
  const filteredCaballerizas = searchQuery
    ? searchCaballerizas(searchQuery)
    : [...caballerizas].sort((a, b) => a.nombre.localeCompare(b.nombre))

  // Eliminar propietario
  const handleDeletePropietario = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este propietario?")) {
      deletePropietario(id)
      toast({
        title: "Propietario eliminado",
        description: "El propietario ha sido eliminado correctamente",
      })
    }
  }

  // Eliminar caballeriza
  const handleDeleteCaballeriza = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta caballeriza?")) {
      deleteCaballeriza(id)
      toast({
        title: "Caballeriza eliminada",
        description: "La caballeriza ha sido eliminada correctamente",
      })
    }
  }

  // Editar propietario
  const handleEditPropietario = (id: string) => {
    setEditingPropietario(id)
    setIsPropietarioDialogOpen(true)
  }

  // Editar caballeriza
  const handleEditCaballeriza = (id: string) => {
    setEditingCaballeriza(id)
    setIsCaballerizaDialogOpen(true)
  }

  // Cerrar diálogos y resetear estado
  const handlePropietarioDialogClose = () => {
    setIsPropietarioDialogOpen(false)
    setEditingPropietario(null)
  }

  const handleCaballerizaDialogClose = () => {
    setIsCaballerizaDialogOpen(false)
    setEditingCaballeriza(null)
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Propietarios y Caballerizas</h1>
          <p className="text-muted-foreground">Gestiona los propietarios de los caballos y las caballerizas</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={activeTab === "propietarios" ? "Buscar propietario..." : "Buscar caballeriza..."}
              className="pl-8 w-full sm:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {activeTab === "propietarios" ? (
            <Dialog open={isPropietarioDialogOpen} onOpenChange={handlePropietarioDialogClose}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsPropietarioDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Nuevo Propietario
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{editingPropietario ? "Editar Propietario" : "Registrar Nuevo Propietario"}</DialogTitle>
                </DialogHeader>
                <PropietarioForm
                  propietario={editingPropietario ? propietarios.find((p) => p.id === editingPropietario) : undefined}
                  onSuccess={handlePropietarioDialogClose}
                />
              </DialogContent>
            </Dialog>
          ) : (
            <Dialog open={isCaballerizaDialogOpen} onOpenChange={handleCaballerizaDialogClose}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsCaballerizaDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Nueva Caballeriza
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{editingCaballeriza ? "Editar Caballeriza" : "Registrar Nueva Caballeriza"}</DialogTitle>
                </DialogHeader>
                <CaballerizaForm
                  caballeriza={editingCaballeriza ? caballerizas.find((c) => c.id === editingCaballeriza) : undefined}
                  onSuccess={handleCaballerizaDialogClose}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <Tabs defaultValue="propietarios" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="propietarios">
            <User className="h-4 w-4 mr-2" /> Propietarios
          </TabsTrigger>
          <TabsTrigger value="caballerizas">
            <Building className="h-4 w-4 mr-2" /> Caballerizas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="propietarios">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2 text-primary" />
                Propietarios Registrados
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredPropietarios.length > 0 ? (
                <div className="space-y-4">
                  {filteredPropietarios.map((propietario) => (
                    <div
                      key={propietario.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{propietario.nombre}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Phone className="h-3 w-3 mr-1" /> {propietario.telefono}
                            </span>
                            <span className="flex items-center">
                              <Mail className="h-3 w-3 mr-1" /> {propietario.email}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditPropietario(propietario.id)}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500"
                          onClick={() => handleDeletePropietario(propietario.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <User className="h-10 w-10 text-muted-foreground mb-2" />
                  <h3 className="font-medium mb-1">No se encontraron propietarios</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {searchQuery ? "Intenta con otra búsqueda" : "Registra un nuevo propietario para comenzar"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="caballerizas">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2 text-primary" />
                Caballerizas Registradas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredCaballerizas.length > 0 ? (
                <div className="space-y-4">
                  {filteredCaballerizas.map((caballeriza) => (
                    <div
                      key={caballeriza.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Building className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{caballeriza.nombre}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" /> {caballeriza.direccion}
                            </span>
                            {caballeriza.telefono && (
                              <span className="flex items-center">
                                <Phone className="h-3 w-3 mr-1" /> {caballeriza.telefono}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditCaballeriza(caballeriza.id)}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500"
                          onClick={() => handleDeleteCaballeriza(caballeriza.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Building className="h-10 w-10 text-muted-foreground mb-2" />
                  <h3 className="font-medium mb-1">No se encontraron caballerizas</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {searchQuery ? "Intenta con otra búsqueda" : "Registra una nueva caballeriza para comenzar"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
