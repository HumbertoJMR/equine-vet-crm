"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { User, Building, Users, LogOut, UserPlus, Edit, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { VeterinarioForm } from "@/components/forms/veterinario-form"

export default function PerfilPage() {
  const { user, logout, isAdmin } = useAuth()
  const { getClinica, getUsuariosByClinica, updateUsuario, veterinarios, deleteVeterinario } = useStore()
  const { toast } = useToast()

  const [isEditing, setIsEditing] = useState(false)
  const [isVeterinarioDialogOpen, setIsVeterinarioDialogOpen] = useState(false)
  const [editingVeterinario, setEditingVeterinario] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    nombre: user?.nombre || "",
    email: user?.email || "",
    telefono: user?.telefono || "",
    especialidad: user?.especialidad || "",
  })

  if (!user) {
    return null
  }

  const clinica = getClinica(user.clinicaId)
  const usuariosClinica = getUsuariosByClinica(user.clinicaId)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (user) {
      updateUsuario(user.id, {
        nombre: formData.nombre,
        telefono: formData.telefono,
        especialidad: formData.especialidad,
      })

      toast({
        title: "Perfil actualizado",
        description: "Tu información ha sido actualizada correctamente.",
      })

      setIsEditing(false)
    }
  }

  const handleEditVeterinario = (id: string) => {
    setEditingVeterinario(id)
    setIsVeterinarioDialogOpen(true)
  }

  const handleDeleteVeterinario = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este veterinario?")) {
      deleteVeterinario(id)
      toast({
        title: "Veterinario eliminado",
        description: "El veterinario ha sido eliminado correctamente",
      })
    }
  }

  const handleVeterinarioDialogClose = () => {
    setIsVeterinarioDialogOpen(false)
    setEditingVeterinario(null)
  }

  const getRolLabel = (rol: string) => {
    switch (rol) {
      case "admin":
        return "Administrador"
      case "veterinario":
        return "Veterinario"
      case "asistente":
        return "Asistente"
      default:
        return rol
    }
  }

  const getRolColor = (rol: string) => {
    switch (rol) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200"
      case "veterinario":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "asistente":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mi Perfil</h1>
          <p className="text-muted-foreground">Gestiona tu información personal y configuración</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button variant="outline" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
          </Button>
        </div>
      </div>

      <Tabs defaultValue="perfil">
        <TabsList className="mb-4">
          <TabsTrigger value="perfil">
            <User className="h-4 w-4 mr-2" /> Mi Perfil
          </TabsTrigger>
          <TabsTrigger value="clinica">
            <Building className="h-4 w-4 mr-2" /> Mi Clínica
          </TabsTrigger>
          <TabsTrigger value="veterinarios">
            <Users className="h-4 w-4 mr-2" /> Veterinarios
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="usuarios">
              <Users className="h-4 w-4 mr-2" /> Usuarios
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="perfil">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>Gestiona tu información de perfil</CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre</Label>
                      <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" value={formData.email} onChange={handleChange} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="especialidad">Especialidad</Label>
                      <Input
                        id="especialidad"
                        name="especialidad"
                        value={formData.especialidad}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit">Guardar Cambios</Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.nombre} />
                        <AvatarFallback className="text-lg">{user.nombre.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-medium">{user.nombre}</h3>
                        <p className="text-muted-foreground">{user.email}</p>
                        <Badge className={`mt-2 ${getRolColor(user.rol)}`}>{getRolLabel(user.rol)}</Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Teléfono:</span>
                        <span>{user.telefono || "No especificado"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Especialidad:</span>
                        <span>{user.especialidad || "No especificada"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Clínica:</span>
                        <span>{clinica?.nombre || "No asignada"}</span>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={() => setIsEditing(true)}>Editar Perfil</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configuración de Cuenta</CardTitle>
                <CardDescription>Gestiona la configuración de tu cuenta</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Cambiar Contraseña</h3>
                      <p className="text-sm text-muted-foreground">Actualiza tu contraseña de acceso</p>
                    </div>
                    <Button variant="outline">Cambiar</Button>
                  </div>

                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Notificaciones</h3>
                      <p className="text-sm text-muted-foreground">Configura tus preferencias de notificaciones</p>
                    </div>
                    <Button variant="outline">Configurar</Button>
                  </div>

                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Tema de la Aplicación</h3>
                      <p className="text-sm text-muted-foreground">Cambia entre tema claro y oscuro</p>
                    </div>
                    <Button variant="outline">Cambiar</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clinica">
          <Card>
            <CardHeader>
              <CardTitle>Información de la Clínica</CardTitle>
              <CardDescription>Detalles de la clínica a la que perteneces</CardDescription>
            </CardHeader>
            <CardContent>
              {clinica ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <Building className="h-10 w-10 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium">{clinica.nombre}</h3>
                      <p className="text-muted-foreground">{clinica.email}</p>
                      {clinica.rif && <p className="text-sm">RIF: {clinica.rif}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Contacto</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Teléfono:</span>
                          <span>{clinica.telefono}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Email:</span>
                          <span>{clinica.email}</span>
                        </div>
                        {clinica.instagram && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Instagram:</span>
                            <span>@{clinica.instagram}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Ubicación</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Dirección:</span>
                          <span>{clinica.direccion}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="flex justify-end">
                      <Button>Editar Información de Clínica</Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Building className="h-10 w-10 text-muted-foreground mb-2" />
                  <h3 className="font-medium mb-1">No estás asignado a ninguna clínica</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Contacta al administrador para que te asigne a una clínica
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="veterinarios">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Veterinarios</CardTitle>
                <CardDescription>Gestiona los veterinarios disponibles en el sistema</CardDescription>
              </div>
              <Dialog open={isVeterinarioDialogOpen} onOpenChange={handleVeterinarioDialogClose}>
                <DialogTrigger asChild>
                  <Button onClick={() => setIsVeterinarioDialogOpen(true)}>
                    <UserPlus className="mr-2 h-4 w-4" /> Nuevo Veterinario
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingVeterinario ? "Editar Veterinario" : "Registrar Nuevo Veterinario"}
                    </DialogTitle>
                  </DialogHeader>
                  <VeterinarioForm
                    veterinario={editingVeterinario ? veterinarios.find((v) => v.id === editingVeterinario) : undefined}
                    onSuccess={handleVeterinarioDialogClose}
                  />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {veterinarios.length > 0 ? (
                  veterinarios.map((veterinario) => (
                    <div
                      key={veterinario.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{veterinario.nombre.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{veterinario.nombre}</h3>
                          <p className="text-sm text-muted-foreground">
                            {veterinario.especialidad || "Sin especialidad"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEditVeterinario(veterinario.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500"
                          onClick={() => handleDeleteVeterinario(veterinario.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Users className="h-10 w-10 text-muted-foreground mb-2" />
                    <h3 className="font-medium mb-1">No hay veterinarios registrados</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Agrega veterinarios para poder asignarlos a las historias clínicas
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="usuarios">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Usuarios de la Clínica</CardTitle>
                  <CardDescription>Gestiona los usuarios de tu clínica</CardDescription>
                </div>
                <Button>
                  <Users className="mr-2 h-4 w-4" /> Agregar Usuario
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {usuariosClinica.length > 0 ? (
                    usuariosClinica.map((usuario) => (
                      <div key={usuario.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarFallback>{usuario.nombre.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{usuario.nombre}</h3>
                            <p className="text-sm text-muted-foreground">{usuario.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge className={getRolColor(usuario.rol)}>{getRolLabel(usuario.rol)}</Badge>
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Users className="h-10 w-10 text-muted-foreground mb-2" />
                      <h3 className="font-medium mb-1">No hay usuarios en esta clínica</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Agrega usuarios para que puedan acceder al sistema
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
