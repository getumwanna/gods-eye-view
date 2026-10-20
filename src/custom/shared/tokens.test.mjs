import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../../../design/tokens.css', import.meta.url), 'utf8');
// shared/ -> custom/ -> src/ -> repository root
const parse = (block) => Object.fromEntries([...block.matchAll(/--gih-([\w-]+):\s*(#[\da-f]{6})/gi)].map((m) => [m[1], m[2]]));
const luminance = (hex) => hex.slice(1).match(/../g).map((v) => parseInt(v, 16) / 255)
  .map((v) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
  .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
const contrast = (a, b) => { const [high, low] = [luminance(a), luminance(b)].sort((a, b) => b - a); return (high + 0.05) / (low + 0.05); };

test('both themes distinguish Refreshed from accent and provide readable status text', () => {
  const [darkBlock, lightBlock] = css.split(/\[data-gih-theme=['"]light['"]\]/);
  const dark = parse(darkBlock);
  const light = { ...dark, ...parse(lightBlock) };
  for (const theme of [dark, light]) {
    assert.notEqual(theme['kind-refreshed'].toLowerCase(), theme.accent.toLowerCase());
    for (const text of ['text', 'muted', 'link', 'kind-live', 'kind-refreshed', 'kind-simulated', 'kind-estimated', 'kind-static']) {
      for (const surface of ['bg', 'panel']) {
        assert.ok(contrast(theme[text], theme[surface]) >= 4.5, `${text} on ${surface}`);
      }
    }
    assert.ok(contrast(theme['accent-ink'], theme.accent) >= 4.5);
  }
});
