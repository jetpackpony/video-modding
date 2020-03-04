const reddit = require('./src/reddit-api').init();

const makeIterable = (after = null) => {
  const next = async () => {
    const res = await reddit
      .getVideos({
        subreddit: "WatchPeopleDieInside",
        ...((after) ? { after } : {})
      });
    if (res.length > 0) {
      after = res[res.length - 1].name;
      res.forEach((i) => console.log(`${i.name}    ${i.title}`));
      // console.log(res[res.length - 1]);
      return {
        value: res.length,
        done: false
      };
    } else {
      return { done: true };
    }
  };
  return {
    [Symbol.asyncIterator]: () => {
      return {
        next
      };
    }
  };
};
// t3_ew57xl 
const run = async () => {
  const posts = makeIterable();
  let total = 0;
  for await (let num of posts) {
    total += num;
    console.log("Total posts: ", total);
  }
};

run();