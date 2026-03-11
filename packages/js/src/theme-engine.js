export function applyTheme(target, themeName) {
  const node = target || document.documentElement;
  if (!node) return;
  if (!themeName) node.removeAttribute('data-rg-theme');
  else node.setAttribute('data-rg-theme', themeName);
}

export function diffThemes(left, right, prefix = '', out = []) {
  const leftObj = left && typeof left === 'object' ? left : {};
  const rightObj = right && typeof right === 'object' ? right : {};
  const keys = Array.from(new Set([...Object.keys(leftObj), ...Object.keys(rightObj)])).sort();
  keys.forEach((key) => {
    const path = prefix ? `${prefix}.${key}` : key;
    const a = leftObj[key];
    const b = rightObj[key];
    if (a && b && typeof a === 'object' && typeof b === 'object' && !Array.isArray(a) && !Array.isArray(b)) {
      diffThemes(a, b, path, out);
    } else if (JSON.stringify(a) !== JSON.stringify(b)) {
      out.push({ key: path, before: a, after: b });
    }
  });
  return out;
}

export function validateTheme(theme) {
  const required = ['bg','bgSoft','bgElevated','bgElevatedSoft','surface','border','borderSubtle','borderStrong','muted','text','textMuted','focusRing','accentSoft'];
  const semantic = theme?.semantic?.color || {};
  return {
    valid: required.every((key) => semantic[key] != null),
    missing: required.filter((key) => semantic[key] == null)
  };
}
