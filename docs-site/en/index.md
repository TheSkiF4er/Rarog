# Getting Started

Rarog is a modern CSS framework that combines **design tokens**, **utilities**,
**components**, and a **vanilla JS core**. It is designed as an alternative to
“Tailwind + Bootstrap” and tightly integrates with the Cajeer ecosystem — but
can be used in any stack.

## Installation

### Via npm

```bash
npm install rarog
# or
yarn add rarog
```

### Include in your build

```js
import 'rarog/dist/rarog.css'
import { Rarog } from 'rarog/dist/rarog.esm.js'

Rarog.init()
```

### CDN (MVP)

If you just want to play with Rarog in a prototype:

```html
<link rel="stylesheet" href="https://unpkg.com/rarog/dist/rarog.css" />
<script type="module" src="https://unpkg.com/rarog/dist/rarog.esm.js"></script>
```

## Next steps

- Read **Why Rarog** to understand positioning.
- Explore **Tokens** and **Utilities**.
- Check a **React** or **Laravel** guide to plug Rarog into your stack.
