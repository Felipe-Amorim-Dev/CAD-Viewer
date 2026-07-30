import { BufferGeometry, Mesh, MeshStandardMaterial, Object3D } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { PLYLoader } from 'three/addons/loaders/PLYLoader.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { getFileExtension, type SupportedFileExtension } from './FileExtension';
import type { LoaderResult } from './LoaderResult';

export interface LoadingProgress {
    loaded: number;
    total: number;
    percentage: number | null;
}

export type LoadingProgressCallback = (
    progress: LoadingProgress
) => void;

export class CadModelLoader {
    private readonly gltfLoader = new GLTFLoader();

    private readonly stlLoader = new STLLoader();

    private readonly objLoader = new OBJLoader();

    private readonly plyLoader = new PLYLoader();

    public async loadFromUrl(
        url: string,
        onProgress?: LoadingProgressCallback): Promise<LoaderResult> {
        const extension = this.validateExtension(url);

        switch (extension) {
            case 'glb':
            case 'gltf':
                return this.loadGltfFromUrl(url, extension, onProgress);

            case 'stl':
                return this.loadStlFromUrl(url, onProgress);

            case 'obj':
                return this.loadObjFromUrl(url, onProgress);

            case 'ply':
                return this.loadPlyFromUrl(url, onProgress);

            default:
                return this.throwUnsupportedFormat(extension);
        }
    }

    public async loadFromFile(
        file: File,
        onProgress?: LoadingProgressCallback): Promise<LoaderResult> {
        const extension = this.validateExtension(file.name);

        onProgress?.({
            loaded: 0,
            total: file.size,
            percentage: 0
        });

        const arrayBuffer = await file.arrayBuffer();

        onProgress?.({
            loaded: file.size,
            total: file.size,
            percentage: 100
        });

        switch (extension) {
            case 'glb':
                return this.parseGlbFile(arrayBuffer, file.name);

            case 'gltf':
                return this.parseGltfFile(arrayBuffer, file.name);

            case 'stl':
                return this.parseStlFile(arrayBuffer, file.name);

            case 'obj':
                return this.parseObjFile(arrayBuffer, file.name);

            case 'ply':
                return this.parsePlyFile(arrayBuffer, file.name);

            default:
                return this.throwUnsupportedFormat(extension);
        }
    }

    private async loadGltfFromUrl(url: string, format: 'glb' | 'gltf', onProgress?: LoadingProgressCallback): Promise<LoaderResult> {
        const gltf = await this.gltfLoader.loadAsync(url,
            (event) => {
                this.notifyProgress(event, onProgress);
            }
        );

        return {
            object: gltf.scene,
            animations: gltf.animations,
            format,
            sourceName: this.extractNameFromUrl(url)
        };
    }

    private async loadStlFromUrl(url: string, onProgress?: LoadingProgressCallback): Promise<LoaderResult> {
        const geometry = await this.stlLoader.loadAsync(
            url,
            (event) => {
                this.notifyProgress(event, onProgress);
            }
        );

        return {
            object: this.createMeshFromGeometry(geometry),
            animations: [],
            format: 'stl',
            sourceName: this.extractNameFromUrl(url)
        };
    }

    private async loadObjFromUrl(url: string, onProgress?: LoadingProgressCallback): Promise<LoaderResult> {
        const object = await this.objLoader.loadAsync(
            url,
            (event) => {
                this.notifyProgress(event, onProgress);
            }
        );

        this.applyDefaultMaterialWhenNeeded(object);

        return {
            object,
            animations: [],
            format: 'obj',
            sourceName: this.extractNameFromUrl(url)
        };
    }

    private async loadPlyFromUrl(url: string, onProgress?: LoadingProgressCallback): Promise<LoaderResult> {
        const geometry = await this.plyLoader.loadAsync(
            url,
            (event) => {
                this.notifyProgress(event, onProgress);
            }
        );

        geometry.computeVertexNormals();

        return {
            object: this.createMeshFromGeometry(geometry, geometry.hasAttribute('color')),
            animations: [],
            format: 'ply',
            sourceName: this.extractNameFromUrl(url)
        };
    }

    private async parseGlbFile(arrayBuffer: ArrayBuffer, fileName: string): Promise<LoaderResult> {
        const gltf = await this.gltfLoader.parseAsync(arrayBuffer, '');

        return {
            object: gltf.scene,
            animations: gltf.animations,
            format: 'glb',
            sourceName: fileName
        };
    }

    private async parseGltfFile(arrayBuffer: ArrayBuffer, fileName: string): Promise<LoaderResult> {
        const text = new TextDecoder().decode(arrayBuffer);

        const gltf = await this.gltfLoader.parseAsync(text, '');

        return {
            object: gltf.scene,
            animations: gltf.animations,
            format: 'gltf',
            sourceName: fileName
        };
    }

    private parseStlFile(arrayBuffer: ArrayBuffer, fileName: string): LoaderResult {
        const geometry = this.stlLoader.parse(arrayBuffer);

        return {
            object: this.createMeshFromGeometry(geometry),
            animations: [],
            format: 'stl',
            sourceName: fileName
        };
    }

    private parseObjFile(arrayBuffer: ArrayBuffer, fileName: string): LoaderResult {
        const text = new TextDecoder().decode(arrayBuffer);
        const object = this.objLoader.parse(text);

        this.applyDefaultMaterialWhenNeeded(object);

        return {
            object,
            animations: [],
            format: 'obj',
            sourceName: fileName
        };
    }

    private parsePlyFile(arrayBuffer: ArrayBuffer, fileName: string): LoaderResult {
        const geometry = this.plyLoader.parse(arrayBuffer);

        geometry.computeVertexNormals();

        return {
            object: this.createMeshFromGeometry(geometry, geometry.hasAttribute('color')),
            animations: [],
            format: 'ply',
            sourceName: fileName
        };
    }

    private createMeshFromGeometry(geometry: BufferGeometry, useVertexColors = false): Mesh {
        geometry.computeBoundingBox();
        geometry.computeBoundingSphere();

        if (!geometry.hasAttribute('normal')) {
            geometry.computeVertexNormals();
        }

        const material = new MeshStandardMaterial({
            color: useVertexColors ? 0xffffff : 0xb8c0cc,
            vertexColors: useVertexColors,
            metalness: 0.08,
            roughness: 0.62
        });

        const mesh = new Mesh(geometry, material);

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        return mesh;
    }

    private applyDefaultMaterialWhenNeeded(object: Object3D): void {
        object.traverse((child) => {
            if (!(child instanceof Mesh)) {
                return;
            }

            child.castShadow = true;
            child.receiveShadow = true;

            if (!child.material) {
                child.material = new MeshStandardMaterial({
                    color: 0xb8c0cc,
                    metalness: 0.08,
                    roughness: 0.62
                });
            }
        });
    }

    private validateExtension(fileNameOrUrl: string): SupportedFileExtension {
        const extension = getFileExtension(fileNameOrUrl);

        if (!extension) {
            throw new Error('Formato não suportado. Use GLB, GLTF, STL, OBJ ou PLY.');
        }

        return extension;
    }

    private notifyProgress(event: ProgressEvent<EventTarget>, callback?: LoadingProgressCallback): void {
        if (!callback) {
            return;
        }

        const loaded = event.loaded;
        const total = event.lengthComputable ? event.total : 0;

        callback({
            loaded,
            total,
            percentage: total > 0 ? Math.round((loaded / total) * 100) : null
        });
    }

    private extractNameFromUrl(url: string): string {
        const cleanUrl = url.split('?')[0].split('#')[0];
        const parts = cleanUrl.split('/');

        return decodeURIComponent(parts.at(-1) || 'modelo-3d');
    }

    private throwUnsupportedFormat(format: never): never {
        throw new Error(`Formato não suportado: ${String(format)}`);
    }
}