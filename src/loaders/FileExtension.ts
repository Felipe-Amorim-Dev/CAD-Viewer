export type SupportedFileExtension = | 'glb' | 'gltf' | 'stl' | 'obj' | 'ply';
export const SUPPORTED_FILE_EXTENSIONS: readonly SupportedFileExtension[] = ['glb', 'gltf', 'stl', 'obj', 'ply'] as const;

export function getFileExtension(
    fileNameOrUrl: string
): SupportedFileExtension | null {
    const cleanValue = fileNameOrUrl
        .split('?')[0]
        .split('#')[0]
        .trim()
        .toLowerCase();

    const lastDotIndex = cleanValue.lastIndexOf('.');

    if (lastDotIndex === -1) {
        return null;
    }

    const extension = cleanValue.slice(lastDotIndex + 1);

    return isSupportedFileExtension(extension)
        ? extension
        : null;
}

export function isSupportedFileExtension(value: string): value is SupportedFileExtension {
    return SUPPORTED_FILE_EXTENSIONS.includes(
        value as SupportedFileExtension
    );
}

export function createAcceptedFileTypes(): string {
    return SUPPORTED_FILE_EXTENSIONS
        .map((extension) => `.${extension}`)
        .join(',');
}