const { ipcRenderer } = window.require("electron");

const sendDataToDB = (data) => {
  return new Promise((resolve, reject) => {
    const onSaveVideoResult = (event, arg) => {
      console.log("save-video-data-result", arg);
      if (arg.success) {
        resolve();
      } else {
        reject(arg.err);
      }
      ipcRenderer.removeListener('save-video-data-result', onSaveVideoResult);
    };
    ipcRenderer.on('save-video-data-result', onSaveVideoResult);
    ipcRenderer.send('save-video-data', data);
  })
};

export const saveVideoToDB = (video, videoData) => {
  const data = {
    id: video.name,
    subreddit: video.subreddit,
    title: video.title,
    is_reddit_media_domain: video.is_reddit_media_domain,
    thumbnail: video.thumbnail,
    reddit_created: video.created,
    over_18: video.over_18,
    permalink: video.permalink,
    url: video.url,
    media: {
      fallback_url: video.media.reddit_video.fallback_url,
      height: video.media.reddit_video.height,
      width: video.media.reddit_video.width,
      start: videoData.start,
      end: videoData.end,
      isMuted: videoData.isMuted,
      selectedMusicFile: videoData.selectedMusicFile,
      musicRangeValue: videoData.musicRangeValue
    }
  };
  console.log("Saving video: ", data);
  return sendDataToDB(data)
    .then(() => console.log("Saved video successfully"))
    .catch((err) => {
      console.error("Error saving the video", err);
      alert("Error saving the video (check console)");
    });
};
