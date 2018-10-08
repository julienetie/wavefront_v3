import store from './store';
import { 
    fastDOM, 
    hasDuplicate, 
    hypenatedToCamelCase, 
    createFragment,
    isFirstUpperCase,
    isFirstAlpha
} from './helpers';
const { isArray } = Array;

/** 
 * Optimised reads.
 * @param {Function} callback.  
 * @return {number} job reference. 
 */
const read = callback => fastDOM.measure(() => callback());

/** 
 * Optimised writes.
 * @param {Function} callback.  
 * @return {number} job reference. 
 */
const write = callback => fastDOM.mutate(() => callback());

/** 
 * Kills a scheduled job.
 * @param {number} ref - job reference. 
 */
const kill = ref => fastDOM.clear(ref);

/** 
 * Get the nested selector for each element of an array.
 * @param {Array} elementArray.
 * @param {string} selector.
 * @returns {Array} new element array. 
 */
const queryEach = (elementArray, selector) =>
    elementArray.map(element => element.querySelector(selector));

/** 
 * Get the nested matching selectors for each element of an array.
 * @param{Array} elementArray.
 * @param{string} selector.
 * @returns{Array} new element array. 
 */
const queryEachAll = (elementArray, selector) =>
    elementArray.map(element => element.querySelectorAll(selector));

/** 
 * Get the matching ancestor for each element in an array.
 * @param{Array} elementArray.
 * @param{string} selector.
 * @returns{Array} new element array. 
 */
const eachClosest = (elementArray, selector) =>
    elementArray.map(element => element.closest(selector));


/** 
 * Get children as an Array.
 * @returns {Array} new element array. 
 */
const children = element => Array.from(element.children);

/** 
 * Get childNode as an Array.
 * @returns {Array} new element array. 
 */
const childNodes = element => Array.from(element.childNodes);

/** 
 * querySelectorAll as an Array
 * @param {string} selector.
 * @returns {Array} new element array. 
 */
const queryAll = (element, selector) => Array.from(element.querySelectorAll(selector));

/** 
 * Get siblings Array
 * @returns {Array} new element array. 
 */
const siblings = element => Array.from(element.parentElement.children)
    .filter(child => child !== element);

/** 
 * Get siblings Key Entries
 * @returns {Array} new element array. 
 */
const siblingsKeys = element => Array.from(element.parentElement.children)
    .reduce((acc, child, i) => {
        if (child !== element) {
            acc.push([i, child]);
        }
        return acc;
    }, []);

/** 
 * Get specific ancestor by generation.
 * @param {number} level - the generation by depth.
 * @returns {Object} element. 
 */
const ancestor = (element, level) => {
    let count = 0;
    const getParent = node => {
        count++;
        const parent = node.parentElement;
        if (count === level) {
            return parent;
        } else {
            return getParent(parent);
        }
    }
    return getParent(element);
}

/** 
 * @author Julien Etienne. 
 * {@link https://github.com/julienetie}.
 * @param {Object} target - Target object to aquire properties of sources.
 * @param {...Object|...String} sources - The objects or strings to be assigned.
 * @return {Object} The target object.
 */
const aquire = (target, ...sources) => {
    const sourcesLength = sources.length;
    for (let i = 0; i < sourcesLength; i++) {
        const source = sources[i];
        if (typeof source === 'object' || typeof source === 'string') {
            const keys = Object.keys(source);
            const keysLength = keys.length;
            for (let j = 0; j < keysLength; j++) {
                const key = keys[j];
                target[key] = source[key];
            }
        } else {
            return target;
        }
    }
    return target;
}

/** 
 * Assign styles by object sources.
 * @param {...Object} sources - A list of objects to be assigned.
 */
const style = (element, ...sources) => void aquire(element.style, ...sources);


/**
 * Add or remove a data attribute
 */
const swap = (element, dataKey, state) => {
    const key = hypenatedToCamelCase(dataKey);
    return state ? element.dataset[key] = '' :
        delete element.dataset[key];
};

/**
 * Add or remove a data attribute
 */
const toggle = (element, dataKey) => {
    const key = hypenatedToCamelCase(dataKey);
    return element.dataset[key] === '' ? delete element.dataset[key] :
        element.dataset[key] = '';
};

/** 
 * Cycles throught an array of values infinitely to set as a dataset value.
 */
const cycle = (element, dataKey, values) => {
    let index = 0;
    return () => {
        console.log('index', index)
        element.dataset[hypenatedToCamelCase(dataKey)] = values[index];

        if (index < values.length - 1) {
            index++;

        } else {
            index = 0;
        }

    }
}

/** 
 * Gracefully transition the zIndex of an element.
 * @param {Object} style - The style transformations to apply. 
 * @param {number} zIndex - The elevation level by z-index.
 * @callback {Function} callback - Transition end callback.
 */
/*const elevate = (element, style, zIndex, callback) => {
    element.addEventListener("transitionend", element => {
        // 2. update zIndex 
        write(() => {
            aquire(element.style, { zIndex })
            // 3. Action callback                
            callback(element);

            // remove event listener.???
        });
    }, false);
    // 1. Set style.
    write(() => void aquire(element.style, style));
}*/


/** 
 * @param {string} strings - String parts of the template literal.
 * @param {*} tags - Value parts of the template literal.
 * @returns {DocumentFragment}
 */
const wave = (strings, ...tags) => {
    const namesAsDataAttributes = store.config.namesAsDataAttributes;
    const dataNamePrefix = store.config.dataNamePrefix;
    const dataNamePrefixIndexLength = dataNamePrefix  !== null ? dataNamePrefix.length + 6 : 5;

    const DOMstring = strings.raw.reduce((acc, value, i, data) => {
        let tag = tags[i];
        if (tag instanceof Element) {
            acc.elements[i] = tag;
            tag = '<div id="_WaveTag__' + i + '"></div>';
        } else if (isArray(tag)) {
            const collection = document.createDocumentFragment();
            const list = tag.map(value => {
                return (wave `${value}`);
            });
            collection.append(...list);
            acc.elements[i] = collection;
            tag = '<div id="_WaveTag__' + i + '"></div>';
        }
        acc.preSting.push(value + (tag === undefined ? '' : tag));
        return acc;
    }, {
        preSting: [],
        elements: {}
    });

    DOMstring.preSting = DOMstring.preSting.join('');

    const componentNames = DOMstring.preSting.split('<')
        .map((value, i) => i === 0 ? value : '<' + value)
        // Remove non-tags
        .filter((value, i, data) => {
            if (i === 0) { return true; }
            const lastItem = data[i - 1];
            const hasOpenQuote = (lastItem.match(/'/g) || []).length % 2 === 0;
            const hasOpenDoubleQuote = (lastItem.match(/"/g) || []).length % 2 === 0;
            return hasOpenQuote && hasOpenDoubleQuote;
        })
        .filter(valueToClean => {
            const value = valueToClean.split('>')[0];

            if (value.indexOf('>') > 1 && value.indexOf('>') < 4) { return false; }
            const tagParts = value.split(' ');
            if (tagParts.length === 1) { return false; }

            const startingPart = tagParts[1];
            if (startingPart.length === 0) { return false; }
            return isFirstUpperCase(startingPart) && isFirstAlpha(startingPart);
        })
        .map(value => {
            const secondSegment = value.split(' ')[1];
            if (secondSegment.includes('>')) {
                return secondSegment.split('>')[0]
            }
            if (secondSegment.includes(' ')) {
                return secondSegment.split(' ')[0]
            }
            return secondSegment;
        });

    // Check for duplicates.
    if (hasDuplicate(componentNames)) {
        throw Error('Duplicate component names');
    }
    // Replace component names with data attributes. 
    const prep = componentNames.reduce((acc, name) => {
        const nameLowerCase = name.toLowerCase();
        const pattern = new RegExp(name);
        const dataName = dataNamePrefix === null ? 'data-' + nameLowerCase : `data-${dataNamePrefix}-${nameLowerCase}`;
        console.log('dataName', dataName)
        acc.DOMstring = acc.DOMstring.replace(pattern, dataName);
        acc.dataNames.push(dataName);
        return acc;
    }, { DOMstring: DOMstring.preSting, dataNames: [] });

    const html = createFragment(prep.DOMstring);
    const els = DOMstring.elements;

    Object.entries(els).map(entry => {
        const [key, element] = entry;
        const index = parseInt(key);
        const elementToReplace = html.querySelector('#_WaveTag__' + key);
        const isNotObject = element instanceof Element;
        elementToReplace.replaceWith(element);
    })

    const firstElementChild = html.firstElementChild;
    const parentName = componentNames[0] || '';

    const componentElements = prep.dataNames.reduce((acc, value, i) => {
        console.log('dataNamePrefixIndexLength', dataNamePrefixIndexLength)
        const hypenated = value.slice(dataNamePrefixIndexLength);
        console.log('hypenated', hypenated)
        const name = hypenatedToCamelCase(componentNames[i]);
        const element = html.querySelector(`[${value}]`);

        if (store.config.namesAsDataAttributes === true || (isArray(store.config.namesAsDataAttributes) && store.config.namesAsDataAttributes
                .some(value => value === name || value === hypenated))) {} else {
            element.removeAttribute(value);
        }

        store.components[name] = element;
        acc[name] = element;
        return acc;
    }, {});

    return firstElementChild
}

/** 
 * @param {string} strings - String parts of the template literal.
 * @returns {Object} - Element.
 */
const stringToWave = DOMString => wave `${DOMString}`;

export default {
    wave,
    stringToWave,
    components: store.components,
    read,
    write,
    kill,
    queryEach,
    queryEachAll,
    eachClosest,
    children,
    childNodes,
    queryAll,
    siblings,
    siblingsKeys,
    ancestor,
    style,
    aquire,
    swap,
    toggle,
    cycle,
    config: config => aquire(store.config, config)

};