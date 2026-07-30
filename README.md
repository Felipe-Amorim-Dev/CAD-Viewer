# 🧩 CAD Viewer

Plugin web open-source desenvolvido em TypeScript para visualização e manipulação de modelos 3D diretamente no navegador.

[![npm version](https://img.shields.io/npm/v/@felipe-amorim-dev/cad-viewer?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/@felipe-amorim-dev/cad-viewer)
[![npm downloads](https://img.shields.io/npm/dm/@felipe-amorim-dev/cad-viewer?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/@felipe-amorim-dev/cad-viewer)
[![GitHub repo size](https://img.shields.io/github/repo-size/Felipe-Amorim-Dev/CAD-Viewer?style=for-the-badge)](https://github.com/Felipe-Amorim-Dev/CAD-Viewer)
[![GitHub stars](https://img.shields.io/github/stars/Felipe-Amorim-Dev/CAD-Viewer?style=for-the-badge)](https://github.com/Felipe-Amorim-Dev/CAD-Viewer/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Felipe-Amorim-Dev/CAD-Viewer?style=for-the-badge)](https://github.com/Felipe-Amorim-Dev/CAD-Viewer/network/members)
[![License](https://img.shields.io/github/license/Felipe-Amorim-Dev/CAD-Viewer?style=for-the-badge)](LICENSE)

## 📌 Visão geral

O CAD Viewer é um Web Component reutilizável para visualização de modelos 3D em páginas web.

O plugin foi desenvolvido para funcionar totalmente no navegador, sem necessidade de backend, banco de dados ou envio dos arquivos para servidores externos.

Os modelos podem ser carregados por uma URL pública ou selecionados diretamente no computador do usuário.

**O projeto foi estruturado com foco em:**

🔹 Reutilização em diferentes frameworks

🔹 Processamento local no navegador

🔹 Privacidade dos arquivos do usuário

🔹 Manipulação simples de modelos 3D

🔹 Baixo acoplamento

🔹 Facilidade de distribuição pelo npm

🔹 Compatibilidade com páginas HTML, Angular, React e Vue

## ✨ Funcionalidades

O plugin possui os seguintes recursos:

- Carregamento de modelos por URL
- Seleção de arquivos locais
- Rotação da câmera
- Zoom
- Movimentação da câmera
- Ajuste automático do modelo na tela
- Rotação manual da peça
- Movimentação da peça nos eixos X, Y e Z
- Manipulação em coordenadas locais ou globais
- Rotação com encaixe em intervalos de 15 graus
- Restauração da posição original da peça
- Grade auxiliar
- Exibição dos eixos
- Rotação automática
- Eventos de carregamento, progresso e erro
- Processamento totalmente local
- Distribuição por npm

## 📁 Formatos suportados

Atualmente o plugin suporta:

| Formato | Extensão | Carregamento |
|---|---|---|
| GLTF Binary | `.glb` | Arquivo local ou URL |
| GLTF | `.gltf` | Arquivo local ou URL |
| STL | `.stl` | Arquivo local ou URL |
| OBJ | `.obj` | Arquivo local ou URL |
| PLY | `.ply` | Arquivo local ou URL |

> Para publicação em páginas web, o formato recomendado é o `.glb`, pois mantém geometria, materiais e texturas em um único arquivo.

## 🧱 Arquitetura

A estrutura do projeto está organizada da seguinte forma:

```text
CAD-Viewer
│
├── src
│   ├── components
│   │   ├── CadViewerElement.ts
│   │   └── template.ts
│   │
│   ├── core
│   │   ├── CadScene.ts
│   │   ├── ModelDisposer.ts
│   │   └── ModelFitter.ts
│   │
│   ├── loaders
│   │   ├── CadModelLoader.ts
│   │   ├── FileExtension.ts
│   │   └── LoaderResult.ts
│   │
│   ├── types
│   │   └── cad-viewer-event.ts
│   │
│   └── index.ts
│
├── public
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🔍 Responsabilidade das pastas

### `components`

Contém o Web Component principal e a interface visual do plugin.

### `core`

Contém o gerenciamento da cena 3D, câmera, controles, posicionamento e descarte dos modelos.

### `loaders`

Contém os carregadores responsáveis por interpretar os diferentes formatos de arquivos.

### `types`

Contém as interfaces e tipagens dos eventos públicos do componente.

## ⚙️ Stack tecnológica

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![Web Components](https://img.shields.io/badge/Web%20Components-29ABE2?style=for-the-badge&logo=webcomponents.org&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)

## 📦 Instalação

Instale o pacote usando npm:

```bash
npm install @felipe-amorim-dev/cad-viewer
```

## 🚀 Uso básico

Importe o pacote no arquivo principal do projeto:

```typescript
import '@felipe-amorim-dev/cad-viewer';
```

Depois utilize o componente no HTML:

```html
<cad-viewer
  src="/models/peca.glb"
  show-grid="true"
  show-axes="false"
  auto-rotate="false"
  allow-file-selection="true">
</cad-viewer>
```

Defina o tamanho do visualizador:

```css
cad-viewer {
  display: block;
  width: 100%;
  height: 700px;
}
```

## 📂 Seleção de arquivo local

Para permitir que o usuário selecione um modelo no próprio computador:

```html
<cad-viewer
  allow-file-selection="true"
  show-grid="true">
</cad-viewer>
```

O arquivo é processado localmente no navegador e não é enviado para servidores externos.

## 🌐 Carregamento de um modelo por URL

Coloque o arquivo dentro da pasta pública da aplicação:

```text
public
└── models
    └── montagem.glb
```

Depois informe o caminho no componente:

```html
<cad-viewer
  src="/models/montagem.glb"
  allow-file-selection="false">
</cad-viewer>
```

## 🧑‍💻 Carregamento por TypeScript

```typescript
import {
  CadViewerElement
} from '@felipe-amorim-dev/cad-viewer';

const viewer =
  document.querySelector<CadViewerElement>(
    '#viewer'
  );

await viewer?.load('/models/montagem.glb');
```

HTML:

```html
<cad-viewer id="viewer"></cad-viewer>
```

## 📄 Carregamento de arquivo por código

```typescript
import {
  CadViewerElement
} from '@felipe-amorim-dev/cad-viewer';

const input =
  document.querySelector<HTMLInputElement>(
    '#model-file'
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

```html
<input
  id="model-file"
  type="file"
  accept=".glb,.gltf,.stl,.obj,.ply"
/>

<cad-viewer id="viewer"></cad-viewer>
```

## 🅰️ Uso com Angular

Instale o pacote:

```bash
npm install @felipe-amorim-dev/cad-viewer
```

Importe no arquivo principal:

```typescript
import '@felipe-amorim-dev/cad-viewer';
```

Em uma aplicação standalone:

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
      src="/models/peca.glb"
      show-grid="true"
      allow-file-selection="true">
    </cad-viewer>
  `
})
export class AppComponent {}
```

CSS:

```css
cad-viewer {
  display: block;
  width: 100%;
  height: 700px;
}
```

## ⚛️ Uso com React

Instale o pacote:

```bash
npm install @felipe-amorim-dev/cad-viewer
```

Importe o componente:

```tsx
import '@felipe-amorim-dev/cad-viewer';

export function App() {
  return (
    <cad-viewer
      src="/models/peca.glb"
      show-grid="true"
      allow-file-selection="true"
    />
  );
}
```

Para TypeScript, pode ser necessário declarar o elemento:

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

## 🟨 Uso com JavaScript puro

```html
<script
  type="module"
  src="./node_modules/@felipe-amorim-dev/cad-viewer/dist/cad-viewer.js">
</script>

<cad-viewer
  src="./models/peca.glb"
  show-grid="true">
</cad-viewer>
```

> Em projetos reais, é recomendado utilizar um bundler como Vite, Webpack, Parcel ou Rollup.

## 🎛️ Atributos disponíveis

| Atributo | Tipo | Padrão | Descrição |
|---|---|---|---|
| `src` | string | vazio | URL do modelo 3D |
| `background` | string | `#eef1f5` | Cor de fundo |
| `show-grid` | boolean | `true` | Exibe a grade |
| `show-axes` | boolean | `false` | Exibe os eixos |
| `auto-rotate` | boolean | `false` | Ativa a rotação automática |
| `allow-file-selection` | boolean | `true` | Permite selecionar um arquivo local |

Exemplo:

```html
<cad-viewer
  src="/models/montagem.glb"
  background="#f3f4f6"
  show-grid="true"
  show-axes="true"
  auto-rotate="false"
  allow-file-selection="false">
</cad-viewer>
```

## 🧰 Métodos públicos

### Carregar modelo por URL

```typescript
await viewer.load('/models/peca.glb');
```

### Carregar arquivo local

```typescript
await viewer.loadFile(file);
```

### Ajustar câmera ao modelo

```typescript
viewer.fitToModel();
```

### Reiniciar câmera

```typescript
viewer.resetView();
```

### Restaurar posição e rotação da peça

```typescript
viewer.resetModelTransform();
```

### Remover modelo

```typescript
viewer.removeModel();
```

## 📡 Eventos

O componente emite eventos personalizados para integração com a aplicação.

### Início do carregamento

```typescript
viewer.addEventListener(
  'cad-load-start',
  (event) => {
    console.log(event.detail.source);
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

### Modelo carregado

```typescript
viewer.addEventListener(
  'cad-loaded',
  (event) => {
    console.log(event.detail.source);
    console.log(event.detail.format);
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

### Alteração da peça

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

### Modelo removido

```typescript
viewer.addEventListener(
  'cad-model-removed',
  () => {
    console.log('Modelo removido');
  }
);
```

## 🔒 Privacidade

O CAD Viewer não possui backend e não armazena dados dos usuários.

Arquivos selecionados localmente:

```text
Arquivo do usuário
        ↓
Navegador
        ↓
Three.js
        ↓
Visualização
```

O plugin não envia o arquivo para uma API ou servidor externo.

Ao atualizar ou fechar a página, o arquivo local é removido da memória do navegador.

## ⚠️ Limitações atuais

- Arquivos GLTF com texturas externas podem exigir hospedagem dos arquivos auxiliares.
- O formato recomendado para distribuição é GLB.
- Arquivos muito grandes podem consumir bastante memória do navegador.
- STEP e IGES ainda não estão disponíveis.
- O plugin ainda não possui árvore de montagem.
- O plugin ainda não possui ferramenta de medição.

## 🗺️ Roadmap

Funcionalidades planejadas:

- [ ] Suporte a STEP e STP
- [ ] Suporte a IGES e IGS
- [ ] Integração com OpenCascade.js
- [ ] Processamento CAD em Web Worker
- [ ] Seleção individual de peças
- [ ] Destaque de componentes
- [ ] Árvore de montagem
- [ ] Ocultar e isolar componentes
- [ ] Vista explodida
- [ ] Ferramenta de medição
- [ ] Planos de corte
- [ ] Alteração de materiais e cores
- [ ] Captura de imagem
- [ ] Exportação para GLB
- [ ] Exemplos para Angular, React e Vue
- [ ] Página de demonstração com GitHub Pages

## 🛠️ Desenvolvimento local

Clone o repositório:

```bash
git clone https://github.com/Felipe-Amorim-Dev/CAD-Viewer.git
```

Entre na pasta:

```bash
cd CAD-Viewer
```

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

Confira os arquivos que serão publicados:

```bash
npm run pack:check
```

## 📦 Publicação de uma nova versão

O npm não permite publicar novamente uma versão existente.

Para correção de bugs:

```bash
npm version patch
```

Para uma nova funcionalidade compatível:

```bash
npm version minor
```

Para uma mudança incompatível:

```bash
npm version major
```

Depois:

```bash
git push
git push --tags
npm publish --access public
```

## 📚 Pacote npm

Instalação:

```bash
npm install @felipe-amorim-dev/cad-viewer
```

Nome do pacote:

```text
@felipe-amorim-dev/cad-viewer
```

Versão inicial:

```text
0.1.0
```

## 🤝 Contribuição

Contribuições são bem-vindas.

Para contribuir:

1. Faça um fork do projeto.
2. Crie uma branch:

```bash
git checkout -b feature/minha-funcionalidade
```

3. Faça as alterações.
4. Crie um commit:

```bash
git commit -m "feat: add new viewer feature"
```

5. Envie a branch:

```bash
git push origin feature/minha-funcionalidade
```

6. Abra um Pull Request.

## 📄 Licença

Este projeto está licenciado sob a licença MIT.

Consulte o arquivo [LICENSE](LICENSE) para mais informações.

## 👨‍💻 Autor

**Felipe Figueiredo Amorim**

Full Stack Developer

🔗 GitHub: https://github.com/Felipe-Amorim-Dev

🔗 LinkedIn: https://www.linkedin.com/in/felipe-amorim-dev/

🔗 npm: https://www.npmjs.com/~felipe-amorim-dev

## ⭐ Apoie o projeto

Caso o projeto seja útil, deixe uma estrela no repositório.

Isso ajuda outras pessoas a encontrarem o CAD Viewer.