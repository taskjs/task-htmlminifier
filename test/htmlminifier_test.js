'use strict';

var assert = require('assert');
var Htmlminifier = require('../lib/htmlminifier');

function errorHandler(err){
    process.nextTick(function rethrow() { throw err; });
}

(new Htmlminifier).run(
    [{
        contents: '<div>hey  </div>'
    }], // inputs
    {
        collapseWhitespace: true
    }, // options
    console // logger
).then(function(inputs){
    assert.equal(inputs.toString(), '<div>hey</div>')
}).catch(errorHandler)
