import { ACESFilmicToneMapping, AmbientLight, AxesHelper, Box3, Color, DirectionalLight, GridHelper, Object3D, PerspectiveCamera, Scene, SRGBColorSpace, Vector3, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { disposeObject3D } from './ModelDisposer';
import { centerObjectAtOrigin, fitCameraToObject } from './ModelFitter';

export type TransformMode = | 'translate' | 'rotate' | 'scale';
export type TransformSpace = | 'local' | 'world';

export interface CadSceneOptions {
    backgroundColor?: string;
    showGrid?: boolean;
    showAxes?: boolean;
}

export class CadScene {
    private readonly container: HTMLElement;
    private readonly scene: Scene;
    private readonly camera: PerspectiveCamera;
    private readonly renderer: WebGLRenderer;
    private readonly controls: OrbitControls;
    private readonly transformControls: TransformControls;
    private readonly transformHelper: Object3D;
    private readonly resizeObserver: ResizeObserver;
    private readonly gridHelper: GridHelper;
    private readonly axesHelper: AxesHelper;
    private currentModel: Object3D | null = null;
    private animationFrameId: number | null = null;
    private isDisposed = false;
    private transformEnabled = false;

    public constructor(
        container: HTMLElement,
        options: CadSceneOptions = {}
    ) {
        this.container = container;

        this.scene = new Scene();

        this.scene.background = new Color(options.backgroundColor ?? '#eef1f5');

        this.camera = new PerspectiveCamera(45, 1, 0.01, 100000);

        this.camera.position.set(5, 4, 5);

        this.renderer = new WebGLRenderer({
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance'
        });

        this.renderer.outputColorSpace = SRGBColorSpace;
        this.renderer.toneMapping = ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1;

        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        this.renderer.shadowMap.enabled = true;

        this.renderer.domElement.setAttribute('aria-label', 'Área de visualização do modelo 3D');

        this.renderer.domElement.setAttribute('role', 'img');

        this.container.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.08;
        this.controls.screenSpacePanning = true;
        this.controls.enablePan = true;
        this.controls.enableZoom = true;
        this.controls.enableRotate = true;

        this.transformControls = new TransformControls(this.camera, this.renderer.domElement);

        this.transformControls.setMode('rotate');
        this.transformControls.setSpace('local');

        this.transformHelper = this.transformControls.getHelper();

        this.transformHelper.visible = false;

        this.scene.add(this.transformHelper);

        this.transformControls.addEventListener('dragging-changed',
            (event) => {
                const draggingEvent = event as unknown as {
                    value: boolean;
                };
                this.controls.enabled = !draggingEvent.value;
            }
        );

        this.transformControls.addEventListener('objectChange', () => {
            this.dispatchTransformChange();
        }
        );

        this.configureLights();

        this.gridHelper = new GridHelper(20, 20, 0x6b7280, 0xcbd5e1);

        this.gridHelper.position.y = -0.001;

        this.gridHelper.visible = options.showGrid ?? true;

        this.scene.add(this.gridHelper);

        this.axesHelper = new AxesHelper(2);

        this.axesHelper.visible = options.showAxes ?? false;

        this.scene.add(this.axesHelper);

        this.resizeObserver = new ResizeObserver(() => {
            this.resize();
        });

        this.resizeObserver.observe(this.container);

        this.resize();
        this.startRenderLoop();
    }

    public setModel(model: Object3D): void {
        this.removeCurrentModel();

        this.currentModel = model;

        this.prepareModel(model);

        centerObjectAtOrigin(model);

        model.position.set(0, 0, 0);
        model.rotation.set(0, 0, 0);
        model.scale.set(1, 1, 1);

        this.scene.add(model);

        this.updateHelperScale();
        this.fitToModel();

        if (this.transformEnabled) {
            this.transformControls.attach(model);
            this.transformHelper.visible = true;
        }
    }

    public fitToModel(): void {
        if (!this.currentModel) {
            return;
        }

        fitCameraToObject(this.camera, this.controls, this.currentModel);
    }

    public resetView(): void {
        if (!this.currentModel) {
            this.camera.position.set(5, 4, 5);
            this.controls.target.set(0, 0, 0);
            this.controls.update();

            return;
        }

        this.fitToModel();
    }

    public resetModelTransform(): void {
        if (!this.currentModel) {
            return;
        }

        this.currentModel.position.set(0, 0, 0);
        this.currentModel.rotation.set(0, 0, 0);
        this.currentModel.scale.set(1, 1, 1);

        this.currentModel.updateMatrixWorld(true);

        this.transformControls.reset();

        this.dispatchTransformChange();
    }

    public setTransformEnabled(enabled: boolean): void {
        this.transformEnabled = enabled;

        if (!this.currentModel) {
            this.transformControls.detach();
            this.transformHelper.visible = false;

            return;
        }

        if (enabled) {
            this.transformControls.attach(this.currentModel);
            this.transformHelper.visible = true;
        } else {
            this.transformControls.detach();
            this.transformHelper.visible = false;
        }
    }

    public setTransformMode(mode: TransformMode): void {
        this.transformControls.setMode(mode);
    }

    public setTransformSpace(space: TransformSpace): void {
        this.transformControls.setSpace(space);
    }

    public setRotationSnap(enabled: boolean): void {
        this.transformControls.setRotationSnap(enabled ? Math.PI / 12 : null);
    }

    public setTranslationSnap(enabled: boolean): void {
        this.transformControls.setTranslationSnap(enabled ? 0.5 : null);
    }

    public setBackgroundColor(color: string): void {
        this.scene.background = new Color(color);
    }

    public setGridVisible(visible: boolean): void {
        this.gridHelper.visible = visible;
    }

    public setAxesVisible(visible: boolean): void {
        this.axesHelper.visible = visible;
    }

    public setAutoRotate(enabled: boolean): void {
        this.controls.autoRotate = enabled;
        this.controls.autoRotateSpeed = 1.5;
    }

    public removeCurrentModel(): void {
        this.transformControls.detach();
        this.transformHelper.visible = false;

        if (!this.currentModel) {
            return;
        }

        disposeObject3D(this.currentModel);

        this.currentModel = null;
    }

    public hasModel(): boolean {
        return this.currentModel !== null;
    }

    public dispose(): void {
        if (this.isDisposed) {
            return;
        }

        this.isDisposed = true;

        this.resizeObserver.disconnect();

        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);

            this.animationFrameId = null;
        }

        this.removeCurrentModel();

        this.transformControls.dispose();
        this.controls.dispose();
        this.renderer.dispose();

        this.transformHelper.removeFromParent();
        this.renderer.domElement.remove();
    }

    private configureLights(): void {
        const ambientLight = new AmbientLight(0xffffff, 1.5);

        this.scene.add(ambientLight);

        const mainLight = new DirectionalLight(0xffffff, 3);

        mainLight.position.set(8, 12, 10);
        mainLight.castShadow = true;

        this.scene.add(mainLight);

        const secondaryLight = new DirectionalLight(0xffffff, 1.5);

        secondaryLight.position.set(-8, 6, -10);

        this.scene.add(secondaryLight);

        const frontalLight = new DirectionalLight(0xffffff, 1);

        frontalLight.position.set(0, 4, 10);

        this.scene.add(frontalLight);
    }

    private prepareModel(model: Object3D): void {
        model.traverse((child) => {
            if ('castShadow' in child) {
                child.castShadow = true;
            }

            if ('receiveShadow' in child) {
                child.receiveShadow = true;
            }
        });
    }

    private updateHelperScale(): void {
        if (!this.currentModel) {
            return;
        }

        const box = new Box3().setFromObject(this.currentModel);

        const size = box.getSize(new Vector3());

        const maximumDimension = Math.max(size.x, size.y, size.z, 1);

        this.gridHelper.scale.setScalar(maximumDimension / 10);

        this.axesHelper.scale.setScalar(maximumDimension / 5);

        this.transformControls.setSize(1);
    }

    private dispatchTransformChange(): void {
        if (!this.currentModel) {
            return;
        }

        const radiansToDegrees = 180 / Math.PI;

        const detail = {
            position: {
                x: this.currentModel.position.x,
                y: this.currentModel.position.y,
                z: this.currentModel.position.z
            },

            rotation: {
                x: this.currentModel.rotation.x * radiansToDegrees,

                y: this.currentModel.rotation.y * radiansToDegrees,

                z: this.currentModel.rotation.z * radiansToDegrees
            },

            scale: {
                x: this.currentModel.scale.x,
                y: this.currentModel.scale.y,
                z: this.currentModel.scale.z
            }
        };

        this.container.dispatchEvent(new CustomEvent('cad-transform-change', {
            detail,
            bubbles: true,
            composed: true
        }
        )
        );
    }

    private resize(): void {
        const width = Math.max(this.container.clientWidth, 1);

        const height = Math.max(this.container.clientHeight, 1);

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height, false);
    }

    private startRenderLoop(): void {
        const render = (): void => {
            if (this.isDisposed) {
                return;
            }

            this.animationFrameId = requestAnimationFrame(render);

            this.controls.update();

            this.renderer.render(
                this.scene,
                this.camera
            );
        };

        render();
    }
}