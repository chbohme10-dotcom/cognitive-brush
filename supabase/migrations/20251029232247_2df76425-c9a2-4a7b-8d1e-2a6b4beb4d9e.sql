-- Create storage bucket for assets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'assets',
  'assets',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Create storage policies for assets bucket
CREATE POLICY "Anyone can view assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'assets');

CREATE POLICY "Authenticated users can upload assets"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'assets' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own assets"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'assets' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own assets"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'assets' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create storage bucket for project files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'projects',
  'projects',
  false,
  52428800, -- 50MB
  ARRAY['application/json', 'image/jpeg', 'image/png', 'image/webp']
);

-- Create storage policies for projects bucket
CREATE POLICY "Users can view their own projects"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'projects' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can upload their own projects"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'projects' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own projects"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'projects' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own projects"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'projects' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create assets metadata table
CREATE TABLE IF NOT EXISTS public.assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'other',
  complexity TEXT NOT NULL DEFAULT 'medium',
  image_hint TEXT[] DEFAULT ARRAY[]::TEXT[],
  description TEXT,
  contextual_previews JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on assets table
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

-- Create policies for assets table
CREATE POLICY "Anyone can view assets"
ON public.assets FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert assets"
ON public.assets FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assets"
ON public.assets FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assets"
ON public.assets FOR DELETE
USING (auth.uid() = user_id);

-- Create projects metadata table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  thumbnail_url TEXT,
  canvas_data JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on projects table
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create policies for projects table
CREATE POLICY "Users can view their own projects"
ON public.projects FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects"
ON public.projects FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
ON public.projects FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
ON public.projects FOR DELETE
USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_assets_updated_at
BEFORE UPDATE ON public.assets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample assets
INSERT INTO public.assets (name, storage_path, url, category, complexity, image_hint, description) VALUES
  ('Portrait Sample 1', 'samples/portrait1.jpg', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb', 'portrait', 'medium', ARRAY['portrait', 'face', 'woman'], 'High quality portrait for editing'),
  ('Portrait Sample 2', 'samples/portrait2.jpg', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d', 'portrait', 'medium', ARRAY['portrait', 'face', 'man'], 'Professional portrait photography'),
  ('Landscape Sample 1', 'samples/landscape1.jpg', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', 'landscape', 'high', ARRAY['landscape', 'nature', 'mountains'], 'Mountain landscape scene'),
  ('Landscape Sample 2', 'samples/landscape2.jpg', 'https://images.unsplash.com/photo-1469474968028-56623f02e42e', 'landscape', 'high', ARRAY['landscape', 'nature', 'forest'], 'Forest landscape photography'),
  ('Character Art 1', 'samples/character1.jpg', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158', 'character', 'very_high', ARRAY['character', 'art', 'illustration'], 'Character design reference'),
  ('Automotive Sample 1', 'samples/auto1.jpg', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d', 'automotive', 'high', ARRAY['automotive', 'car', 'vehicle'], 'Sports car photography'),
  ('Product Sample 1', 'samples/product1.jpg', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30', 'product', 'medium', ARRAY['product', 'watch', 'luxury'], 'Product photography sample'),
  ('Texture Sample 1', 'samples/texture1.jpg', 'https://images.unsplash.com/photo-1553356084-58ef4a67b2a7', 'texture', 'low', ARRAY['texture', 'pattern', 'abstract'], 'Abstract texture pattern'),
  ('Medical Sample 1', 'samples/medical1.jpg', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d', 'medical', 'very_high', ARRAY['medical', 'scan', 'xray'], 'Medical imaging sample'),
  ('Portrait Sample 3', 'samples/portrait3.jpg', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2', 'portrait', 'medium', ARRAY['portrait', 'face', 'woman'], 'Natural light portrait')
ON CONFLICT DO NOTHING;