import {
    aquire,
    childNodes,
    children,
    cycle,
    descendent,
    eachClosest,
    kill,
    queryAll,
    queryEach,
    queryEachAll,
    read,
    siblings,
    siblingsKeys,
    stringToWave,
    style,
    swap,
    toggle,
    write
} from './api-tools';
import wave from './wave';
import store from './store';
const components = store.components;
const $ = components;
const config = config => aquire(store.config, config);
export {
    aquire,
    childNodes,
    children,
    components,
    descendent,
    config,
    cycle,
    eachClosest,
    kill,
    queryAll,
    queryEach,
    queryEachAll,
    read,
    siblings,
    siblingsKeys,
    stringToWave,
    style,
    swap,
    toggle,
    wave,
    write,
    $
};