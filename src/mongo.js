require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const { ipcMain } = require('electron');
 
const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME;
function connect() {
  return new Promise((resolve, reject) => {
    console.log("Connecting to: ", url);
    MongoClient.connect(url, function (err, client) {
      if (err) {
        return reject(err);
      }
      console.log("Connected successfully to server");

      const db = client.db(dbName);
      const col= db.collection('redditVideos');

      ipcMain.on('save-video-data', (event, video) => {
        col.updateOne(
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

      resolve();
    });
  });
}

module.exports = { connect };