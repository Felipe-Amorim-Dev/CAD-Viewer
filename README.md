<h1 align="center">🧩 CAD Viewer</h1>

<p align="center"><em>Visualizador de modelos CAD 3D como Web Component.</em></p>

<p align="center">🇧🇷 Português | 🇺🇸 <a href="README.en.md">English</a></p>

<p align="center"><img src="https://img.shields.io/badge/license-MIT-006bed?style=flat-square" alt="MIT" /> <img src="https://img.shields.io/github/last-commit/Felipe-Amorim-Dev/CAD-Viewer?style=flat-square&color=006bed" alt="Last commit" /></p>

<p align="center"><a href="#sobre">Sobre</a> • <a href="#tecnologias">Tecnologias</a> • <a href="#como-rodar">Como rodar</a> • <a href="#licenca">Licença</a> • <a href="#autor">Autor</a></p>

---

<a id="sobre"></a>
## 📖 Sobre

Plugin TypeScript que utiliza Three.js para exibir modelos GLB, glTF, STL, OBJ e PLY no navegador. Oferece rotação, zoom, movimento da câmera, carregamento de arquivos locais e por URL.

## ✨ Funcionalidades

- Carregamento local e remoto de modelos
- Câmera com rotação, zoom e pan
- Visualização de grade e eixos
- Eventos de carregamento e erro

<a id="tecnologias"></a>
## 🛠️ Tecnologias

![TypeScript 6](https://img.shields.io/badge/TypeScript_6-006bed?style=for-the-badge) ![Three.js 0.185](https://img.shields.io/badge/Three.js_0.185-006bed?style=for-the-badge) ![Vite 8](https://img.shields.io/badge/Vite_8-006bed?style=for-the-badge) ![Web Components](https://img.shields.io/badge/Web_Components-006bed?style=for-the-badge)

## 📦 Pré-requisitos

Node.js e npm compatíveis com Vite 8.

<a id="como-rodar"></a>
## 🚀 Como rodar

```bash
git clone https://github.com/Felipe-Amorim-Dev/CAD-Viewer.git
cd CAD-Viewer
npm ci
npm run build
npm run dev
```

## 📦 Utilização da biblioteca

```bash
npm install @felipe-amorim-dev/cad-viewer
```

```html
<cad-viewer src="/models/peca.glb" allow-file-selection="true"></cad-viewer>
```

<a id="licenca"></a>
## 📄 Licença

Distribuído sob a [licença MIT](LICENSE).

<a id="autor"></a>
## 👤 Autor

**Felipe Figueiredo Amorim** — Desenvolvedor Full Stack.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Felipe%20Amorim-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/felipe-amorim-dev/) [![E-mail](https://img.shields.io/badge/E--mail-contato-006bed?style=for-the-badge)](mailto:felipe.f.amorim@outlook.com)

<p align="center"><strong>Obrigado por visitar! / Thanks for visiting!</strong></p>
