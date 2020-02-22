const MongoClient = require('mongodb').MongoClient;
const { ipcMain } = require('electron');
const isDev = require('electron-is-dev');
const env = require('./.env.json');

const devPrefix = (name) => `${isDev ? "DEV" : ""}${name}`;

console.log("Environment: ", env);
 
const url = env.MONGODB_URI;
const dbName = env.MONGODB_DB_NAME;
function connect() {
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

      ipcMain.on('save-list-anchor', (event, { id, anchorType }) => {
        anchorCol.updateOne(
          { anchorType },
          { $set: { id } },
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

      ipcMain.on('get-before-anchor', (event) => {
        anchorCol.findOne(
          { anchorType: "before" },
          (err, result) => {
            console.log("REES: ", result);
            if (err) {
              event.reply('get-before-anchor-result', {
                success: false,
                err
              });
              return;
            }
            event.reply('get-before-anchor-result', {
              success: true,
              id: (result) ? result.id : null
            });
            return;
          });
      });

      ipcMain.on('get-after-anchor', (event) => {
        anchorCol.findOne(
          { anchorType: "after" },
          (err, result) => {
            if (err) {
              event.reply('get-after-anchor-result', {
                success: false,
                err
              });
              return;
            }
            event.reply('get-after-anchor-result', {
              success: true,
              id: (result) ? result.id : null
            });
            return;
          });
      });

      resolve();
    });
  });
}

module.exports = { connect };