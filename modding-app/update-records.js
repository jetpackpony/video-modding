const reddit = require('./src/reddit-api').init();
const mongo = require('./electron/mongo');
const Bottleneck = require('bottleneck');
const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1000
});

const isDev = false;
const run = async () => {
  const { videosCol, client } = await mongo.connect(isDev);
  const updateVideo = limiter.wrap((id) => {
    return new Promise((resolve, reject) => {
      reddit
        .getSubmission(id)
        .then((post) => post.media.reddit_video.hls_url)
        .then((hls_url) => {
          videosCol.updateOne(
            { id },
            { $set: { hls_url } },
            { upsert: true },
            (err, result) => {
              if (err) {
                console.log(`Error in ${id}`, err);
                reject(id);
                return;
              }
              console.log(`Success in ${id}`);
              resolve(id);
              return;
            });
        })
        .catch((err) => {
          console.log("Error updating stuff: ", err);
        });
    });
  });
  videosCol.find({ hls_url: null }).toArray(async (err, res) => {
    if (err) {
      console.log("Error", err);
      return;
    }
    const ids = res.map((v) => v.id);
    console.log(ids, ids.length);

    await Promise.all(ids.map(updateVideo));
    console.log("All done");

    // const numConc = 5;
    // for(let i = 0; i < ids.length; i += numConc) {
    //   console.log("Running", i, i + numConc);
    //   const res = await Promise.all(
    //     ids.slice(i, i + numConc).map(updateVideo)
    //   );
    //   console.log("Batch result: ", res);
    // }
    client.close();
  });
};
run();


 
