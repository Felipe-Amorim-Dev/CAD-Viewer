import { createAcceptedFileTypes } from '../loaders/FileExtension';

export function createViewerTemplate(): HTMLTemplateElement {
  const template = document.createElement('template');

  template.innerHTML = `
    <style>
      :host {
        display: block;
        width: 100%;
        height: 600px;
        min-height: 300px;

        font-family:
          Inter,
          system-ui,
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          sans-serif;

        --cad-viewer-background: #eef1f5;
        --cad-viewer-panel: rgba(255, 255, 255, 0.94);
        --cad-viewer-text: #1f2937;
        --cad-viewer-muted: #64748b;
        --cad-viewer-border: #cbd5e1;
        --cad-viewer-primary: #2563eb;
        --cad-viewer-danger: #b91c1c;
      }

      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }

      .viewer {
        position: relative;

        width: 100%;
        height: 100%;
        min-height: inherit;

        overflow: hidden;

        border: 1px solid var(--cad-viewer-border);
        border-radius: 12px;

        background: var(--cad-viewer-background);
      }

      .canvas-container {
        position: absolute;
        inset: 0;
      }

      .canvas-container canvas {
        display: block;

        width: 100%;
        height: 100%;

        outline: none;
      }

      .toolbar {
        position: absolute;

        top: 12px;
        left: 12px;
        right: 12px;

        z-index: 10;

        display: flex;
        align-items: flex-start;
        flex-wrap: wrap;

        gap: 8px;

        pointer-events: none;
      }

      .toolbar-group {
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        gap: 6px;

        padding: 6px;

        border: 1px solid var(--cad-viewer-border);
        border-radius: 10px;

        background: var(--cad-viewer-panel);
        backdrop-filter: blur(8px);

        pointer-events: auto;
      }

      .transform-toolbar {
        display: none;
      }

      .transform-toolbar.visible {
        display: flex;
      }

      button {
        min-height: 36px;
        padding: 7px 12px;

        border: 1px solid var(--cad-viewer-border);
        border-radius: 8px;

        background: #ffffff;
        color: var(--cad-viewer-text);

        font: inherit;
        font-size: 14px;

        cursor: pointer;
      }

      button:hover {
        background: #f8fafc;
      }

      button:focus-visible {
        outline: 3px solid rgba(37, 99, 235, 0.3);
        outline-offset: 2px;
      }

      button.primary {
        border-color: var(--cad-viewer-primary);

        background: var(--cad-viewer-primary);
        color: #ffffff;
      }

      button.active {
        border-color: var(--cad-viewer-primary);

        background: #eff6ff;
        color: var(--cad-viewer-primary);
      }

      button:disabled {
        opacity: 0.55;

        cursor: not-allowed;
      }

      .file-input {
        display: none;
      }

      .transform-help {
        position: absolute;

        top: 104px;
        right: 12px;

        z-index: 10;

        display: none;

        max-width: 260px;
        padding: 10px 12px;

        border: 1px solid var(--cad-viewer-border);
        border-radius: 8px;

        background: var(--cad-viewer-panel);
        color: var(--cad-viewer-muted);

        font-size: 13px;
        line-height: 1.4;

        pointer-events: none;
      }

      .transform-help.visible {
        display: block;
      }

      .status {
        position: absolute;

        left: 12px;
        bottom: 12px;

        z-index: 10;

        max-width: calc(100% - 24px);
        padding: 8px 12px;

        border: 1px solid var(--cad-viewer-border);
        border-radius: 8px;

        background: var(--cad-viewer-panel);
        color: var(--cad-viewer-text);

        font-size: 14px;

        pointer-events: none;
      }

      .status.error {
        border-color: var(--cad-viewer-danger);
        color: var(--cad-viewer-danger);
      }

      .status.hidden {
        display: none;
      }

      .empty-state {
        position: absolute;
        inset: 0;

        z-index: 5;

        display: flex;
        align-items: center;
        justify-content: center;

        padding: 24px;

        pointer-events: none;
      }

      .empty-state-content {
        max-width: 460px;
        padding: 24px;

        border: 1px dashed var(--cad-viewer-border);
        border-radius: 12px;

        background: rgba(255, 255, 255, 0.84);
        color: var(--cad-viewer-text);

        text-align: center;
      }

      .empty-state-title {
        margin: 0 0 8px;

        font-size: 18px;
        font-weight: 600;
      }

      .empty-state-text {
        margin: 0;

        color: var(--cad-viewer-muted);

        font-size: 14px;
        line-height: 1.5;
      }

      .empty-state.hidden {
        display: none;
      }

      @media (max-width: 760px) {
        :host {
          height: 520px;
        }

        .toolbar {
          top: 8px;
          left: 8px;
          right: 8px;
        }

        .toolbar-group {
          width: 100%;
        }

        button {
          flex: 1 1 auto;
        }

        .transform-help {
          display: none !important;
        }

        .status {
          left: 8px;
          bottom: 8px;

          max-width: calc(100% - 16px);
        }
      }
    </style>

    <div class="viewer">
      <div
        class="canvas-container"
        data-element="canvas-container">
      </div>

      <div
        class="toolbar"
        data-element="toolbar">

        <div class="toolbar-group">
          <button
            type="button"
            class="primary"
            data-action="open-file">
            Abrir arquivo
          </button>

          <button
            type="button"
            data-action="fit"
            disabled>
            Ajustar
          </button>

          <button
            type="button"
            data-action="reset-view"
            disabled>
            Reiniciar vista
          </button>
        </div>

        <div class="toolbar-group">
          <button
            type="button"
            data-action="grid"
            class="active">
            Grade
          </button>

          <button
            type="button"
            data-action="axes">
            Eixos
          </button>

          <button
            type="button"
            data-action="auto-rotate">
            Rotação automática
          </button>

          <button
            type="button"
            data-action="transform"
            disabled>
            Manipular peça
          </button>

          <button
            type="button"
            data-action="remove"
            disabled>
            Remover
          </button>
        </div>

        <div
          class="toolbar-group transform-toolbar"
          data-element="transform-toolbar">

          <button
            type="button"
            data-action="transform-rotate"
            class="active">
            Rotacionar
          </button>

          <button
            type="button"
            data-action="transform-move">
            Mover
          </button>

          <button
            type="button"
            data-action="transform-local"
            class="active">
            Local
          </button>

          <button
            type="button"
            data-action="transform-world">
            Global
          </button>

          <button
            type="button"
            data-action="transform-snap">
            Encaixe 15°
          </button>

          <button
            type="button"
            data-action="reset-model">
            Restaurar peça
          </button>
        </div>
      </div>

      <div
        class="transform-help"
        data-element="transform-help">

        Arraste os círculos coloridos para rotacionar.
        Arraste as setas para mover a peça.
        Clique e arraste fora do controle para movimentar
        a câmera.
      </div>

      <input
        class="file-input"
        data-element="file-input"
        type="file"
        accept="${createAcceptedFileTypes()}"
      />

      <div
        class="empty-state"
        data-element="empty-state">

        <div class="empty-state-content">
          <p class="empty-state-title">
            Nenhum modelo carregado
          </p>

          <p class="empty-state-text">
            Abra um arquivo GLB, GLTF, STL, OBJ ou PLY,
            ou informe uma URL no atributo src.
          </p>
        </div>
      </div>

      <div
        class="status hidden"
        data-element="status"
        role="status"
        aria-live="polite">
      </div>
    </div>
  `;

  return template;
}