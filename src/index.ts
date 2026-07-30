import { CadViewerElement } from './components/CadViewerElement';

export { CadViewerElement };
export type { CadViewerErrorDetail, CadViewerLoadedDetail, CadViewerLoadStartDetail, CadViewerProgressDetail } from './types/cad-viewer-event';
export type { SupportedFileExtension } from './loaders/FileExtension';

if (typeof window !== 'undefined' && !window.customElements.get(CadViewerElement.tagName)) {
    window.customElements.define(CadViewerElement.tagName, CadViewerElement);
}