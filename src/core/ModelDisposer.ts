import { Material, Mesh, Object3D, Texture } from 'three';

function disposeTextureProperty(value: unknown): void {
    if (value instanceof Texture) {
        value.dispose();
    }
}

function disposeMaterial(material: Material): void {
    const materialRecord = material as unknown as Record<string, unknown>;

    for (const value of Object.values(materialRecord)) {
        disposeTextureProperty(value);
    }

    material.dispose();
}

export function disposeObject3D(object: Object3D): void {
    object.traverse((child) => {
        if (!(child instanceof Mesh)) {
            return;
        }

        child.geometry?.dispose();

        const material = child.material;

        if (Array.isArray(material)) {
            for (const currentMaterial of material) {
                disposeMaterial(currentMaterial);
            }

            return;
        }

        if (material) {
            disposeMaterial(material);
        }
    });

    object.removeFromParent();
}