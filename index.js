
const postcss = require('postcss');

module.exports = postcss.plugin('postcss-combine-media-query', opts => {
    /**
     * Extracts the numeric value of a min-width declaration.
     * @param {string} minWidthFragment A string fragment holding a min-width declaration.
     * @example
     * // returns 123
     * extractNumber('(min-width: 123px)');
     * @returns {Number} Returns the value of the given min-width declaration.
     */
    function extractNumber(minWidthFragment) {
        return parseInt(minWidthFragment.replace(/[^0-9]/g, ''));
    }
    
    /**
     * Checks if a string contains a media-query min-width declaration.
     * @param {string} sourceString The string to check.
     * @example
     * // returns true
     * extractNumber('foo (min-width: 123px) bar');
     * @returns {boolean} Returns a bool indicating whether the given string holds a min-width declaration.
     */
    function hasMinWidthDeclaration(sourceString) {
        return !!sourceString.match(/min-width: [0-9]+px/);
    }
    
    /**
     * Splits a string at logical 'and's (CSS media-query syntax) and removes any duplicated fragments.
     * @param {string} sourceFragment The string to split and remove duplicates from.
     * @returns {string[]} Returns an array holding all the unique split fragments.
     */
    function splitByLogicalAnd(sourceFragment) {
        // Split & remove duplicates
        return [... new Set(sourceFragment.split(' and '))];
    }
    
    /**
     * Reducer function to create an logically optimiised string.
     * Basically concats the currentFragment to the accumulator via 'and' (think .join('and')).
     * In case a min-width declaration comes in AND the accumulator (the target string) already holds a min-widthe declaration, it does not concat!
     * Instead it checks whether the next min-width is actually higher than the actual one. 
     * In that case the value in the accumulator makes no logical sense anymore and gets replaced.
     * @param {string} accumulator The accumulated target string.
     * @param {string} currentFragment The current fragment to concat/accumulate.
     * @returns {string} Returns the updated accumulator to be used in a reducer function.
     */
    function buildTargetString(accumulator, currentFragment) {
        if (hasMinWidthDeclaration(currentFragment) && hasMinWidthDeclaration(accumulator)) {
            return logicallyOptimiseMinWidthDeclarations(accumulator, currentFragment);
        }
        // If no min-width declarations are present, the string gets concated with 'and' again
        return accumulator += ` and ${currentFragment}`;
    }
    
    /**
     * A reducer function to check whether the accumulated string holds a higher min-width value or the current string fragment.
     * A higher value in the min-width declarations mean that it makes logically sense and has priority.
     * The lower value gets ditched (ignored or overwritten depending what's the case).
     * @param {string} accumulator The accumulated target string to compare the value to.
     * @param {string} currentFragment The current fragment holding the value to compare.
     * @returns {string} Returns the altered accumulator string to be further processed in a recducer function.
     */
    function logicallyOptimiseMinWidthDeclarations(accumulator, currentFragment) {
        if (extractNumber(currentFragment) < extractNumber(accumulator)) {
            return accumulator;
        }
        const numberRegex = /[0-9]+/;
        return accumulator.replace(numberRegex, currentFragment.match(numberRegex)[0]);
    }
    
    /**
     * Prepares the logical string fragments and further processes them when needed.
     * @param {string} sourceFragment The string fragment to be processed.
     * @returns {string} Returns the accumulated, altered and logically optimised string.
     */
    function manipulateLogicalFragments(sourceFragment) {
        // String doesn't meet optimisation requirements
        if (!!sourceFragment.match(/only|not/g)) {
            return sourceFragment;
        }
        // Split by logical operator and, remove duplicates and opmtimise
        return splitByLogicalAnd(sourceFragment).reduce(buildTargetString);
    }
    
    /**
     * Provides the user with the possibility to get rid of unnecessary duplicated min-widths.
     * Various use-cases (e.g. using this plugin or having nested media-queries in SASS) result in unnecessary min-width declarations. This is not only unnecessary code, but also can result in unexpected browser behaviour e.g. in IE11.
     * This function optimises these cases.
     * @param {string} atRuleParams The atRlue params to optimise as a string.
     * @example
     * ```CSS
     * // does not make any logical sense
     * @media (min-width: 480px) and (min-width: 768px)
     * // when processed with `optimiseMinWidth`
     * @media (min-width: 768px)
     * ```
     * @returns {string} The given parameters but optimised.
     */
    function optimiseMinWidth(atRuleParams) {
        const orFragments = atRuleParams.split(', ');
        // Don't add a comment to the first fragment
        orFragments[0] = manipulateLogicalFragments(orFragments[0]);
        // Add a comma in front of all the others tho
        return orFragments.reduce((output, orFragment) => `${output}, ${manipulateLogicalFragments(orFragment)}`);
    }

    let atRules = {};

    function addToAtRules(atRule) {
        const key = opts.optimiseQueries ? optimiseMinWidth(atRule.params) : atRule.params;

        if (!atRules[key]) {
            atRules[key] = postcss.atRule({ name: atRule.name, params: key });
        }
        atRule.nodes.forEach(node => {
            atRules[key].append(node.clone());
        });

        atRule.remove();
    }

    return root => {

        root.walkAtRules('media', atRule => {
            addToAtRules(atRule);
        });

        Object.keys(atRules).forEach(key => {
            root.append(atRules[key]);
        });

        atRules = {};
    };
});
