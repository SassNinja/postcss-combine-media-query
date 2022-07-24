
const postcss = require('postcss');

module.exports = (opts = {}) => {

    let atRules = {};

    function addToAtRules(atRule) {
        const key = atRule.params;

        if (!atRules[key]) {
            atRules[key] = postcss.atRule({ name: atRule.name, params: atRule.params });
        }
        atRule.nodes.forEach(node => {
            atRules[key].append(node.clone());
        });

        atRule.remove();
    }

    const combineMediaQuery = root => {
        root.walkAtRules('media', atRule => {
            addToAtRules(atRule);
        });

        Object.keys(atRules).forEach(key => {
            root.append(atRules[key]);
        });

        atRules = {};
    };

    return {
      postcssPlugin: 'postcss-combine-media-query',
      Once: combineMediaQuery
    };
};

module.exports.postcss = true;
