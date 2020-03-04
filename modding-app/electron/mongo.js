const MongoClient = require('mongodb').MongoClient;
const { ipcMain } = require('electron');
const env = require('./.env.json');

console.log("Environment: ", env);
 
const url = env.MONGODB_URI;
const dbName = env.MONGODB_DB_NAME;
function connect(isDev = null) {
  if (isDev === null) {
    isDev = require('electron-is-dev');
  }
  const devPrefix = (name) => `${isDev ? "DEV" : ""}${name}`;
  return new Promise((resolve, reject) => {
    console.log("Connecting to: ", url);
    MongoClient.connect(url, function (err, client) {
      if (err) {
        return reject(err);
      }
      console.log("Connected successfully to server");

      const db = client.db(dbName);
      const videosCol = db.collection(devPrefix("redditVideos"));
      const anchorCol = db.collection(devPrefix("redditVideosAnchors"));

      resolve({db, videosCol, anchorCol, client});
    });
  });
}

function addIPCChannels({ db, videosCol, anchorCol }) {
  ipcMain.on('save-video-data', (event, video) => {
    videosCol.updateOne(
      { id: video.id },
      { $set: video },
      { upsert: true },
      (err, result) => {
        if (err) {
          event.reply('save-video-data-result', {
            success: false,
            err
          });
          return;
        }
        event.reply('save-video-data-result', {
          success: true
        });
        return;
      });
  });

  ipcMain.on('save-list-anchor', (event, { id, anchorType, subreddit, listType }) => {
    anchorCol.updateOne(
      { subreddit, listType },
      { $set: { [anchorType]: id } },
      { upsert: true },
      (err, result) => {
        if (err) {
          event.reply('save-list-anchor-result', {
            success: false,
            err
          });
          return;
        }
        event.reply('save-list-anchor-result', {
          success: true
        });
        return;
      });
  });

  ipcMain.on('get-before-anchor', (event, { subreddit, listType }) => {
    anchorCol.findOne(
      { subreddit, listType },
      (err, result) => {
        console.log("REES: ", result);
        if (err) {
          event.reply('get-before-anchor-result', {
            success: false,
            err
          });
          return;
        }
        console.log("Result before", result);
        event.reply('get-before-anchor-result', {
          success: true,
          id: (result) ? result.before : null
        });
        return;
      });
  });

  ipcMain.on('get-after-anchor', (event, { subreddit, listType }) => {
    console.log("Req after", subreddit, listType);
    anchorCol.findOne(
      { subreddit, listType },
      (err, result) => {
        if (err) {
          event.reply('get-after-anchor-result', {
            success: false,
            err
          });
          return;
        }
        console.log("Result after", result);
        event.reply('get-after-anchor-result', {
          success: true,
          id: (result) ? result.after : null
        });
        return;
      });
  });
}

module.exports = { connect, addIPCChannels };