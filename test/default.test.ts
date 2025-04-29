import postcss, { Document, Root } from 'postcss';
import plugin from '../index';
import data from './default.data';

let root: Document | Root;

beforeAll(() => {
    root = postcss([plugin()]).process(data).root;
});

test('should combine equal media rules', () => {
    let count = 0;

    root.walkAtRules('media', (rule) => {
        count++;
    });

    expect(count).toBe(3);
});

test('should move all media rules to the end', () => {
    let endsWithMedia = false;

    for (const node of root.nodes) {
        endsWithMedia = node.type == 'atrule' && node.name === 'media'
    }

    expect(endsWithMedia).toBe(true);
});
