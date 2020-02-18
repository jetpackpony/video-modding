require('dotenv').config();
const snoowrap = require('snoowrap');

const getVideos = (r) => ({ subreddit, after = null }) => {
  return r.getSubreddit(subreddit)
    .getHot({ after })
    .filter((post) => post.is_reddit_media_domain && post.is_video);
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
    getVideos: getVideos(r)
  };
};

module.exports = { init };

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