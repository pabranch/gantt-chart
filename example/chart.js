var gantt = require('../');
var createElement = require('virtual-dom/create-element');

var g = gantt({
});
g.add('wow', {
    dependencies: [ 'amaze' ],
    estimate: '1 week'
});
g.add('amaze', {
    estimate: '3 days'
});
g.add('cool', {
    estimate: '6 days'
});
module.exports = g;
