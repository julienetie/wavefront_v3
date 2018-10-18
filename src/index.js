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
    style,
    swap,
    toggle,
    write
} from './api-tools';
import wave from './wave';
import store from './store';
const $ = store.$;
const config = config => aquire(store.config, config);
export {
    aquire,
    childNodes,
    children,
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
    style,
    swap,
    toggle,
    wave,
    write,
    $
};