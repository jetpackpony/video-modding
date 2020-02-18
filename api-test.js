const reddit = require('./reddit-api').init();

reddit
  .getVideos({
    subreddit: "WatchPeopleDieInside"
  })
  .map((p) => p.title)
  .then(console.log);
 