
const postcss = require('postcss');
const plugin = require('../index');
const data = require('./default.data');

let root;

beforeAll(() => {
    root = postcss([plugin({
        optimiseQueries: true
    })]).process(data).root;
});

test('should combine equal media rules', () => {
    let count = 0;

    root.walkAtRules('media', rule => {
        count++;
    });
    expect(count).toBe(6);
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

test('should optimise logical-and concated min-width declarations', () => {
    let processedRuleParams = [
        //  @media (min-width: 480px) and (min-width: 768px)
        '(min-width: 768px)',
        // @media screen and (min-width: 480px) and screen and (min-width: 768px)
        'screen and (min-width: 768px)',
        // @media (min-width: 480px) and (min-width: 768px), screen and (min-width: 1024px), screen and (min-width: 480px) and screen and (min-width: 768px)
        '(min-width: 768px), screen and (min-width: 1024px), screen and (min-width: 768px)'
    ]
    root.walkAtRules('media', rule => {
        processedRuleParams = processedRuleParams.filter(ruleParam => ruleParam !== rule.params);
    });
    expect(processedRuleParams).toStrictEqual([]);
});
