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
    
    var coords = {};
    tsort.forEach(function (key, ix) {
        var t = self.tasks[key];
        
        var time = deptime(t, 0);
        var ms = parsedur(t.duration);
        
        var x1 = time / mspx;
        var x0 = x1 - ms / mspx + 5;
        var y0 = (50 + 5) * ix;
        var y1 = y0 + 50;
        coords[key] = [ x0, y0, x1, y1 ];
    });
    
    var groups = tsort.reverse().map(function (key, rix) {
        var ix = tsort.length - rix - 1;
        var t = self.tasks[key];
        var c = coords[key];
        
        var time = deptime(t, 0);
        var ms = parsedur(t.duration);
        
        var x0 = 0, x1 = c[2] - c[0];
        var y0 = 0, y1 = c[3] - c[1];
        
        var pminy = c[1];
        (t.dependencies || []).forEach(function (k) {
            if (coords[k][3] < pminy) pminy = coords[k][3];
        });
        
        var arrowline = [
            [ x0 - 25, pminy - c[1] - 5 ],
            [ x0 - 25, y0 + 25 ],
            [ x0 - 15, y0 + 25 ]
        ];
        var arrowhead = [
            [ x0 - 15, + 20 ],
            [ x0 - 15, y0 + 30 ],
            [ x0 - 5, y0 + 25 ]
        ];
        
        var children = [];
        children.push(h('rect', {
            fill: 'yellow',
            x: x0, y: y0,
            width: x1 - x0,
            height: y1 - y0
        }));
        children.push(h('text', {
            x: 5, y: (y1 - y0 + 20 / 2) / 2,
            fontSize: 20,
            fill: 'blue'
        }, key));
        
        if (t.dependencies && t.dependencies.length) {
            children.push(h('polyline', {
                stroke: 'purple',
                strokeWidth: 3,
                fill: 'transparent',
                points: arrowline.join(' ')
            }));
            children.push(h('polygon', {
                fill: 'purple',
                points: arrowhead.join(' ')
            }));
        }
        return h('g', {
            transform: 'translate(' + c[0] + ',' + c[1] + ')'
        }, children);
    });
    
    return h('svg', { width: '100%', height: '100%' }, groups);
    
    function deptime (t, time) {
        var deps = t.dependencies || [];
        var max = time;
        for (var i = 0; i < deps.length; i++) {
            var dt = deptime(self.tasks[deps[i]], time);
            if (dt > max) max = dt;
        }
        return max + parsedur(t.duration);
    }
};
