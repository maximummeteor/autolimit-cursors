Package.describe({
  name: 'maximum:autolimit-cursors',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Eliminate unnecessary Tracker.autorun reruns caused by minimongo if you\'re not limiting fields returned by a query',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/maximummeteor/optimize',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript', 'client');
  api.use('underscore', 'client');
  api.use('tracker', 'client');
  api.use('reactive-var', 'client');
  api.use('reactive-dict', 'client');
  api.use('lai:collection-extensions@0.2.1_1', 'client');
  api.use('aldeed:collection2@2.8.0', 'client', {weak: true});
  api.addFiles(['cache.js', 'autolimit.js'], 'client');
  api.export('CachedItem', 'client');
});

Package.onTest(function(api) {
  api.use('ecmascript', 'client');
  api.use('tinytest', 'client');
  api.use('aldeed:collection2@2.8.0', 'client');
  api.use('mongo', 'client');
  api.use('tracker', 'client');
  api.use('underscore', 'client');
  api.use('maximum:optimize', 'client');
  api.addFiles('tests.js', 'client');
});
