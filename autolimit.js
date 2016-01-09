['find', 'findOne'].forEach((what) => {
  CollectionExtensions.addPrototype(what, function() {
    let self = this;
    let argArray = _.toArray(arguments);
    let options = self._getFindOptions(argArray);

    if(!options.fields && self.simpleSchema()) {
      options = options || {};
      options.fields = {_id: 1};
      let origTransform = options.transform;
      options.transform = function(doc) {
        doc = (origTransform && origTransform(doc)) || doc;
        self.simpleSchema().objectKeys().forEach((field) => {
          Object.defineProperty(doc, field, {
            get: function() {
              let fields = {};
              console.log(field, this);
              fields[field] = 1;

              let item = self.findOne({_id: this._id}, {fields, bla: true, transform: null});
              return item && item[field];
            }
          })
        })
        return doc;
      }
    }

    return self._collection[what](self._getFindSelector(argArray), options);
  });
});
