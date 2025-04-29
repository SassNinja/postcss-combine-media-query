
import postcss, { Root, AtRule } from 'postcss';

const plugin = (opts = {}) => {

    let atRules: Record<string, AtRule> = {};

    function addToAtRules(atRule: AtRule) {
        const key = atRule.params;

        if (!atRules[key]) {
            atRules[key] = postcss.atRule({ name: atRule.name, params: atRule.params });
        }
        atRule.nodes?.forEach((node) => {
            atRules[key].append(node.clone());
        });

        atRule.remove();
    }

    return {
        postcssPlugin: 'postcss-combine-media-query',
        Once(root: Root) {
            root.walkAtRules('media', (atRule) => {
                addToAtRules(atRule);
            });
            Object.keys(atRules).forEach((key) => {
                root.append(atRules[key]);
            });
            atRules = {};
        },
    };
};

plugin.postcss = true;

export = plugin;
