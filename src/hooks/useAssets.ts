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

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedAssets: AssetMetadata[] = (data || []).map(asset => ({
        id: asset.id,
        name: asset.name,
        url: asset.url,
        category: asset.category as any,
        complexity: asset.complexity as any,
        recommendedTool: undefined,
        imageHint: asset.image_hint || [],
        description: asset.description || undefined,
        contextual_previews: (asset.contextual_previews as any) || undefined,
        created_at: asset.created_at,
      }));

      setAssets(formattedAssets);
    } catch (error) {
      console.error('Error fetching assets:', error);
      toast.error('Failed to load assets');
    } finally {
      setIsLoading(false);
    }
  };

  const uploadAsset = async (file: File, options: { addToCanvas?: boolean; addToLayer?: boolean } = {}) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to upload assets');
        return null;
      }

      const fileName = `${user.id}/${Date.now()}-${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(fileName);

      const { data: assetData, error: dbError } = await supabase
        .from('assets')
        .insert({
          user_id: user.id,
          name: file.name,
          storage_path: fileName,
          url: publicUrl,
          category: 'other',
          complexity: 'medium',
          image_hint: ['uploaded', 'new'],
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
