import fastdom from 'fastdom';
import fastdomPromised from 'fastdom/extensions/fastdom-promised.js';

/** 
 * Utilises fastDOM extended by native Promises.  
 */
export const fastDOM = fastdom.extend(fastdomPromised);

export const hasDuplicate = function(data) {
    let counts = [];
    for (var i = 0; i <= data.length; i++) {
        if (counts[data[i]] === undefined) {
            counts[data[i]] = 1;
        } else {
            return true;
        }
    }
    return false;
}

/** 
 * Converts a hypenated string into camel-case
 * @param {string}
 * @return {string} Camel-cased string. 
 */
export const hypenatedToCamelCase = string => {
    const transfored = string.replace(/-([a-z])/g, g => g[1].toUpperCase()).replace(/-/g, '');
    return transfored[0].toLowerCase() + transfored.slice(1);
}


/** 
 * Creates a document fragment from a given DOM string.
 */
export const createFragment = markupString => document.createRange().createContextualFragment(markupString);
/** 
 * Checks to see if the first character is uppercase.
 * @param {string} string
 * @return {string}
 */
export const isFirstUpperCase = string => string[0].toUpperCase() === string[0];
/** 
 * Checks to see if the first character is alpha.
 * @param {string} string
 * @return {string}
 */
export const isFirstAlpha = string => string[0].match(/^[a-z]+$/i);

/** 
 * isArray method.
 */
export const isArray = Array.isArray;
