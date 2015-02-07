var str = require('virtual-dom-stringify');

var gantt = require('../');
var g = gantt({
});
console.log(str(g.tree));
