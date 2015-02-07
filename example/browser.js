var gantt = require('../');
var createElement = require('virtual-dom/create-element');

var g = gantt({
});
document.body.appendChild(createElement(g.tree));
