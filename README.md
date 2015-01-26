# ampersand-paged-collection

Paginated subset of a collection. Only emits `reset` events.

This allows you to have a paginated version of anything that acts like
an `ampersand-collection` That you can quickly paginate through without
affecting its parent.

<!-- starthide -->
Part of the [Ampersand.js toolkit](http://ampersandjs.com) for building clientside applications.
<!-- endhide -->

[![browser support](https://ci.testling.com/ampersandjs/ampersand-parsed-collection.png)
](https://ci.testling.com/ampersandjs/ampersand-parsed-collection)

## install

```
npm install ampersand-paged-collection
```

## example

```javascript
var WidgetCollection = require('./mycollection');
var PagedCollection = require('ampersand-paged-collection');

var widgets = new WidgetCollection();

widgets.fetch();

// This will create a collection-like object
// that will only include 10 widgets starting
// at offset 0
var widgetPage = new PagedCollection(widgets, {
    limit: 10
});

//Move to the next 10 widgets
widgetPage.configure({offset: 10});
```
## API reference

### new PagedCollection(collection, [config]);

* `collection` {Collection} An instance of `ampersand-collection`, `ampersand-paged-collection`, or `Backbone.Collection that` contains our full set of models.
* `config` {Object} [optional] The config object which can take the following options
    * `limit` {Number} [optional] If specified will limit the number of models to this maximum number.
    * `offset` {Number} Default: `0`. This is the index of the start of the current page of models to pull from `collection`

### .configure(config, [reset])

This is how you paginate post-init

* `config` {Object} Same config object as what you pass to init.
* `reset` {Boolean} Default: `false`. If true, a `reset` event will be emitted regardless of whether or not the `limit` or `offset` were changed.

### .at(index)

* `index` {Number} returns model as specified index in the paged collection.

### .length

The paged collection maintains a read-only length property that simply proxies to the array length of the models it contains.

### .models

The array of filtered models with `offset` and/or `limit` applied (if set).

### .isCollection

This property is present and set to `true`. see [ampersand-collection](https://github.com/AmpersandJS/ampersand-collection#a-quick-note-about-instanceof-checks) for more info

### all the underscore methods

Since we're already depending on underscore for much of the functionality in this module, we also mixin underscore methods into the paged collection in the same way that Backbone does for collections.

This means you can just call `collection.each()` or `collection.find()` to find/filter/iterate the models in the paged collection. You can see which underscore methods are included by referencing [ampersand-collection-underscore-mixin](https://github.com/AmpersandJS/ampersand-collection-underscore-mixin).

### PagedCollection.extend(mixins...)

PagedCollection attaches `extend` to the constructor so if you want to add custom methods to your PagedCollection constructor, it's easy:

```javascript
var PagedCollection = require('ampersand-paged-collection');

// this exports a new constructor that includes
// the methods you passed on the prototype while
// maintaining the inheritance chain for instanceof
// checks.
module.exports = PagedCollection.extend({
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
