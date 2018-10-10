import {  
    createFragment,
    hasDuplicate, 
    hypenatedToCamelCase, 
    isFirstUpperCase,
    isFirstAlpha,
    isArray
} from './helpers';
import store from './store';

/** 
 * @param {string} strings - String parts of the template literal.
 * @param {*} tags - Value parts of the template literal.
 * @returns {DocumentFragment}
 */
export default (strings, ...tags) => {
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

    return firstElementChild;
}
