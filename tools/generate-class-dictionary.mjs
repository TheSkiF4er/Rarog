/*!
 * Rarog class dictionary generator
 *
 * Задача: собрать список утилит и компонентных классов Rarog
 * и сохранить их в JSON для IDE/плагинов.
 *
 * Запуск:
 *   node tools/generate-class-dictionary.mjs
 */

import fs from "fs";
import path from "path";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");

function loadTokens() {
  const raw = fs.readFileSync(path.join(ROOT_DIR, "rarog.tokens.json"), "utf8");
  const json = JSON.parse(raw);
  return json.tokens;
}

function buildClasses() {
  const tokens = loadTokens();
  const classes = [];

  const push = (className, description, category) => {
    classes.push({ className, description, category });
  };

  // Базовые компоненты и utilities
  [
    ["btn", "Базовая кнопка Rarog", "component"],
    ["btn-primary", "Основная акцентная кнопка", "component"],
    ["btn-secondary", "Вторичная кнопка", "component"],
    ["alert", "Базовый алерт", "component"],
    ["alert-success", "Успешный алерт", "component"],
    ["card", "Карточка контента", "component"],
    ["navbar", "Навигационная панель (Navbar)", "component"],
    ["offcanvas", "Offcanvas / Drawer панель", "component"],
    ["modal", "Модальное окно", "component"],
    ["toast", "Toast-уведомление", "component"],
    ["rg-container", "Контейнер сетки Rarog", "layout"],
    ["rg-row", "Строка сетки Rarog", "layout"],
    ["rg-col-6", "Колонка сетки (6/12)", "layout"],
    ["prose", "Контентный блок типографики (@rarog/plugin-typography)", "plugin"]
  ].forEach(([name, desc, cat]) => push(name, desc, cat));

  // Цветовые классы bg-*/text-* по primary/secondary/etc
  const colorScales = ["primary", "secondary", "success", "danger", "warning", "info"];
  const shades = ["50","100","200","300","400","500","600","700","800","900"];

  for (const scale of colorScales) {
    for (const shade of shades) {
      const tokenPath = `color.${scale}.${shade}`;
      const value = tokens?.color?.[scale]?.[shade];
      if (!value) continue;
      push(`bg-${scale}-${shade}`, `Фоновый цвет ${scale}-${shade} (${value})`, "color");
      push(`text-${scale}-${shade}`, `Цвет текста ${scale}-${shade} (${value})`, "color");
      push(`border-${scale}-${shade}`, `Цвет границы ${scale}-${shade} (${value})`, "color");
    }
  }

  // Spacing → отступы и gap
  const spacing = tokens.spacing || {};
  const spacingKeys = Object.keys(spacing);
  for (const key of spacingKeys) {
    const value = spacing[key];
    push(`mt-${key}`, `Внешний отступ сверху (${value})`, "spacing");
    push(`mb-${key}`, `Внешний отступ снизу (${value})`, "spacing");
    push(`ml-${key}`, `Внешний отступ слева (${value})`, "spacing");
    push(`mr-${key}`, `Внешний отступ справа (${value})`, "spacing");
    push(`p-${key}`, `Внутренний отступ (${value})`, "spacing");
    push(`gap-${key}`, `Интервал между элементами (${value})`, "spacing");
  }

  // Несколько state/variant-примеров
  [
    ["hover:bg-primary", "Фон primary при наведении", "state"],
    ["focus:border-primary", "Граница primary при фокусе", "state"],
    ["group-hover:bg-primary", "Фон primary при hover на .group", "variant"],
    ["peer-checked:bg-primary", "Фон primary, если peer чекнут", "variant"],
    ["data-[state=open]:bg-primary", "Фон primary при data-state="open"", "variant"]
  ].forEach(([name, desc, cat]) => push(name, desc, cat));

  return classes;
}

function main() {
  const classes = buildClasses();
  const outDir = path.join(ROOT_DIR, "tools", "vscode-rarog");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  const outPath = path.join(outDir, "rarog-classmap.json");
  fs.writeFileSync(outPath, JSON.stringify(classes, null, 2), "utf8");
  console.log("[rarog] Class dictionary written to", outPath);
}

main();
