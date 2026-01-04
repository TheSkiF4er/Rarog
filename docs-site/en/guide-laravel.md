# Laravel Guide (EN)

Rarog plays well with Laravel + Vite (or Mix) setups.

## Install

```bash
npm install rarog --save-dev
```

## Configure Vite

In your `resources/js/app.js`:

```js
import 'rarog/dist/rarog.css'
import { Rarog } from 'rarog/dist/rarog.esm.js'

Rarog.init()
```

In `vite.config.js` make sure your content paths for JIT include Blade templates:

```js
import rarog from 'rarog/vite-plugin';

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/css/app.css', 'resources/js/app.js'],
      refresh: true,
    }),
    rarog({
      mode: 'jit',
      content: ['./resources/**/*.blade.php', './resources/**/*.js']
    })
  ]
});
```

Then you can use Rarog classes directly in your Blade views:

```blade
<div class="rg-container-lg py-8">
  <h1 class="text-3xl font-bold mb-4">Dashboard</h1>
  <x-alert type="success">
    You are logged in!
  </x-alert>
</div>
```
