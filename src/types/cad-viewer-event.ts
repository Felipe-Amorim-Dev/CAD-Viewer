import type { SupportedFileExtension } from '../loaders/FileExtension';

export interface CadViewerLoadStartDetail {
  source: string;
}

export interface CadViewerProgressDetail {
  loaded: number;
  total: number;
  percentage: number | null;
}

export interface CadViewerLoadedDetail {
  source: string;
  format: SupportedFileExtension;
}

export interface CadViewerErrorDetail {
  source: string | null;
  message: string;
  error: unknown;
}

declare global {
  interface HTMLElementEventMap {
    'cad-load-start': CustomEvent<CadViewerLoadStartDetail>;
    'cad-progress': CustomEvent<CadViewerProgressDetail>;
    'cad-loaded': CustomEvent<CadViewerLoadedDetail>;
    'cad-error': CustomEvent<CadViewerErrorDetail>;
    'cad-model-removed': CustomEvent<void>;
  }
}