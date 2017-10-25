import isNaN from 'is-nan';
Number.isNaN = isNaN;
import 'ie-array-find-polyfill';
import Promise from 'promise-polyfill';
if (!window.Promise) {
    window.Promise = Promise;
}

import Bootstrapper from './scripts/Bootstrapper';

let ready = function(fn) {
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

ready(() => {
    var boot = new Bootstrapper();
    boot.init();
});
