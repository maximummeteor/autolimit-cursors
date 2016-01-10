CachedItem = class CachedItem {
  static find(collection, _id) {
    if(!this._cache) this._cache = [];
    let item = _.find(this._cache, (item) => {
      return item.collection.name == collection.name && item._id == _id;
    });
    return item;
  }
  static get(collection, _id) {
    return this.add(collection, _id);
  }
  static add(collection, _id) {
    let self = this;
    if(!self._cache) self._cache = [];
    return self.find(collection, _id) || (function(){
      let item = new self(collection, _id);
      self._cache.push(item);
      return item;
    })()
  }
  static remove(collection, _id) {
    if(!this._cache) this._cache = [];
    console.log('remove', collection.name, _id);
    this._cache = _.filter(this._cache, (item) => {
      return !(item.collection.name == collection.name && item._id == _id);
    });
  }
  static removeOld() {
    this._cache = _.filter(this._cache, (item) => {
      return !!item._deps.length;
    })
  }

  constructor(collection, _id) {
    this._deps = [];
    this._fieldValues = new ReactiveDict;
    this._cursorFields = new ReactiveVar;

    this.collection = collection;
    this._id = _id;
  }
  addField(field) {
    let self = this;
    current = Tracker.nonreactive(() => { return self._cursorFields.get()}) || [];
    if(current.length == 0 || current.indexOf(field) == -1) {
      current.push(field);
      self._cursorFields.set(current);
    }
  }
  getValue(field) {
    let self = this;
    if(!self._computation) {
      Tracker.nonreactive(() => {
        self._computation = Tracker.autorun(() => {
          let fieldsArray = self._cursorFields.get() || [];
          let fields = {};
          fieldsArray.forEach((f) => {
            fields[f] = 1;
          });
          let item = self.collection.findOne({_id: self._id}, {fields});;
          fieldsArray.forEach((f) => {
            self._fieldValues.set(f, item && item[f]);
          });
        })
      });
    };
    return self._fieldValues.get(field);
  }
  addDependency(computation) {
    let self = this;
    if(self._deps.indexOf(computation._id) > -1) return;
    self._deps.push(computation._id);
    computation.onStop(() => {
      self.removeDependency(computation);
    })
  }
  removeDependency(computation) {
    this._deps = _.filter(this._deps, (dep) => {
      return dep != computation._id;
    });
    CachedItem.removeOld()
  }
}
