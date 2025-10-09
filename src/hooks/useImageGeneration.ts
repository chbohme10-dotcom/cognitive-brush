import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const generateImage = async (prompt: string, width = 1024, height = 1024) => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt, width, height }
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        return null;
      }

      setGeneratedImage(data.imageUrl);
      toast.success('Image generated successfully!');
      return data.imageUrl;
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate image');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const editImage = async (imageUrl: string, prompt: string, mode = 'edit') => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('edit-image', {
        body: { imageUrl, prompt, mode }
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        return null;
      }

      setGeneratedImage(data.imageUrl);
      toast.success('Image edited successfully!');
      return data.imageUrl;
    } catch (error) {
      console.error('Error editing image:', error);
      toast.error('Failed to edit image');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generatedImage,
    setGeneratedImage,
    generateImage,
    editImage
  };
};
