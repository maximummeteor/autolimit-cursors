# maximum:autolimit-cursors (WIP)

This package tries to eliminate unnecessary `Tracker.autorun` reruns caused by `minimongo` if you're not limiting fields returned by a query.
The goal is to achieve this behavior without code changes, only by installing this package. It currently only works if you use the `aldeed:collection2` package and have defined schemas for your collections.
