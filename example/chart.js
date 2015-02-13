var gantt = require('../');
var g = gantt({});

g.add('wow', {
    dependencies: [ 'amaze' ],
    duration: '1 week'
});
g.add('amaze', {
    duration: '3 days'
});
g.add('cool', {
    duration: '6 days'
});
g.add('whatever', {
    duration: '1 day',
    dependencies: [ 'wow' ]
});
g.add('very', {
    duration: '2 days',
    dependencies: [ 'amaze' ]
});
g.add('great', {
    duration: '8 days',
    dependencies: [ 'very' ]
});
module.exports = g;
