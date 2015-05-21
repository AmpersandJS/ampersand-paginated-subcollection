# ampersand-paginated-subcollection

Lead Maintainer: [Michael Garvin](https://github.com/wraithgar)

## Purpose

Paginated subset of a collection. Only emits `reset` events.

This allows you to have a paginated version of anything that acts like
an `ampersand-collection` That you can quickly paginate through without
affecting its parent.

<!-- starthide -->
Part of the [Ampersand.js toolkit](http://ampersandjs.com) for building clientside applications.
<!-- endhide -->

[![browser support](https://ci.testling.com/ampersandjs/ampersand-paginated-collection.png)
](https://ci.testling.com/ampersandjs/ampersand-paginated-collection)

## install

```
npm install ampersand-paginated-subcollection
```

## example

```javascript
var WidgetCollection = require('./mycollection');
var PaginatedSubcollection = require('ampersand-paginated-subcollection');

var widgets = new WidgetCollection();

widgets.fetch();

// This will create a collection-like object
// that will only include 10 widgets starting
// at offset 0
var widgetPage = new PaginatedSubcollection(widgets, {
    limit: 10
});

//Move to the next 10 widgets
widgetPage.configure({offset: 10});
```
## API reference

### new PaginatedSubcollection(collection, [config]);

* `collection` {Collection} An instance of `ampersand-collection` or `Backbone.Collection that` contains our full set of models.
* `config` {Object} [optional] The config object which can take the following options
    * `limit` {Number} [optional] If specified will limit the number of models to this maximum number.
    * `offset` {Number} Default: `0`. This is the index of the start of the current page of models to pull from `collection`

### .configure(config, [reset])

This is how you paginate post-init

* `config` {Object} Same config object as what you pass to init.
* `reset` {Boolean} Default: `false`. If true, a `reset` event will be emitted regardless of whether or not the `limit` or `offset` were changed.

### .at(index)

* `index` {Number} returns model as specified index in the paginated collection.

### .length

The paginated collection maintains a read-only length property that simply proxies to the array length of the models it contains.

### .models

The array of filtered models with `offset` and/or `limit` applied (if set).

### .isCollection

This property is present and set to `true`. see [ampersand-collection](https://github.com/AmpersandJS/ampersand-collection#a-quick-note-about-instanceof-checks) for more info

### PaginatedSubcollection.extend(mixins...)

PaginatedSubcollection attaches `extend` to the constructor so if you want to add custom methods to your PaginatedSubcollection constructor, it's easy:

```javascript
var PaginatedSubcollection = require('ampersand-paginated-subcollection');

// this exports a new constructor that includes
// the methods you passed on the prototype while
// maintaining the inheritance chain for instanceof
// checks.
module.exports = PaginatedSubcollection.extend({
    myMethod: function () { ... },
    myOtherMethod: function () { ... }
});
```

This is done by using: [ampersand-class-extend](https://github.com/AmpersandJS/ampersand-class-extend)

### A note about events

Because `ampersand-view` and its ilk cache views, it is really
inexpensive to simply emit a reset whenever we want to change the
pagination.  This prevents us from having to do internal indexOf tests
(which are very slow) in order to determine when to bubble up individual
events. This means that `reset` is the only event that this module will
emit, whenever something in the parent collection warrants this
happening.

### REST pagination

This module does not do REST pagination with the server, that is
something that is done via [ampersand-rest-collection](https://github.com/AmpersandJS/ampersand-rest-collection).

## credits

If you like this follow [@HenrikJoreteg](http://twitter.com/henrikjoreteg) on twitter.

## license

MIT
