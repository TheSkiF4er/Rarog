# Laravel + Rarog Starter

Черновой пример интеграции Rarog в Laravel-проект.

## Шаги интеграции

1. В вашем Laravel-проекте установите Rarog:
   ```bash
   npm install rarog --save-dev
   ```

2. Добавьте скрипт сборки в `package.json` Laravel-проекта:
   ```json
   {
     "scripts": {
       "rarog:build": "rarog build"
     }
   }
   ```

3. Создайте `rarog.config.js` в корне Laravel-проекта:
   ```js
   module.exports = {
     mode: "jit",
     content: [
       "./resources/views/**/*.blade.php",
       "./resources/js/**/*.{js,jsx,ts,tsx,vue}"
     ],
     theme: { /* ...базовая тема или своя */ },
     screens: { /* ... */ }
   };
   ```

4. Запустите сборку:
   ```bash
   npx rarog build
   ```

5. Подключите CSS в `resources/views/layouts/app.blade.php`:
   ```blade
   <link rel="stylesheet" href="{{ mix('/css/rarog.jit.css') }}">
   ```

6. Используйте классы Rarog в Blade-шаблонах:
   ```blade
   <div class="rg-container-lg py-6">
     <div class="card">
       <div class="card-header">Rarog + Laravel</div>
       <div class="card-body">
         <p class="text-muted">Пример интеграции CSS-фреймворка в Blade.</p>
       </div>
     </div>
   </div>
   ```

Данная папка носит справочный характер: вы можете скопировать указанные конфиги и разметку
в свой Laravel-проект.
