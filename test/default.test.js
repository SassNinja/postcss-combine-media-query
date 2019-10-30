
const postcss = require('postcss');
const plugin = require('../index');
const data = require('./default.data');

let root;

beforeAll(() => {
    root = postcss([plugin()]).process(data).root;
});

test('should combine equal media rules', () => {
    let count = 0;

    root.walkAtRules('media', rule => {
        count++;
    });
    expect(count).toBe(3);
});

test('should move all media rules to the end', () => {
    let endsWithMedia = true;
    let hasMedia = false;

    root.nodes.forEach(node => {
        if (node.name === 'media') {
            hasMedia = true;
        }
        if (hasMedia && node.name !== 'media') {
            endsWithMedia = false;
        }
        expect(endsWithMedia).toBe(true);
    });
});
