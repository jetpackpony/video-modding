const reddit = require('./src/reddit-api').init();

reddit
  .getVideos({
    subreddit: "WatchPeopleDieInside",
    // after: "t3_f6waz7"
    // before: "t3_f6grvp"
    // before: "t3_f6w255"

  })
  .map((p) => [ p.name, p.title ])
  .then(console.log);
 