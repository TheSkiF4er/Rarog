import fs from 'fs';

export const bootstrapMappings = {
  'container': 'container',
  'row': 'rg-row',
  'col': 'rg-col',
  'col-12': 'rg-col-12',
  'col-md-6': 'rg-col-md-6',
  'col-md-4': 'rg-col-md-4',
  'g-0': 'rg-gap-0',
  'g-1': 'rg-gap-1',
  'g-2': 'rg-gap-2',
  'g-3': 'rg-gap-3',
  'g-4': 'rg-gap-4',
  'g-5': 'rg-gap-5',
  'd-flex': 'd-flex',
  'd-grid': 'd-grid',
  'justify-content-between': 'justify-between',
  'justify-content-center': 'justify-center',
  'align-items-center': 'items-center',
  'text-start': 'text-left',
  'text-end': 'text-right',
  'text-center': 'text-center',
  'fw-bold': 'font-bold',
  'fw-semibold': 'font-semibold',
  'rounded': 'rounded',
  'rounded-0': 'rounded-none',
  'rounded-pill': 'rounded-full',
  'shadow': 'shadow-sm',
  'shadow-sm': 'shadow-sm',
  'shadow-lg': 'shadow-lg',
  'position-relative': 'relative',
  'position-absolute': 'absolute',
  'top-0': 'top-0',
  'bottom-0': 'bottom-0',
  'start-0': 'left-0',
  'end-0': 'right-0',
  'w-100': 'w-full',
  'h-100': 'h-full',
  'btn': 'btn',
  'btn-primary': 'btn btn-primary',
  'btn-outline-primary': 'btn btn-outline-primary',
  'alert': 'alert',
  'alert-primary': 'alert alert-primary',
  'badge': 'badge',
  'badge text-bg-primary': 'badge bg-primary'
};

const spacingPrefixes = ['m', 'mt', 'mb', 'ms', 'me', 'mx', 'my', 'p', 'pt', 'pb', 'ps', 'pe', 'px', 'py'];
const spacingAxis = { m: 'm', mt: 'mt', mb: 'mb', ms: 'ml', me: 'mr', mx: 'mx', my: 'my', p: 'p', pt: 'pt', pb: 'pb', ps: 'pl', pe: 'pr', px: 'px', py: 'py' };

function mapBootstrapClass(token) {
  if (bootstrapMappings[token]) return { replacement: bootstrapMappings[token], reason: 'direct' };
  const m = token.match(/^(m|mt|mb|ms|me|mx|my|p|pt|pb|ps|pe|px|py)-([0-5]|auto)$/);
  if (m) {
    const [, prefix, value] = m;
    const axis = spacingAxis[prefix] || prefix;
    return { replacement: `${axis}-${value}`, reason: 'spacing' };
  }
  return null;
}

export function migrateBootstrapSource(source) {
  const seen = new Map();
  const migrated = source.replace(/class(?:Name)?=(['"])(.*?)\1/gs, (full, quote, value) => {
    const originalTokens = value.split(/\s+/).filter(Boolean);
    const nextTokens = [];
    originalTokens.forEach((token) => {
      const mapped = mapBootstrapClass(token);
      if (mapped) {
        seen.set(token, mapped.replacement);
        mapped.replacement.split(/\s+/).forEach((part) => part && nextTokens.push(part));
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

export function runBootstrapMigration({ input, output, write = false }) {
  const source = fs.readFileSync(input, 'utf8');
  const result = migrateBootstrapSource(source);
  if (write && output) {
    fs.mkdirSync(new URL('.', `file://${output}`).pathname, { recursive: true });
  }
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
    console.error('Usage: node tools/codemods/bootstrap-to-rarog.mjs <input> [output] [--write]');
    process.exit(1);
  }
  const result = runBootstrapMigration({ input, output, write });
  console.log(JSON.stringify(result, null, 2));
}
