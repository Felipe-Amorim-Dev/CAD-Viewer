import { CadScene, type TransformMode, type TransformSpace } from '../core/CadScene';
import { CadModelLoader, type LoadingProgress } from '../loaders/CadModelLoader';
import { createViewerTemplate } from './template';
import type { CadViewerErrorDetail, CadViewerLoadedDetail, CadViewerLoadStartDetail, CadViewerProgressDetail } from '../types/cad-viewer-event';

const template = createViewerTemplate();

export class CadViewerElement extends HTMLElement {
    public static readonly tagName = 'cad-viewer';

    public static get observedAttributes(): string[] {
        return [
            'src',
            'background',
            'show-grid',
            'show-axes',
            'auto-rotate',
            'allow-file-selection'
        ];
    }

    private readonly shadow: ShadowRoot;
    private readonly canvasContainer: HTMLDivElement;
    private readonly fileInput: HTMLInputElement;
    private readonly statusElement: HTMLDivElement;
    private readonly emptyStateElement: HTMLDivElement;
    private readonly transformToolbar: HTMLDivElement;
    private readonly transformHelp: HTMLDivElement;
    private readonly openFileButton: HTMLButtonElement;
    private readonly fitButton: HTMLButtonElement;
    private readonly resetViewButton: HTMLButtonElement;
    private readonly gridButton: HTMLButtonElement;
    private readonly axesButton: HTMLButtonElement;
    private readonly autoRotateButton: HTMLButtonElement;
    private readonly transformButton: HTMLButtonElement;
    private readonly transformRotateButton: HTMLButtonElement;
    private readonly transformMoveButton: HTMLButtonElement;
    private readonly transformLocalButton: HTMLButtonElement;
    private readonly transformWorldButton: HTMLButtonElement;
    private readonly transformSnapButton: HTMLButtonElement;
    private readonly resetModelButton: HTMLButtonElement;
    private readonly removeButton: HTMLButtonElement;
    private readonly loader = new CadModelLoader();
    private cadScene: CadScene | null = null;
    private currentSource: string | null = null;
    private currentLoadToken = 0;
    private isConnectedToDom = false;
    private isGridVisible = true;
    private isAxesVisible = false;
    private isAutoRotateEnabled = false;
    private isTransformEnabled = false;
    private isTransformSnapEnabled = false;
    private transformMode: TransformMode = 'rotate';
    private transformSpace: TransformSpace = 'local';

    public constructor() {
        super();

        this.shadow = this.attachShadow({
            mode: 'open'
        });

        this.shadow.appendChild(template.content.cloneNode(true));

        this.canvasContainer = this.getRequiredElement<HTMLDivElement>('[data-element="canvas-container"]');

        this.fileInput = this.getRequiredElement<HTMLInputElement>('[data-element="file-input"]');

        this.statusElement = this.getRequiredElement<HTMLDivElement>('[data-element="status"]');

        this.emptyStateElement = this.getRequiredElement<HTMLDivElement>('[data-element="empty-state"]');

        this.transformToolbar = this.getRequiredElement<HTMLDivElement>('[data-element="transform-toolbar"]');

        this.transformHelp = this.getRequiredElement<HTMLDivElement>('[data-element="transform-help"]');

        this.openFileButton = this.getRequiredElement<HTMLButtonElement>('[data-action="open-file"]');

        this.fitButton = this.getRequiredElement<HTMLButtonElement>('[data-action="fit"]');

        this.resetViewButton = this.getRequiredElement<HTMLButtonElement>('[data-action="reset-view"]');

        this.gridButton = this.getRequiredElement<HTMLButtonElement>('[data-action="grid"]');

        this.axesButton = this.getRequiredElement<HTMLButtonElement>('[data-action="axes"]');

        this.autoRotateButton = this.getRequiredElement<HTMLButtonElement>('[data-action="auto-rotate"]');

        this.transformButton = this.getRequiredElement<HTMLButtonElement>('[data-action="transform"]');

        this.transformRotateButton = this.getRequiredElement<HTMLButtonElement>('[data-action="transform-rotate"]');

        this.transformMoveButton = this.getRequiredElement<HTMLButtonElement>('[data-action="transform-move"]');

        this.transformLocalButton = this.getRequiredElement<HTMLButtonElement>('[data-action="transform-local"]');

        this.transformWorldButton = this.getRequiredElement<HTMLButtonElement>('[data-action="transform-world"]');

        this.transformSnapButton = this.getRequiredElement<HTMLButtonElement>('[data-action="transform-snap"]');

        this.resetModelButton = this.getRequiredElement<HTMLButtonElement>('[data-action="reset-model"]');

        this.removeButton = this.getRequiredElement<HTMLButtonElement>('[data-action="remove"]');

        this.bindEvents();
    }

    public connectedCallback(): void {
        if (this.isConnectedToDom) {
            return;
        }

        this.isConnectedToDom = true;

        this.createScene();
        this.applyAllAttributes();

        const src = this.src;

        if (src) {
            void this.load(src).catch(() => { });
        }
    }

    public disconnectedCallback(): void {
        this.isConnectedToDom = false;

        this.currentLoadToken += 1;

        this.cadScene?.dispose();

        this.cadScene = null;
    }

    public attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
        if (oldValue === newValue) {
            return;
        }

        if (!this.isConnectedToDom) {
            return;
        }

        switch (name) {
            case 'src':
                if (newValue) {
                    void this.load(newValue).catch(() => { });
                } else {
                    this.removeModel();
                }
                break;

            case 'background':
                this.cadScene?.setBackgroundColor(newValue || '#eef1f5');
                break;

            case 'show-grid':
                this.applyGridAttribute();
                break;

            case 'show-axes':
                this.applyAxesAttribute();
                break;

            case 'auto-rotate':
                this.applyAutoRotateAttribute();
                break;

            case 'allow-file-selection':
                this.applyFileSelectionAttribute();
                break;
        }
    }

    public get src(): string {
        return this.getAttribute('src') ?? '';
    }

    public set src(value: string) {
        const normalizedValue = value.trim();

        if (!normalizedValue) {
            this.removeAttribute('src');

            return;
        }

        this.setAttribute('src', normalizedValue);
    }

    public get background(): string {
        return (this.getAttribute('background') ?? '#eef1f5');
    }

    public set background(value: string) {
        this.setAttribute('background', value);
    }

    public async load(source: string): Promise<void> {
        const normalizedSource = source.trim();

        if (!normalizedSource) {
            throw new Error('A URL do modelo não pode estar vazia.');
        }

        const loadToken = ++this.currentLoadToken;

        this.currentSource = normalizedSource;

        this.setLoadingState(true);
        this.showStatus('Carregando modelo...');
        this.dispatchLoadStart(normalizedSource);

        try {
            const result = await this.loader.loadFromUrl(normalizedSource, (progress) => {
                if (loadToken !== this.currentLoadToken) {
                    return;
                }

                this.handleProgress(progress);
            }
            );

            if (loadToken !== this.currentLoadToken) {
                return;
            }

            if (!this.cadScene) {
                return;
            }

            this.cadScene.setModel(result.object);

            this.setModelAvailableState(true);

            this.showStatus(`${result.sourceName} carregado com sucesso.`);

            this.dispatchLoaded({
                source: normalizedSource,
                format: result.format
            });
        } catch (error) {
            if (loadToken !== this.currentLoadToken) {
                return;
            }

            this.handleError(error, normalizedSource);

            throw error;
        } finally {
            if (loadToken === this.currentLoadToken) {
                this.setLoadingState(false);
            }
        }
    }

    public async loadFile(file: File): Promise<void> {
        if (!(file instanceof File)) {
            throw new TypeError('É necessário informar um arquivo válido.');
        }

        const loadToken = ++this.currentLoadToken;

        this.currentSource = file.name;

        this.setLoadingState(true);
        this.showStatus('Lendo arquivo local...');
        this.dispatchLoadStart(file.name);

        try {
            const result = await this.loader.loadFromFile(
                file,
                (progress) => {
                    if (loadToken !== this.currentLoadToken) {
                        return;
                    }

                    this.handleProgress(progress);
                }
            );

            if (loadToken !== this.currentLoadToken) {
                return;
            }

            if (!this.cadScene) {
                return;
            }

            this.cadScene.setModel(result.object);

            this.setModelAvailableState(true);

            this.showStatus(`${result.sourceName} carregado com sucesso.`);

            this.dispatchLoaded({
                source: file.name,
                format: result.format
            });
        } catch (error) {
            if (loadToken !== this.currentLoadToken) {
                return;
            }

            this.handleError(error, file.name);

            throw error;
        } finally {
            if (loadToken === this.currentLoadToken) {
                this.setLoadingState(false);
            }
        }
    }

    public fitToModel(): void {
        this.cadScene?.fitToModel();
    }

    public resetView(): void {
        this.cadScene?.resetView();
    }

    public resetModelTransform(): void {
        this.cadScene?.resetModelTransform();
    }

    public removeModel(): void {
        this.currentLoadToken += 1;
        this.currentSource = null;

        this.disableTransformMode();

        this.cadScene?.removeCurrentModel();

        this.setModelAvailableState(false);
        this.hideStatus();

        this.dispatchEvent(
            new CustomEvent<void>(
                'cad-model-removed',
                {
                    bubbles: true,
                    composed: true
                }
            )
        );
    }

    private createScene(): void {
        if (this.cadScene) {
            return;
        }

        this.cadScene = new CadScene(
            this.canvasContainer,
            {
                backgroundColor: this.background,

                showGrid: this.readBooleanAttribute('show-grid', true),

                showAxes: this.readBooleanAttribute('show-axes', false)
            });
    }

    private bindEvents(): void {
        this.openFileButton.addEventListener('click', () => {
            this.fileInput.click();
        });

        this.fileInput.addEventListener('change', () => {
            const file = this.fileInput.files?.[0];

            this.fileInput.value = '';

            if (!file) {
                return;
            }

            void this.loadFile(file).catch(() => { });
        });

        this.fitButton.addEventListener('click', () => {
            this.fitToModel();
        });

        this.resetViewButton.addEventListener('click', () => {
            this.resetView();
        });

        this.gridButton.addEventListener('click', () => {
            this.isGridVisible = !this.isGridVisible;

            this.cadScene?.setGridVisible(this.isGridVisible);

            this.updateToggleButton(this.gridButton, this.isGridVisible);
        });

        this.axesButton.addEventListener('click', () => {
            this.isAxesVisible = !this.isAxesVisible;

            this.cadScene?.setAxesVisible(this.isAxesVisible);

            this.updateToggleButton(this.axesButton, this.isAxesVisible);
        });

        this.autoRotateButton.addEventListener('click', () => {
            this.isAutoRotateEnabled = !this.isAutoRotateEnabled;

            this.cadScene?.setAutoRotate(this.isAutoRotateEnabled);

            this.updateToggleButton(this.autoRotateButton, this.isAutoRotateEnabled);
        });

        this.transformButton.addEventListener('click', () => {
            this.isTransformEnabled = !this.isTransformEnabled;

            this.cadScene?.setTransformEnabled(this.isTransformEnabled);

            this.transformToolbar.classList.toggle('visible', this.isTransformEnabled);

            this.transformHelp.classList.toggle('visible', this.isTransformEnabled);

            this.updateToggleButton(this.transformButton, this.isTransformEnabled);
        });

        this.transformRotateButton.addEventListener('click', () => {
            this.setTransformMode('rotate');
        });

        this.transformMoveButton.addEventListener('click', () => {
            this.setTransformMode('translate');
        });

        this.transformLocalButton.addEventListener('click', () => {
            this.setTransformSpace('local');
        });

        this.transformWorldButton.addEventListener('click', () => {
            this.setTransformSpace('world');
        });

        this.transformSnapButton.addEventListener('click', () => {
            this.isTransformSnapEnabled = !this.isTransformSnapEnabled;

            this.cadScene?.setRotationSnap(this.isTransformSnapEnabled);

            this.cadScene?.setTranslationSnap(this.isTransformSnapEnabled);

            this.updateToggleButton(this.transformSnapButton, this.isTransformSnapEnabled);
        });

        this.resetModelButton.addEventListener('click', () => {
            this.resetModelTransform();
        });

        this.removeButton.addEventListener('click', () => {
            this.removeModel();
        });
    }

    private setTransformMode(mode: TransformMode): void {
        this.transformMode = mode;

        this.cadScene?.setTransformMode(mode);

        this.updateToggleButton(this.transformRotateButton, mode === 'rotate');

        this.updateToggleButton(this.transformMoveButton, mode === 'translate');
    }

    private setTransformSpace(space: TransformSpace): void {
        this.transformSpace = space;

        this.cadScene?.setTransformSpace(space);

        this.updateToggleButton(this.transformLocalButton, space === 'local');

        this.updateToggleButton(this.transformWorldButton, space === 'world');
    }

    private disableTransformMode(): void {
        this.isTransformEnabled = false;

        this.cadScene?.setTransformEnabled(false);

        this.transformToolbar.classList.remove('visible');

        this.transformHelp.classList.remove('visible');

        this.updateToggleButton(this.transformButton, false);
    }

    private applyAllAttributes(): void {
        this.cadScene?.setBackgroundColor(this.background);

        this.applyGridAttribute();
        this.applyAxesAttribute();
        this.applyAutoRotateAttribute();
        this.applyFileSelectionAttribute();

        this.cadScene?.setTransformMode(this.transformMode);

        this.cadScene?.setTransformSpace(this.transformSpace);
    }

    private applyGridAttribute(): void {
        this.isGridVisible = this.readBooleanAttribute('show-grid', true);

        this.cadScene?.setGridVisible(this.isGridVisible);

        this.updateToggleButton(this.gridButton, this.isGridVisible);
    }

    private applyAxesAttribute(): void {
        this.isAxesVisible = this.readBooleanAttribute('show-axes', false);

        this.cadScene?.setAxesVisible(this.isAxesVisible);

        this.updateToggleButton(this.axesButton, this.isAxesVisible);
    }

    private applyAutoRotateAttribute(): void {
        this.isAutoRotateEnabled = this.readBooleanAttribute('auto-rotate', false);

        this.cadScene?.setAutoRotate(this.isAutoRotateEnabled);

        this.updateToggleButton(this.autoRotateButton, this.isAutoRotateEnabled);
    }

    private applyFileSelectionAttribute(): void {
        const isAllowed = this.readBooleanAttribute('allow-file-selection', true);

        this.openFileButton.hidden = !isAllowed;
    }

    private readBooleanAttribute(name: string, defaultValue: boolean): boolean {
        if (!this.hasAttribute(name)) {
            return defaultValue;
        }

        const value = this.getAttribute(name);

        if (value === null || value === '' || value.toLowerCase() === 'true') {
            return true;
        }

        if (value.toLowerCase() === 'false') {
            return false;
        }

        return true;
    }

    private handleProgress(progress: LoadingProgress): void {
        if (progress.percentage !== null) {
            this.showStatus(`Carregando modelo: ${progress.percentage}%`);
        } else {
            const loadedMegabytes = progress.loaded / 1024 / 1024;

            this.showStatus(`Carregando modelo: ${loadedMegabytes.toFixed(1)} MB`);
        }

        const detail: CadViewerProgressDetail = {
            loaded: progress.loaded,
            total: progress.total,
            percentage: progress.percentage
        };

        this.dispatchEvent(
            new CustomEvent<CadViewerProgressDetail>(
                'cad-progress',
                {
                    detail,
                    bubbles: true,
                    composed: true
                }
            )
        );
    }

    private handleError(error: unknown, source: string | null): void {
        const message = error instanceof Error ? error.message : 'Ocorreu um erro ao carregar o modelo.';

        this.showStatus(message, true);

        const detail: CadViewerErrorDetail = {
            source,
            message,
            error
        };

        this.dispatchEvent(
            new CustomEvent<CadViewerErrorDetail>(
                'cad-error',
                {
                    detail,
                    bubbles: true,
                    composed: true
                }
            )
        );
    }

    private dispatchLoadStart(source: string): void {
        const detail: CadViewerLoadStartDetail = {
            source
        };

        this.dispatchEvent(
            new CustomEvent<CadViewerLoadStartDetail>(
                'cad-load-start',
                {
                    detail,
                    bubbles: true,
                    composed: true
                }
            )
        );
    }

    private dispatchLoaded(detail: CadViewerLoadedDetail): void {
        this.dispatchEvent(new CustomEvent<CadViewerLoadedDetail>(
            'cad-loaded',
            {
                detail,
                bubbles: true,
                composed: true
            }
        )
        );
    }

    private setLoadingState(isLoading: boolean): void {
        this.openFileButton.disabled = isLoading;

        if (isLoading) {
            this.fitButton.disabled = true;
            this.resetViewButton.disabled = true;
            this.transformButton.disabled = true;
            this.removeButton.disabled = true;
        }
    }

    private setModelAvailableState(hasModel: boolean): void {
        this.emptyStateElement.classList.toggle('hidden', hasModel);

        this.fitButton.disabled = !hasModel;
        this.resetViewButton.disabled = !hasModel;
        this.transformButton.disabled = !hasModel;
        this.removeButton.disabled = !hasModel;
    }

    private updateToggleButton(button: HTMLButtonElement, active: boolean): void {
        button.classList.toggle('active', active);

        button.setAttribute('aria-pressed', String(active));
    }

    private showStatus(message: string, isError = false): void {
        this.statusElement.textContent = message;

        this.statusElement.classList.remove('hidden');

        this.statusElement.classList.toggle('error', isError);
    }

    private hideStatus(): void {
        this.statusElement.textContent = '';

        this.statusElement.classList.add('hidden');

        this.statusElement.classList.remove('error');
    }

    private getRequiredElement<T extends Element>(selector: string): T {
        const element = this.shadow.querySelector<T>(selector);

        if (!element) {
            throw new Error(`Elemento obrigatório não encontrado: ${selector}`);
        }

        return element;
    }
}