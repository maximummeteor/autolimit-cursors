['find', 'findOne'].forEach((what) => {
  CollectionExtensions.addPrototype(what, function() {
    let self = this;
    let argArray = _.toArray(arguments);
    let options = self._getFindOptions(argArray);
    let currentComputation = Tracker.currentComputation;

    if(currentComputation && !options.fields && self.simpleSchema()) {
      options = options || {};
      options.fields = {_id: 1};
      let origTransform = options.transform;
      options.transform = function(doc) {
        doc = (origTransform && origTransform(doc)) || doc;
        self.simpleSchema().objectKeys().forEach((field) => {
          Object.defineProperty(doc, field, {
            get: function() {
              let item = CachedItem.get(self, this._id);
              item.addDependency(currentComputation);
              item.addField(field);
              return item.getValue(field);
            }
          })
        });
        return doc;
      }
    }

    return self._collection[what](self._getFindSelector(argArray), options);
  });
});
