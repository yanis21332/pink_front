'use client';

import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    --noir: #1b1613;
    --noir-soft: #2a2320;
    --beige: #b3895b;
    --beige-soft: #e9dcc8;
    --blanc: #fbf8f3;
    --rouge: #b23b3b;
    --rose: #e7b7be;
    --paper: #f6f1e9;
    --ink: #241f1b;
    --ink-dim: #847a70;
    --line: #e3d9c8;
    --ok: #7a8a5e;
    --radius: 14px;
    --shadow: 0 10px 30px -12px rgba(27, 22, 19, 0.25);
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Fraunces', serif;
    background: var(--paper);
    color: var(--ink);
    min-height: 100vh;
    overflow-x: hidden;
  }

  h1, h2, h3, .display {
    font-family: var(--font-fraunces), 'Fraunces', serif;
  }

  .mono {
    font-family: var(--font-ibm-mono), 'IBM Plex Mono', monospace;
  }

  @media (max-width: 768px) {
    body {
      font-size: 14px;
    }
  }
`;

export default GlobalStyle;
