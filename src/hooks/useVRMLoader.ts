import { useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { VRMLoaderPlugin, VRM } from '@pixiv/three-vrm';
import { toast } from 'sonner';

export interface LoadedVRM {
  vrm: VRM;
  scene: THREE.Group;
  blendShapes: string[];
  bones: string[];
}

export function useVRMLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadedVRM, setLoadedVRM] = useState<LoadedVRM | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadVRM = useCallback(async (file: File): Promise<LoadedVRM | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const loader = new GLTFLoader();
      loader.register((parser) => new VRMLoaderPlugin(parser));

      const arrayBuffer = await file.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);

      return new Promise((resolve, reject) => {
        loader.load(
          url,
          (gltf) => {
            const vrm = gltf.userData.vrm as VRM;
            
            if (!vrm) {
              reject(new Error('Not a valid VRM file'));
              return;
            }

            // Rotate model to face camera
            vrm.scene.rotation.y = Math.PI;

            // Extract blend shape names
            const blendShapes: string[] = [];
            if (vrm.expressionManager) {
              const expressionNames = vrm.expressionManager.expressionMap;
              if (expressionNames) {
                Object.keys(expressionNames).forEach((name) => {
                  blendShapes.push(name);
                });
              }
            }
              });
            }

            // Extract bone names
            const bones: string[] = [];
            if (vrm.humanoid) {
              const humanBones = vrm.humanoid.humanBones;
              Object.keys(humanBones).forEach((boneName) => {
                bones.push(boneName);
              });
            }

            const result: LoadedVRM = {
              vrm,
              scene: vrm.scene,
              blendShapes,
              bones,
            };

            setLoadedVRM(result);
            setIsLoading(false);
            URL.revokeObjectURL(url);
            toast.success(`Loaded VRM: ${file.name}`);
            resolve(result);
          },
          (progress) => {
            console.log('Loading VRM:', (progress.loaded / progress.total) * 100, '%');
          },
          (err) => {
            console.error('VRM load error:', err);
            setError('Failed to load VRM file');
            setIsLoading(false);
            URL.revokeObjectURL(url);
            toast.error('Failed to load VRM file');
            reject(err);
          }
        );
      });
    } catch (err) {
      console.error('VRM loader error:', err);
      setError('Failed to process VRM file');
      setIsLoading(false);
      toast.error('Failed to process VRM file');
      return null;
    }
  }, []);

  const applyExpression = useCallback((expressionName: string, value: number) => {
    if (!loadedVRM?.vrm.expressionManager) return;
    
    loadedVRM.vrm.expressionManager.setValue(expressionName, value);
  }, [loadedVRM]);

  const resetExpressions = useCallback(() => {
    if (!loadedVRM?.vrm.expressionManager) return;
    
    loadedVRM.vrm.expressionManager.resetValues();
  }, [loadedVRM]);

  const clearVRM = useCallback(() => {
    setLoadedVRM(null);
    setError(null);
  }, []);

  return {
    isLoading,
    loadedVRM,
    error,
    loadVRM,
    applyExpression,
    resetExpressions,
    clearVRM,
  };
}
