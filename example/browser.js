var chart = require('./chart.js');
var createElement = require('virtual-dom/create-element');

var elem = document.querySelector('#chart');
elem.appendChild(createElement(chart.tree()));
