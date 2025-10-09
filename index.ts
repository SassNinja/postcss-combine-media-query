
import postcss, { Root, AtRule, ChildNode } from 'postcss';

const plugin = (opts = {}) => {

    let atRules: Record<string, AtRule> = {};

    function addToAtRules(atRule: AtRule, parentParams?: string) {
        const key = parentParams ? `${parentParams} and ${atRule.params}` : atRule.params;
        const childNodes: ChildNode[] = [];

        atRule.nodes?.forEach((node) => {
            if (node.type === 'atrule' && node.name === 'media') {
                addToAtRules(node, key);
            } else {
                childNodes.push(node);
            }
        });

        if (childNodes.length) {
            if (!atRules[key]) {
                atRules[key] = postcss.atRule({ name: atRule.name, params: key });
            }
            childNodes.forEach((node) => {
                atRules[key].append(node.clone());
            });
        }

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
