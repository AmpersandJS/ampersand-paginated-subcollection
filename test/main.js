var test = require('tape');
var mixins = require('ampersand-collection-underscore-mixin');
var Collection = require('ampersand-collection').extend(mixins);
var SubCollection = require('../ampersand-paged-collection');
var Model = require('ampersand-state');

// our widget model
var Widget = Model.extend({
    props: {
        id: 'number',
        name: 'string',
        awesomeness: 'number',
        sweet: 'boolean'
    }
});

// our base collection
var Widgets = Collection.extend(mixins, {
    model: Widget,
    comparator: 'awesomeness'
});

// helper for getting a base collection
function getBaseCollection() {
    var widgets = new Widgets();

    // add a hundred items to our base collection
    var items = 100;
    while (items--) {
        widgets.add({
            id: items,
            name: 'abcdefghij'.split('')[items % 10],
            awesomeness: (items % 10),
            sweet: (items % 2 === 0)
        });
    }
    return widgets;
}

test('basic init, length', function (t) {
    var base = getBaseCollection();
    var sub = new SubCollection(base);
    t.equal(sub.length, 100);
    t.end();
});

test('it should report as being a collection', function (t) {
    var base = getBaseCollection();
    var sub = new SubCollection(base);
    t.ok(sub.isCollection);

    sub.isCollection = false;
    t.ok(sub.isCollection);
    t.end();
});

test('should be able to specify/update offset and limit', function (t) {
    var base = getBaseCollection();
    var sub = new SubCollection(base, {
        limit: 10
    });
    t.equal(sub.length, 10);
    t.equal(sub.at(0).id, base.at(0).id);
    sub.configure({limit: 5});
    t.equal(sub.length, 5);
    sub.configure({offset: 5});
    t.equal(sub.at(0).id, base.at(5).id);
    sub.configure({offset: null});
    sub.configure({limit: null});
    t.equal(sub.length, 100);
    t.end();
});

test('should fire `reset` event only when limit/offset is updated', function (t) {
    t.plan(1);
    var base = getBaseCollection();
    var sub = new SubCollection(base, {
        limit: 10
    });
    sub.on('reset', function (emitter) {
        t.equal(emitter, sub);
        t.end();
    });
    sub.configure({offset: 0});//No change, no event
    sub.configure({offset: 10}); //Change, fire event
});

test('should only fire one `reset` event on parent collection set', function (t) {
    t.plan(1);
    var base = new Widgets();
    var widgets = getBaseCollection();
    var sub = new SubCollection(base, {
        limit: 10
    });
    sub.on('reset', function (emitter) {
        t.equal(emitter, sub);
        t.end();
    });
    base.set(widgets.models);

});

test('should only fire one `reset` event on parent change event', function (t) {
    t.plan(1);
    var base = getBaseCollection();
    var sub = new SubCollection(base, {
        limit: 10
    });
    sub.on('reset', function (emitter) {
        t.equal(emitter, sub);
        t.end();
    });

    base.at(0).name = 'changed';
});

test('should fire `reset` event when parent sorts', function (t) {
    t.plan(1);
    var base = getBaseCollection();
    var sub = new SubCollection(base, {
        limit: 10
    });
    sub.on('reset', function (emitter) {
        t.equal(emitter, sub);
        t.end();
    });
    base.sort();
});

test('should fire `reset` event when parent resets', function (t) {
    t.plan(1);
    var base = new getBaseCollection();
    var widgets = getBaseCollection();
    var sub = new SubCollection(base, {
        limit: 10
    });
    sub.on('reset', function (emitter) {
        t.equal(emitter, sub);
        t.end();
    });
    base.reset(widgets.models);
});

test('reset on custom event', function (t) {
    t.plan(1);
    var base = getBaseCollection();
    var sub = new SubCollection(base, {
        limit: 10
    });

    sub.on('reset', function (emitter) {
        t.equal(emitter, sub);
        t.end();
    });

    var model = sub.at(0);
    model.trigger('custom', model);
});
