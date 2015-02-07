var h = require('virtual-hyperscript');
var createElement = require('virtual-dom/create-element');

module.exports = Gantt;

function Gantt () {
    if (!(this instanceof Gantt)) return new Gantt;
    this.tree = h('div', 'cool');
}

