-- Create initial clinic
INSERT INTO public.clinicas (id, nombre, direccion, telefono, email)
VALUES (
  'c0a80121-7ac0-4e1c-9cd4-8b8446119355',
  'Equinmedical Group',
  'Caracas, Venezuela',
  '+58 123456789',
  'equinmedicalgroup@gmail.com'
) ON CONFLICT DO NOTHING;

-- Create initial user
INSERT INTO public.usuarios (
  nombre,
  email,
  rol,
  clinica_id,
  activo,
  telefono
)
VALUES (
  'Admin User',
  'equinmedicalgroup@gmail.com',
  'admin',
  'c0a80121-7ac0-4e1c-9cd4-8b8446119355',
  true,
  '+58 123456789'
) ON CONFLICT (email) DO NOTHING;

-- Enable row level security but allow public access to auth endpoints
ALTER TABLE auth.users SECURITY DEFINER; 