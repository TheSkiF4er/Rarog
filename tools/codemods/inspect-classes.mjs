import fs from 'fs';

const BOOTSTRAP = /^(container|row|col(?:-[a-z]+)?-?\d*|g-[0-5]|d-flex|justify-content-|align-items-|text-start|text-end|fw-|rounded|shadow|position-|top-0|bottom-0|start-0|end-0|w-100|h-100|btn|alert|badge)/;
const TAILWIND = /^(flex|inline-flex|grid|hidden|block|inline-block|items-|justify-|text-(left|center|right)|font-|rounded|shadow|absolute|relative|fixed|sticky|top-0|bottom-0|left-0|right-0|w-full|h-full|sr-only|not-sr-only|[mp][trblxy]?-[^\s]+|(?:bg|text|border)-[a-z]+-(?:50|100|200|300|400|500|600|700|800|900)|(?:hover|focus|active|disabled|sm|md|lg|xl|2xl):)/;
const RAROG = /^(rg-|d-|items-|justify-|text-|font-|rounded|shadow|absolute|relative|fixed|sticky|top-0|bottom-0|left-0|right-0|w-full|h-full|sr-only|not-sr-only|(?:hover|focus|active|disabled|sm|md|lg|xl|2xl):)/;

function extractClasses(content) {
  const matches = [...content.matchAll(/class(?:Name)?=(['"])(.*?)\1/gs)];
  return matches.flatMap((m) => m[2].split(/\s+/).filter(Boolean));
}

export function inspectClassFiles(files) {
  const all = [];
  files.forEach((file) => {
    const content = fs.readFileSync(file, 'utf8');
    all.push(...extractClasses(content));
  });
  const unique = [...new Set(all)];
  const buckets = {
    rarog: unique.filter((t) => RAROG.test(t)).sort(),
    bootstrap: unique.filter((t) => BOOTSTRAP.test(t)).sort(),
    tailwind: unique.filter((t) => TAILWIND.test(t)).sort(),
    unknown: unique.filter((t) => !RAROG.test(t) && !BOOTSTRAP.test(t) && !TAILWIND.test(t)).sort()
  };
  return {
    files,
    counts: Object.fromEntries(Object.entries(buckets).map(([k, v]) => [k, v.length])),
    buckets
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const files = process.argv.slice(2);
  if (!files.length) {
    console.error('Usage: node tools/codemods/inspect-classes.mjs <file...>');
    process.exit(1);
  }
  console.log(JSON.stringify(inspectClassFiles(files), null, 2));
}
