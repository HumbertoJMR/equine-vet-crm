-- Enable Row Level Security
ALTER TABLE IF EXISTS public.clinicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.caballos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.propietarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.caballerizas ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.historias_clinicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.citas ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.facturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.inventario ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.veterinarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.servicios ENABLE ROW LEVEL SECURITY;

-- Create tables
CREATE TABLE IF NOT EXISTS public.clinicas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    direccion TEXT NOT NULL,
    telefono TEXT NOT NULL,
    email TEXT NOT NULL,
    logo TEXT,
    instagram TEXT,
    rif TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.usuarios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    rol TEXT NOT NULL DEFAULT 'user',
    clinica_id UUID REFERENCES public.clinicas(id) ON DELETE CASCADE,
    activo BOOLEAN DEFAULT true,
    telefono TEXT,
    especialidad TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.propietarios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    email TEXT,
    telefono TEXT,
    direccion TEXT,
    clinica_id UUID REFERENCES public.clinicas(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.caballerizas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    direccion TEXT,
    capacidad INTEGER,
    clinica_id UUID REFERENCES public.clinicas(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.caballos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    raza TEXT,
    edad INTEGER,
    sexo TEXT,
    color TEXT,
    numero_chip TEXT,
    propietario_id UUID REFERENCES public.propietarios(id) ON DELETE CASCADE,
    caballeriza_id UUID REFERENCES public.caballerizas(id) ON DELETE SET NULL,
    ultima_revision TIMESTAMP WITH TIME ZONE,
    clinica_id UUID REFERENCES public.clinicas(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.veterinarios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    especialidad TEXT,
    telefono TEXT,
    email TEXT,
    clinica_id UUID REFERENCES public.clinicas(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.servicios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    categoria TEXT,
    clinica_id UUID REFERENCES public.clinicas(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.historias_clinicas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    caballo_id UUID REFERENCES public.caballos(id) ON DELETE CASCADE,
    veterinario_id UUID REFERENCES public.veterinarios(id) ON DELETE SET NULL,
    fecha TIMESTAMP WITH TIME ZONE NOT NULL,
    diagnostico TEXT,
    tratamiento TEXT,
    observaciones TEXT,
    clinica_id UUID REFERENCES public.clinicas(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.citas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    caballo_id UUID REFERENCES public.caballos(id) ON DELETE CASCADE,
    veterinario_id UUID REFERENCES public.veterinarios(id) ON DELETE SET NULL,
    servicio_id UUID REFERENCES public.servicios(id) ON DELETE SET NULL,
    fecha TIMESTAMP WITH TIME ZONE NOT NULL,
    estado TEXT NOT NULL DEFAULT 'pendiente',
    notas TEXT,
    clinica_id UUID REFERENCES public.clinicas(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.facturas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    numero TEXT NOT NULL,
    fecha TIMESTAMP WITH TIME ZONE NOT NULL,
    propietario_id UUID REFERENCES public.propietarios(id) ON DELETE CASCADE,
    total DECIMAL(10,2) NOT NULL,
    estado TEXT NOT NULL DEFAULT 'pendiente',
    metodo_pago TEXT,
    notas TEXT,
    clinica_id UUID REFERENCES public.clinicas(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.inventario (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    cantidad INTEGER NOT NULL,
    unidad TEXT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    categoria TEXT,
    clinica_id UUID REFERENCES public.clinicas(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.eventos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    fecha_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    fecha_fin TIMESTAMP WITH TIME ZONE,
    tipo TEXT NOT NULL,
    caballo_id UUID REFERENCES public.caballos(id) ON DELETE CASCADE,
    veterinario_id UUID REFERENCES public.veterinarios(id) ON DELETE SET NULL,
    clinica_id UUID REFERENCES public.clinicas(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create RLS policies
CREATE POLICY "Enable read access for all authenticated users" ON public.clinicas
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all authenticated users" ON public.usuarios
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all authenticated users" ON public.propietarios
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all authenticated users" ON public.caballerizas
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all authenticated users" ON public.caballos
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all authenticated users" ON public.veterinarios
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all authenticated users" ON public.servicios
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all authenticated users" ON public.historias_clinicas
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all authenticated users" ON public.citas
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all authenticated users" ON public.facturas
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all authenticated users" ON public.inventario
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all authenticated users" ON public.eventos
    FOR SELECT USING (auth.role() = 'authenticated');

-- Enable insert, update, delete for all authenticated users
CREATE POLICY "Enable insert for all authenticated users" ON public.clinicas
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for all authenticated users" ON public.clinicas
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for all authenticated users" ON public.clinicas
    FOR DELETE USING (auth.role() = 'authenticated');

-- Repeat for all other tables... 