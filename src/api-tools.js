import { 
    fastDOM, 
    hypenatedToCamelCase,
    isArray
} from './helpers';
import wave from './wave';

/** 
 * Optimised reads.
 * @param {Function} callback.  
 * @return {number} job reference. 
 */
export const read = callback => fastDOM.measure(() => callback());

/** 
 * Optimised writes.
 * @param {Function} callback.  
 * @return {number} job reference. 
 */
export const write = callback => fastDOM.mutate(() => callback());

/** 
 * Kills a scheduled job.
 * @param {number} ref - job reference. 
 */
export const kill = ref => fastDOM.clear(ref);

/** 
 * Get the nested selector for each element of an array.
 * @param {Array} elementArray.
 * @param {string} selector.
 * @returns {Array} new element array. 
 */
export const queryEach = (elementArray, selector) =>
    elementArray.map(element => element.querySelector(selector));

/** 
 * Get the nested matching selectors for each element of an array.
 * @param{Array} elementArray.
 * @param{string} selector.
 * @returns{Array} new element array. 
 */
export const queryEachAll = (elementArray, selector) =>
    elementArray.map(element => element.querySelectorAll(selector));

/** 
 * Get the matching ancestor for each element in an array.
 * @param{Array} elementArray.
 * @param{string} selector.
 * @returns{Array} new element array. 
 */
export const eachClosest = (elementArray, selector) =>
    elementArray.map(element => element.closest(selector));


/** 
 * Get children as an Array.
 * @returns {Array} new element array. 
 */
export const children = element => Array.from(element.children);

/** 
 * Get childNode as an Array.
 * @returns {Array} new element array. 
 */
export const childNodes = element => Array.from(element.childNodes);

/** 
 * querySelectorAll as an Array
 * @param {string} selector.
 * @returns {Array} new element array. 
 */
export const queryAll = (element, selector) => Array.from(element.querySelectorAll(selector));

/** 
 * Get siblings Array
 * @returns {Array} new element array. 
 */
export const siblings = element => Array.from(element.parentElement.children)
    .filter(child => child !== element);

/** 
 * Get siblings Key Entries
 * @returns {Array} new element array. 
 */
export const siblingsKeys = element => Array.from(element.parentElement.children)
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
export const ancestor = (element, level) => {
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
export const aquire = (target, ...sources) => {
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
export const style = (element, ...sources) => void aquire(element.style, ...sources);


/**
 * Add or remove a data attribute
 */
export const swap = (element, dataKey, state) => {
    const key = hypenatedToCamelCase(dataKey);
    return state ? element.dataset[key] = '' :
        delete element.dataset[key];
};

/**
 * Add or remove a data attribute
 */
export const toggle = (element, dataKey) => {
    const key = hypenatedToCamelCase(dataKey);
    return element.dataset[key] === '' ? delete element.dataset[key] :
        element.dataset[key] = '';
};

/** 
 * Cycles throught an array of values infinitely to set as a dataset value.
 */
export const cycle = (element, dataKey, values) => {
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
export const elevate = (element, style, zIndex, callback) => {
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
}


/** 
 * @param {string} strings - String parts of the template literal.
 * @returns {Object} - Element.
 */
export const stringToWave = DOMString => wave `${DOMString}`;
