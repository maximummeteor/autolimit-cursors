const createPostsCollection = function() {
  let Posts = new Mongo.Collection(null);
  Posts.attachSchema(new SimpleSchema({
    name: {
      type: String
    },
    author: {
      type: String
    },
    createdAt: {
      type: Date
    },
    nested: {
      type: Object,
      optional: true
    },
    'nested.test': {
      type: String
    }
  }));

  return Posts
}

Tinytest.addAsync('do not rerun', function (test, next) {
  let Posts = createPostsCollection();
  let postId = Posts.insert({name: 'test', author: 'max', createdAt: new Date});

  Tracker.autorun((computation) => {
    let post = Posts.findOne({_id: postId});
    if(computation.firstRun) return;
    test.equal(true, false);
    computation.onStop(() => {next()})
    computation.stop()
  });

  Posts.update({_id: postId}, {$set: {name: 'working'}});
  Meteor.setTimeout(() => {
    next()
  }, 500)
  test.equal(true, true);
});

Tinytest.addAsync('with transform', function (test, next) {
  let Posts = createPostsCollection();
  let Post = class Post {
    constructor(post) {
      _.extend(this, post);
    }
  }
  Posts._transform = function(doc) {
    return new Post(doc);
  }
  let postId = Posts.insert({name: 'test', author: 'max', createdAt: new Date});

  Tracker.autorun((computation) => {
    let post = Posts.findOne({_id: postId});
    let postName = post.name;

    if(computation.firstRun) return;
    test.equal(true, true);
    computation.onStop(() => {next()})
    computation.stop()
  });
  Posts.update({_id: postId}, {$set: {name: 'working'}});
});

Tinytest.addAsync('rerun if we get a specific field', function (test, next) {
  let Posts = createPostsCollection();
  let postId = Posts.insert({name: 'test', author: 'max', createdAt: new Date});

  Tracker.autorun((computation) => {
    let post = Posts.findOne({_id: postId});
    let postName = post.name;

    if(computation.firstRun) return;
    test.equal(true, true);
    computation.onStop(() => {next()})
    computation.stop()
  });
  Posts.update({_id: postId}, {$set: {name: 'working'}});
});
