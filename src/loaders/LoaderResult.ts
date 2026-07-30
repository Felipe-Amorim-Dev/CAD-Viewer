import type { AnimationClip, Object3D } from 'three';
import type { SupportedFileExtension } from './FileExtension';

export interface LoaderResult {
    object: Object3D;
    animations: AnimationClip[];
    format: SupportedFileExtension;
    sourceName: string;
}