import { CadViewerElement } from './components/CadViewerElement';

export { CadViewerElement };
export type { CadViewerErrorDetail, CadViewerLoadedDetail, CadViewerLoadStartDetail, CadViewerProgressDetail } from './types/cad-viewer-event';
export type { SupportedFileExtension } from './loaders/FileExtension';
export type { TransformMode, TransformSpace } from './core/CadScene';

function registerCadViewer(): void {
  if (typeof window === 'undefined') {
    return;
  }

  if (
    window.customElements.get( CadViewerElement.tagName) ) {
    return;
  }

  window.customElements.define( CadViewerElement.tagName, CadViewerElement );
}

registerCadViewer();