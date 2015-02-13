var h = require('virtual-hyperscript-svg');
var defined = require('defined');
var concat = require('concat-map');
var toposort = require('toposort');
var parsedur = require('parse-duration');

module.exports = Gantt;

function Gantt (opts) {
    if (!(this instanceof Gantt)) return new Gantt(opts);
    if (!opts) opts = {};
    this.tasks = defined(opts.tasks, {});
    this.unnamed = 0;
}

Gantt.prototype.add = function (name, t) {
    this.tasks[name] = t;
};

Gantt.prototype.tree = function () {
    var self = this;
    var tsort = toposort(concat(Object.keys(self.tasks), function (key) {
        var t = self.tasks[key];
        if (!t.dependencies || t.dependencies.length === 0) {
            return [ [ key, '__END__' ] ];
        }
        return t.dependencies.map(function (d) { return [ key, d ] });
    })).reverse().slice(1);
    var mspx = parsedur('1 month') / 1000;
    
    var time = 0;
    var rects = tsort.map(function (key, ix) {
        var t = self.tasks[key];
        var ms = parsedur(t.estimate);
        time += ms;
        
        return h('rect', {
            fill: 'yellow',
            x: time / mspx - (ms / mspx),
            y: 50 * ix,
            width: ms / mspx,
            height: 50,
        });
    });
    
    return h('svg', { width: '100%', height: '100%' }, rects);
};
