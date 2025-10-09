import postcss, { Document, Root } from 'postcss';
import plugin from '../index';
import data from './nested.data';

let root: Document | Root;

beforeAll(() => {
    root = postcss([plugin()]).process(data).root;
});

test('should not emit nested media rules twice', () => {
    let count = 0;

    root.walkAtRules('media', (rule) => {
        count++;
    });

    expect(count).toBe(2);
});

test('should combine nested media rules with "and"', () => {
    let hasCombinedMedia = false;

    root.walkAtRules('media', (rule) => {
        if (rule.params === '(min-width: 1024px) and (min-width: 1200px)') {
            hasCombinedMedia = true;
        }
    });

    expect(hasCombinedMedia).toBe(true);
});
