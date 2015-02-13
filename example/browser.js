var chart = require('./chart.js');
var createElement = require('virtual-dom/create-element');
document.body.appendChild(createElement(chart.tree()));
