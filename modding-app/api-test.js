const reddit = require('./src/reddit-api');

reddit
  .init()
  .getVideos({
    subreddit: "WatchPeopleDieInside",
    listingType: reddit.LISTING_TYPES.HOT,
    // after: "t3_f6waz7"
    // before: "t3_f6grvp"
    // before: "t3_f6w255"

  })
  .then((res) => {
    if (!res.done) {
      console.log(`Found ${res.value.length} documents`);
    } else {
      console.log(`Reached end of listing`);
    }
  })
  // .map((p) => [ p.name, p.title ])
  // .then(console.log);
 