import fs from 'fs';

export const tailwindMappings = {
  'flex': 'd-flex',
  'inline-flex': 'd-inline-flex',
  'grid': 'd-grid',
  'hidden': 'd-none',
  'block': 'd-block',
  'inline-block': 'd-inline-block',
  'items-center': 'items-center',
  'items-start': 'items-start',
  'items-end': 'items-end',
  'justify-between': 'justify-between',
  'justify-center': 'justify-center',
  'justify-start': 'justify-start',
  'justify-end': 'justify-end',
  'text-left': 'text-left',
  'text-center': 'text-center',
  'text-right': 'text-right',
  'font-bold': 'font-bold',
  'font-semibold': 'font-semibold',
  'rounded': 'rounded',
  'rounded-md': 'rounded-md',
  'rounded-lg': 'rounded-lg',
  'rounded-full': 'rounded-full',
  'shadow': 'shadow-sm',
  'shadow-md': 'shadow-md',
  'shadow-lg': 'shadow-lg',
  'absolute': 'absolute',
  'relative': 'relative',
  'fixed': 'fixed',
  'sticky': 'sticky',
  'top-0': 'top-0',
  'bottom-0': 'bottom-0',
  'left-0': 'left-0',
  'right-0': 'right-0',
  'w-full': 'w-full',
  'h-full': 'h-full',
  'sr-only': 'sr-only',
  'not-sr-only': 'not-sr-only'
};

function mapTailwindClass(token) {
  if (tailwindMappings[token]) return { replacement: tailwindMappings[token], reason: 'direct' };
  const spacing = token.match(/^(m|mx|my|mt|mr|mb|ml|p|px|py|pt|pr|pb|pl)-(.+)$/);
  if (spacing) return { replacement: token, reason: 'spacing-compatible' };
  const color = token.match(/^(bg|text|border)-([a-z]+)-(50|100|200|300|400|500|600|700|800|900)$/);
  if (color) return { replacement: token, reason: 'palette-compatible' };
  const state = token.match(/^(hover|focus|active|disabled|sm|md|lg|xl|2xl):(.+)$/);
  if (state) return { replacement: token, reason: 'variant-compatible' };
  return null;
}

export function migrateTailwindSource(source) {
  const seen = new Map();
  const migrated = source.replace(/class(?:Name)?=(['"])(.*?)\1/gs, (full, quote, value) => {
    const originalTokens = value.split(/\s+/).filter(Boolean);
    const nextTokens = [];
    originalTokens.forEach((token) => {
      const mapped = mapTailwindClass(token);
      if (mapped) {
        seen.set(token, mapped.replacement);
        nextTokens.push(mapped.replacement);
      } else {
        nextTokens.push(token);
      }
    });
    return full.replace(value, [...new Set(nextTokens)].join(' '));
  });
  return {
    code: migrated,
    changes: [...seen.entries()].map(([from, to]) => ({ from, to }))
  };
}

export function runTailwindMigration({ input, output, write = false }) {
  const source = fs.readFileSync(input, 'utf8');
  const result = migrateTailwindSource(source);
  const target = output || input;
  if (write) {
    fs.mkdirSync(target.includes('/') ? target.slice(0, target.lastIndexOf('/')) : '.', { recursive: true });
    fs.writeFileSync(target, result.code, 'utf8');
  }
  return result;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const input = args[0];
  const output = args[1];
  const write = args.includes('--write');
  if (!input) {
    console.error('Usage: node tools/codemods/tailwind-to-rarog.mjs <input> [output] [--write]');
    process.exit(1);
  }
  const result = runTailwindMigration({ input, output, write });
  console.log(JSON.stringify(result, null, 2));
}
