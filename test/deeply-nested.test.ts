import postcss, { Document, Root } from 'postcss';
import plugin from '../index';
import data from './deeply-nested.data';

let root: Document | Root;

beforeAll(() => {
    root = postcss([plugin()]).process(data).root;
});

test('should not emit deeply nested media rules twice', () => {
    let count = 0;

    root.walkAtRules('media', () => {
        count++;
    });

    expect(count).toBe(1);
});

test('should combine deeply nested media rules with "and"', () => {
    let hasCombinedMedia = false;

    root.walkAtRules('media', (rule) => {
        if (rule.params === '(min-width: 800px) and (orientation: landscape) and (min-width: 1200px)') {
            hasCombinedMedia = true;
        }
    });

    expect(hasCombinedMedia).toBe(true);
});


