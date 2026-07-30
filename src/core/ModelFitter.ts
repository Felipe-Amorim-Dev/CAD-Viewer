import { Box3, Object3D, PerspectiveCamera, Sphere, Vector3 } from 'three';

import type { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export interface ModelBounds { box: Box3; sphere: Sphere; center: Vector3; size: Vector3; }

export function calculateModelBounds(
    object: Object3D
): ModelBounds {
    object.updateMatrixWorld(true);

    const box = new Box3().setFromObject(object);

    if (box.isEmpty()) {
        throw new Error('Não foi possível calcular os limites do modelo.');
    }

    const center = box.getCenter(new Vector3());
    const size = box.getSize(new Vector3());
    const sphere = box.getBoundingSphere(new Sphere());

    return { box, sphere, center, size };
}

export function centerObjectAtOrigin(object: Object3D): ModelBounds {
    const bounds = calculateModelBounds(object);

    object.position.sub(bounds.center);
    object.updateMatrixWorld(true);

    return calculateModelBounds(object);
}

export function fitCameraToObject(
    camera: PerspectiveCamera,
    controls: OrbitControls,
    object: Object3D,
    padding = 1.35
): void {
    const bounds = calculateModelBounds(object);
    const radius = Math.max(bounds.sphere.radius, 0.001);

    const verticalFieldOfView = (camera.fov * Math.PI) / 180;

    const distance = (radius / Math.sin(verticalFieldOfView / 2)) * padding;

    const direction = new Vector3(1, 0.75, 1)
        .normalize();

    camera.position.copy(direction.multiplyScalar(distance));

    camera.near = Math.max(distance / 1000, 0.001);
    camera.far = Math.max(distance * 100, 1000);
    camera.updateProjectionMatrix();

    controls.target.set(0, 0, 0);
    controls.minDistance = Math.max(radius * 0.02, 0.001);
    controls.maxDistance = Math.max(radius * 50, 100);
    controls.update();
}