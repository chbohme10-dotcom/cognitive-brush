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

  const uploadAsset = async (file: File, options: { addToCanvas?: boolean; addToLayer?: boolean } = {}) => {
    setIsLoading(true);
    try {
      // Upload to storage (placeholder - requires storage bucket setup)
      const fileName = `${Date.now()}-${file.name}`;
      const fileExt = file.name.split('.').pop();
      
      // Create object URL for immediate use
      const objectUrl = URL.createObjectURL(file);
      
      // AI auto-tagging simulation (would call edge function in production)
      const newAsset: AssetMetadata = {
        id: fileName,
        name: file.name,
        url: objectUrl,
        category: 'other',
        complexity: 'medium',
        imageHint: ['uploaded', 'new'],
        created_at: new Date().toISOString(),
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
