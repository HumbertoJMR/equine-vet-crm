"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react"

export default function CheckSupabasePage() {
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkSupabase = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/check-supabase")
      const data = await response.json()
      setStatus(data)
    } catch (err) {
      setError("Error al verificar la conexión con Supabase")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkSupabase()
  }, [])

  return (
    <div className="container py-10">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Verificación de Supabase</CardTitle>
          <CardDescription>Comprueba que la integración con Supabase esté funcionando correctamente</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-6">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Verificando conexión...</span>
            </div>
          ) : error ? (
            <div className="bg-destructive/10 p-4 rounded-md text-destructive">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>{error}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center">
                {status?.success ? (
                  <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500 mr-2" />
                )}
                <span className="text-lg font-medium">
                  {status?.success ? "Conexión exitosa" : "Error de conexión"}
                </span>
              </div>

              {status?.message && (
                <div className="bg-muted p-4 rounded-md">
                  <p>{status.message}</p>
                  {status?.error && <p className="text-destructive mt-2">{status.error}</p>}
                </div>
              )}

              {status?.tables && (
                <div>
                  <h3 className="text-lg font-medium mb-3">Estado de las tablas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(status.tables).map(([table, result]: [string, any]) => (
                      <div key={table} className="flex items-center border p-3 rounded-md">
                        {result.exists ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                        )}
                        <div>
                          <span className="font-medium">{table}</span>
                          {result.error && <p className="text-xs text-destructive mt-1">{result.error}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {status?.auth && (
                <div>
                  <h3 className="text-lg font-medium mb-3">Autenticación</h3>
                  <div className="flex items-center border p-3 rounded-md">
                    {status.auth.working ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mr-2" />
                    )}
                    <span>{status.auth.working ? "Autenticación funcionando" : "Problema con la autenticación"}</span>
                  </div>
                  {status.auth.error && (
                    <div className="bg-destructive/10 p-3 rounded-md mt-2 text-sm text-destructive">
                      {status.auth.error}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={checkSupabase} disabled={loading}>
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Verificar de nuevo
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
