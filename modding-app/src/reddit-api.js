require('dotenv').config();
const snoowrap = require('snoowrap');

const LISTING_TYPES = {
  HOT: "HOT",
  NEW: "NEW"
};

const getAPIMethod = (listingType) => {
  switch (listingType) {
    case LISTING_TYPES.HOT:
      return "getHot";
    case LISTING_TYPES.NEW:
      return "getNew";
    default:
      throw new Error(`Unknown list type: ${listingType}`);
  };
};
const isRedditVideo = (post) => post.is_reddit_media_domain && post.is_video;
const getVideos = (r) => ({ subreddit, before = null, after = null, listingType = null }) => {
  return r.getSubreddit(subreddit)
    [getAPIMethod(listingType)]({ before, after })
    .then((res) => {
      if (res.length > 0) {
        return {
          value: res.filter(isRedditVideo),
          done: false
        };
      } else {
        return {
          done: true
        };
      }
    });
};

const getSubmission = (r) => (id) => {
  return r.getSubmission(id).fetch();
};

const init = () => {
  const r = new snoowrap({
    userAgent: 'MyApp/1.0.0 (https://www.reddit.com/user/jetpackpony/)',
    clientId: process.env.REACT_APP_REDDIT_CLIENT_ID,
    clientSecret: process.env.REACT_APP_REDDIT_CLIENT_SECRET,
    username: process.env.REACT_APP_REDDIT_USERNAME,
    password: process.env.REACT_APP_REDDIT_PASSWORD
  });

  return {
    getVideos: getVideos(r),
    getSubmission: getSubmission(r)
  };
};

module.exports = { init, LISTING_TYPES };

// Printing a list of the titles on the front page
// r.getHot().map(post => post.title).then(console.log);
 
// // Extracting every comment on a thread
// r.getSubmission('4j8p6d').expandReplies({limit: Infinity, depth: Infinity}).then(console.log)
 
// // Automating moderation tasks
// r.getSubreddit('some_subreddit_name').getModqueue({limit: 100}).filter(someRemovalCondition).forEach(flaggedItem => {
//   flaggedItem.remove();
//   flaggedItem.subreddit.banUser(flaggedItem.author);
// });
 
// // Automatically creating a stickied thread for a moderated subreddit
// r.getSubreddit('WatchPeopleDieInside')
//   .getHot({ after: null })
//   .filter((post) => post.is_reddit_media_domain && post.is_video)
//   .then((posts) => {
//     console.log("Here's the last one: ");
//     const last = posts[posts.length - 1];
//     console.log(last);
//     return posts;
//   })
//   .map((post) => post.title)
//   .then(console.log);
//   // .then((posts) => posts[0])
//   // etc. etc.
 
// // Printing the content of a wiki page
// r.getSubreddit('AskReddit').getWikiPage('bestof').content_md.then(console.log);