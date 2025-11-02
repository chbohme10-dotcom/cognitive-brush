import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AssetMetadata {
  id: string;
  name: string;
  url: string;
  category: 'character' | 'portrait' | 'landscape' | 'automotive' | 'texture' | 'medical' | 'product' | 'other';
  complexity: 'low' | 'medium' | 'high' | 'very_high';
  recommendedTool?: string;
  imageHint: string[];
  description?: string;
  contextual_previews?: {
    [key: string]: string | { [subKey: string]: string };
  };
  created_at: string;
}

export const useAssets = () => {
  const [assets, setAssets] = useState<AssetMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Load assets from database
  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setAssets(data.map(asset => ({
          id: asset.id,
          name: asset.name,
          url: asset.url,
          category: asset.category as any,
          complexity: asset.complexity as any,
          imageHint: asset.image_hint || [],
          description: asset.description,
          contextual_previews: asset.contextual_previews,
          created_at: asset.created_at,
        })));
      }
    } catch (error) {
      console.error('Error loading assets:', error);
      toast.error('Failed to load assets');
    } finally {
      setIsLoading(false);
    }
  };

  const uploadAsset = async (file: File, options: { addToCanvas?: boolean; addToLayer?: boolean } = {}) => {
    setIsLoading(true);
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const storagePath = `user-uploads/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(storagePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(storagePath);

      // Save to database
      const { data: session } = await supabase.auth.getSession();
      const { data: assetData, error: dbError } = await supabase
        .from('assets')
        .insert({
          name: file.name,
          storage_path: storagePath,
          url: publicUrl,
          category: 'other',
          complexity: 'medium',
          image_hint: ['uploaded', 'new'],
          user_id: session?.session?.user.id,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      const newAsset: AssetMetadata = {
        id: assetData.id,
        name: assetData.name,
        url: assetData.url,
        category: assetData.category as any,
        complexity: assetData.complexity as any,
        imageHint: assetData.image_hint || [],
        created_at: assetData.created_at,
      };

      setAssets(prev => [newAsset, ...prev]);
      
      if (options.addToCanvas) {
        toast.success('Asset added to canvas as new layer');
      } else {
        toast.success('Asset uploaded to library');
      }
      
      return newAsset;
    } catch (error) {
      console.error('Error uploading asset:', error);
      toast.error('Failed to upload asset');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const searchAssets = (query: string) => {
    setSearchQuery(query);
  };

  const filterByCategory = (category: string) => {
    setSelectedCategory(category);
  };

  const findSimilar = async (assetId: string) => {
    toast.info('Finding similar assets...');
    // Placeholder for semantic search
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = searchQuery === '' || 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.imageHint.some(hint => hint.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return {
    assets: filteredAssets,
    isLoading,
    uploadAsset,
    searchAssets,
    filterByCategory,
    findSimilar,
    selectedCategory,
    searchQuery,
  };
};
