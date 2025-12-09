import { useState, useCallback, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { toast } from 'sonner';

export interface MixamoAnimation {
  name: string;
  clip: THREE.AnimationClip;
  duration: number;
}

export interface MixamoAnimationState {
  isLoading: boolean;
  animations: MixamoAnimation[];
  currentAnimation: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

export function useMixamoAnimation(targetSkeleton?: THREE.Object3D) {
  const [state, setState] = useState<MixamoAnimationState>({
    isLoading: false,
    animations: [],
    currentAnimation: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
  });

  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const currentActionRef = useRef<THREE.AnimationAction | null>(null);
  const clockRef = useRef(new THREE.Clock());

  // Update mixer when target changes
  useEffect(() => {
    if (targetSkeleton) {
      mixerRef.current = new THREE.AnimationMixer(targetSkeleton);
    }
    return () => {
      mixerRef.current?.stopAllAction();
      mixerRef.current = null;
    };
  }, [targetSkeleton]);

  // Load FBX animation file
  const loadAnimation = useCallback(async (file: File): Promise<MixamoAnimation | null> => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const loader = new FBXLoader();
      const arrayBuffer = await file.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);

      return new Promise((resolve, reject) => {
        loader.load(
          url,
          (fbx) => {
            const clip = fbx.animations[0];
            
            if (!clip) {
              toast.error('No animation found in FBX file');
              reject(new Error('No animation in file'));
              return;
            }

            // Rename tracks for VRM compatibility (Mixamo to VRM bone mapping)
            const renamedClip = retargetMixamoToVRM(clip);

            const animation: MixamoAnimation = {
              name: file.name.replace('.fbx', ''),
              clip: renamedClip,
              duration: renamedClip.duration,
            };

            setState(prev => ({
              ...prev,
              isLoading: false,
              animations: [...prev.animations, animation],
            }));

            URL.revokeObjectURL(url);
            toast.success(`Loaded animation: ${animation.name}`);
            resolve(animation);
          },
          undefined,
          (err) => {
            console.error('FBX load error:', err);
            setState(prev => ({ ...prev, isLoading: false }));
            URL.revokeObjectURL(url);
            toast.error('Failed to load FBX animation');
            reject(err);
          }
        );
      });
    } catch (err) {
      console.error('Animation loader error:', err);
      setState(prev => ({ ...prev, isLoading: false }));
      toast.error('Failed to process animation file');
      return null;
    }
  }, []);

  // Retarget Mixamo bone names to VRM humanoid bone names
  const retargetMixamoToVRM = (clip: THREE.AnimationClip): THREE.AnimationClip => {
    const mixamoToVRM: Record<string, string> = {
      'mixamorigHips': 'hips',
      'mixamorigSpine': 'spine',
      'mixamorigSpine1': 'chest',
      'mixamorigSpine2': 'upperChest',
      'mixamorigNeck': 'neck',
      'mixamorigHead': 'head',
      'mixamorigLeftShoulder': 'leftShoulder',
      'mixamorigLeftArm': 'leftUpperArm',
      'mixamorigLeftForeArm': 'leftLowerArm',
      'mixamorigLeftHand': 'leftHand',
      'mixamorigRightShoulder': 'rightShoulder',
      'mixamorigRightArm': 'rightUpperArm',
      'mixamorigRightForeArm': 'rightLowerArm',
      'mixamorigRightHand': 'rightHand',
      'mixamorigLeftUpLeg': 'leftUpperLeg',
      'mixamorigLeftLeg': 'leftLowerLeg',
      'mixamorigLeftFoot': 'leftFoot',
      'mixamorigLeftToeBase': 'leftToes',
      'mixamorigRightUpLeg': 'rightUpperLeg',
      'mixamorigRightLeg': 'rightLowerLeg',
      'mixamorigRightFoot': 'rightFoot',
      'mixamorigRightToeBase': 'rightToes',
      // Finger mappings
      'mixamorigLeftHandThumb1': 'leftThumbProximal',
      'mixamorigLeftHandThumb2': 'leftThumbIntermediate',
      'mixamorigLeftHandThumb3': 'leftThumbDistal',
      'mixamorigLeftHandIndex1': 'leftIndexProximal',
      'mixamorigLeftHandIndex2': 'leftIndexIntermediate',
      'mixamorigLeftHandIndex3': 'leftIndexDistal',
      'mixamorigLeftHandMiddle1': 'leftMiddleProximal',
      'mixamorigLeftHandMiddle2': 'leftMiddleIntermediate',
      'mixamorigLeftHandMiddle3': 'leftMiddleDistal',
      'mixamorigLeftHandRing1': 'leftRingProximal',
      'mixamorigLeftHandRing2': 'leftRingIntermediate',
      'mixamorigLeftHandRing3': 'leftRingDistal',
      'mixamorigLeftHandPinky1': 'leftLittleProximal',
      'mixamorigLeftHandPinky2': 'leftLittleIntermediate',
      'mixamorigLeftHandPinky3': 'leftLittleDistal',
      'mixamorigRightHandThumb1': 'rightThumbProximal',
      'mixamorigRightHandThumb2': 'rightThumbIntermediate',
      'mixamorigRightHandThumb3': 'rightThumbDistal',
      'mixamorigRightHandIndex1': 'rightIndexProximal',
      'mixamorigRightHandIndex2': 'rightIndexIntermediate',
      'mixamorigRightHandIndex3': 'rightIndexDistal',
      'mixamorigRightHandMiddle1': 'rightMiddleProximal',
      'mixamorigRightHandMiddle2': 'rightMiddleIntermediate',
      'mixamorigRightHandMiddle3': 'rightMiddleDistal',
      'mixamorigRightHandRing1': 'rightRingProximal',
      'mixamorigRightHandRing2': 'rightRingIntermediate',
      'mixamorigRightHandRing3': 'rightRingDistal',
      'mixamorigRightHandPinky1': 'rightLittleProximal',
      'mixamorigRightHandPinky2': 'rightLittleIntermediate',
      'mixamorigRightHandPinky3': 'rightLittleDistal',
    };

    const tracks = clip.tracks.map(track => {
      const splitName = track.name.split('.');
      const boneName = splitName[0];
      const property = splitName.slice(1).join('.');
      
      const vrmBoneName = mixamoToVRM[boneName] || boneName;
      
      return new THREE.KeyframeTrack(
        `${vrmBoneName}.${property}`,
        track.times,
        track.values
      );
    });

    return new THREE.AnimationClip(clip.name, clip.duration, tracks);
  };

  // Play animation
  const playAnimation = useCallback((animationName: string) => {
    if (!mixerRef.current) {
      toast.error('No skeleton to animate');
      return;
    }

    const animation = state.animations.find(a => a.name === animationName);
    if (!animation) {
      toast.error('Animation not found');
      return;
    }

    // Stop current animation
    if (currentActionRef.current) {
      currentActionRef.current.stop();
    }

    // Create and play new action
    const action = mixerRef.current.clipAction(animation.clip);
    action.reset();
    action.play();
    currentActionRef.current = action;
    clockRef.current.start();

    setState(prev => ({
      ...prev,
      currentAnimation: animationName,
      isPlaying: true,
      duration: animation.duration,
      currentTime: 0,
    }));
  }, [state.animations]);

  // Pause/resume
  const togglePlayback = useCallback(() => {
    if (!currentActionRef.current) return;

    if (state.isPlaying) {
      currentActionRef.current.paused = true;
    } else {
      currentActionRef.current.paused = false;
    }

    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, [state.isPlaying]);

  // Stop animation
  const stopAnimation = useCallback(() => {
    if (currentActionRef.current) {
      currentActionRef.current.stop();
      currentActionRef.current = null;
    }

    setState(prev => ({
      ...prev,
      currentAnimation: null,
      isPlaying: false,
      currentTime: 0,
    }));
  }, []);

  // Seek to time
  const seekTo = useCallback((time: number) => {
    if (!currentActionRef.current) return;
    
    currentActionRef.current.time = time;
    setState(prev => ({ ...prev, currentTime: time }));
  }, []);

  // Update loop (call this in animation frame)
  const update = useCallback((deltaTime: number) => {
    if (mixerRef.current && state.isPlaying) {
      mixerRef.current.update(deltaTime);
      
      if (currentActionRef.current) {
        setState(prev => ({
          ...prev,
          currentTime: currentActionRef.current?.time || 0,
        }));
      }
    }
  }, [state.isPlaying]);

  // Remove animation
  const removeAnimation = useCallback((animationName: string) => {
    if (state.currentAnimation === animationName) {
      stopAnimation();
    }
    
    setState(prev => ({
      ...prev,
      animations: prev.animations.filter(a => a.name !== animationName),
    }));
  }, [state.currentAnimation, stopAnimation]);

  return {
    ...state,
    loadAnimation,
    playAnimation,
    togglePlayback,
    stopAnimation,
    seekTo,
    update,
    removeAnimation,
  };
}
