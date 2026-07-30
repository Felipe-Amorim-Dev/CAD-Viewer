# CAD Viewer

Plugin web para visualização e manipulação de modelos CAD 3D diretamente no navegador.

O componente foi desenvolvido com TypeScript, Three.js e Web Components. Não exige backend nem banco de dados.

## Recursos

- Visualização de modelos 3D.
- Rotação, zoom e movimentação da câmera.
- Rotação e posicionamento da peça.
- Controles nos eixos X, Y e Z.
- Grade e eixos auxiliares.
- Ajuste automático da câmera.
- Carregamento por URL.
- Seleção de arquivo local.
- Execução totalmente no navegador.

## Formatos suportados

- GLB
- GLTF
- STL
- OBJ
- PLY

## Instalação

```bash
npm install @felipe-amorim-dev/cad-viewer
```

## Uso em JavaScript ou TypeScript

Importe o pacote:

```typescript
import '@felipe-amorim-dev/cad-viewer';
```

Depois use o componente no HTML:

```html
<cad-viewer
  src="/models/peca.glb"
  show-grid="true"
  show-axes="false"
  auto-rotate="false"
  allow-file-selection="true">
</cad-viewer>
```

## Definindo o tamanho

```css
cad-viewer {
  display: block;
  width: 100%;
  height: 700px;
}
```

## Carregando um arquivo por código

```typescript
import {
  CadViewerElement
} from '@seu-usuario/cad-viewer';

const viewer =
  document.querySelector<CadViewerElement>(
    '#viewer'
  );

await viewer?.load('/models/montagem.glb');
```

## Carregando um arquivo local

```typescript
const input =
  document.querySelector<HTMLInputElement>(
    '#file'
  );

const viewer =
  document.querySelector<CadViewerElement>(
    '#viewer'
  );

input?.addEventListener('change', async () => {
  const file = input.files?.[0];

  if (!file || !viewer) {
    return;
  }

  await viewer.loadFile(file);
});
```

## Eventos

### Modelo carregado

```typescript
viewer.addEventListener(
  'cad-loaded',
  (event) => {
    console.log(event.detail);
  }
);
```

### Progresso

```typescript
viewer.addEventListener(
  'cad-progress',
  (event) => {
    console.log(event.detail.percentage);
  }
);
```

### Erro

```typescript
viewer.addEventListener(
  'cad-error',
  (event) => {
    console.error(event.detail.message);
  }
);
```

### Alteração da posição ou rotação

```typescript
viewer.addEventListener(
  'cad-transform-change',
  (event) => {
    console.log(event.detail.position);
    console.log(event.detail.rotation);
    console.log(event.detail.scale);
  }
);
```

## Métodos públicos

```typescript
viewer.fitToModel();
viewer.resetView();
viewer.resetModelTransform();
viewer.removeModel();
```

## Uso em Angular

No arquivo principal:

```typescript
import '@felipe-amorim-dev/cad-viewer';
```

No template:

```html
<cad-viewer
  src="assets/models/peca.glb"
  show-grid="true">
</cad-viewer>
```

Caso o Angular apresente erro de elemento desconhecido, adicione `CUSTOM_ELEMENTS_SCHEMA`:

```typescript
import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule
} from '@angular/core';

@NgModule({
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule {}
```

Em aplicações standalone:

```typescript
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  template: `
    <cad-viewer
      src="/models/peca.glb">
    </cad-viewer>
  `
})
export class AppComponent {}
```

## Uso em React

```tsx
import '@felipe-amorim-dev/cad-viewer';

export function App() {
  return (
    <cad-viewer
      src="/models/peca.glb"
      show-grid="true"
    />
  );
}
```

Para TypeScript com React, pode ser necessário declarar a tag:

```typescript
declare namespace JSX {
  interface IntrinsicElements {
    'cad-viewer': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      src?: string;
      background?: string;
      'show-grid'?: string;
      'show-axes'?: string;
      'auto-rotate'?: string;
      'allow-file-selection'?: string;
    };
  }
}
```

## Desenvolvimento

Instale as dependências:

```bash
npm install
```

Execute em desenvolvimento:

```bash
npm run dev
```

Valide o TypeScript:

```bash
npm run typecheck
```

Gere o pacote:

```bash
npm run build
```

## Privacidade

Os arquivos selecionados pelo usuário são processados localmente no navegador.

O plugin não envia os arquivos para servidores externos e não armazena dados pessoais.

## Licença

MIT