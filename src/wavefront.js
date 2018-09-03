import store from './store';
const {isArray} = Array;
const isFirstUpperCase = string => string[0].toUpperCase() === string[0];
const isFirstAlpha = string => string[0].match(/^[a-z0-9]+$/i);
/** 
 * Converts a hypenated string into camel-case
 * @param {string}
 * @return {string} Camel-cased string. 
 */
const hypenatedToCamelCase = string => {
	const transfored = string.replace(/-([a-z])/g, g => g[1].toUpperCase()).replace(/-/g,'');
	return transfored[0].toLowerCase() + transfored.slice(1);
}
const hasDuplicate = function(data) {
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
 * Creates a document fragment from a given DOM string.
 */
const createFragment = DOMstring => document.createRange().createContextualFragment(DOMstring);





/** 
 * @param {string} strings - String parts of the template literal.
 * @param {*} tags - Value parts of the template literal.
 * @returns {DocumentFragment}
 */
const wave = (strings, ...tags) => {

// 	const tagsLog = tags.reduce((acc, tag, i) =>{
// 		if(typeof tag === 'object'){
// 			acc.elements[i] = tag.element; 
// 		}
// 		if(typeof tag === 'string'){
// 			acc.strings[i] = tag; 
// 		}
// 		if(tag instanceof Element){
// 			acc.elements[i] = tag; 
// 		}
// 		if(isArray(tag)){
// 			// deal with array
// 		}
// 		return acc;
// 	},{
// 		elements: {},
// 		strings: {}
// 	});
// 
// console.log(tagsLog)

	console.log('strings.raw', strings.raw)
    const DOMstring = strings.raw.reduce((acc, value, i, data) => {
        let tag = tags[i];
         if(tag instanceof Element){
		 	acc.elements[i] = tag; 
		 	tag = '<div id="_WaveTag__' + i + '"></div>';
		 }else if(typeof tag === 'object'){
		 	acc.elements[i] = tag.element; 
			tag = '<div id="_WaveTag__' + i + '"></div>';
		 }
        acc.preSting.push(value + (tag === undefined ? '' : tag));
        return acc;
    }, {
    	preSting: [],
    	elements: {}
    });

    DOMstring.preSting = DOMstring.preSting.join('');

    console.log('DOMstring', DOMstring)

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
        const pattern = new RegExp(name, 'g');
        const dataName = 'data-component-' + name.toLowerCase();
        acc.DOMstring = acc.DOMstring.replace(pattern, dataName);
        acc.dataNames.push(dataName);
        return acc;
    }, { DOMstring: DOMstring.preSting, dataNames: [] });


    const html = createFragment(prep.DOMstring);

    // console.log('html', html)
    //
    // const elementsLength = DOMstring.length;
    // for(let i = 0; i < tagsLength; i++){
    // 	const element = html.querySelector('#_WaveTag_' + i);
    // 	if()
    // }
    const els = DOMstring.elements
    console.log('els', els)
    Object.entries(els).map(entry =>{
    	const [key, element] = entry;
    	const index = parseInt(key);
    	const elementToReplace = html.querySelector('#_WaveTag__' + key)
    	 

    	const isNotObject = element instanceof Element;

    	elementToReplace
    	 .replaceWith(element);
    })

    const firstElementChild = html.firstElementChild;
    const parentName = componentNames[0] || '';

   const componentElements = prep.dataNames.reduce((acc, value, i) => {
        const name = hypenatedToCamelCase(componentNames[i]);
       	const element = html.querySelector(`[${value}]`);
        store.components[name] = {
        	name,
        	element,
        	parent: firstElementChild,
        	parentName,
        	string: () => element.outerHTML
        };
        acc[name] = element;
        return acc;
    },{});

    return {
        name: parentName,
        element: firstElementChild,
        components: componentElements,
        string: () => firstElementChild.outerHTML
    }
}

const append = (parent, ...children) =>{
	const childElements = children.map(child => {
		if(child instanceof Element){
			return child;
		}
		if(typeof child === 'object' && child.element instanceof Element){
			return child.element;
		}
		return child; // Will throw an error.
	});
	parent.append(...childElements);
}

/*

<div>${HTMLString}</div>    // HTML String 
<div>${Node}</div>          // single node
<div>${NodeList}</div>      // NodeList or collection 
or()
loop()


<div>${Array of single values}</div>

const element =  someComponent.element;
const {componentName1, componentName2} =  someComponent.components();
const {class1, class2} =  someComponent.class();  
const {id1, id2} =  someComponent.id('id1', 'id2');  
const {data-name1, data-name2} =  someComponent.data('name1','name2');  


*/


export default {
    wave,
    components: store.components,
    append
};