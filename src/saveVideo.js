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

const saveListAnchor = (listAnchor) => {
  return new Promise((resolve, reject) => {
    const onSaveListAnchorResult = (event, arg) => {
      console.log("save-list-anchor-result", arg);
      if (arg.success) {
        resolve();
      } else {
        reject(arg.err);
      }
      ipcRenderer.removeListener('save-list-anchor-result', onSaveListAnchorResult);
    };
    ipcRenderer.on('save-list-anchor-result', onSaveListAnchorResult);
    ipcRenderer.send('save-list-anchor', listAnchor);
  })
};


export const saveVideoToDB = (video, videoData, anchorType) => {
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
  console.log("Anchor type: ", anchorType);
  return sendDataToDB(data)
    .then(() => console.log("Saved video successfully"))
    .then(() => (
      (anchorType === "before-after")
        ? Promise.all([
          saveListAnchor({ id: video.name, anchorType: "before" }),
          saveListAnchor({ id: video.name, anchorType: "after" })
        ])
        : saveListAnchor({ id: video.name, anchorType })
      ))
    .catch((err) => {
      console.error("Error saving the video", err);
      alert("Error saving the video (check console)");
    });
};

export const skipVideo = (video, anchorType) => {
  const id = video.name;
  console.log("Anchor type: ", anchorType);
  return (
    (anchorType === "before-after")
      ? Promise.all([
        saveListAnchor({ id, anchorType: "before" }),
        saveListAnchor({ id, anchorType: "after" })
      ])
      : saveListAnchor({ id, anchorType })
  )
    .catch((err) => {
      console.error("Error saving the video", err);
      alert("Error saving the video (check console)");
    });
};

export const getBeforeAnchor = () => {
  return new Promise((resolve, reject) => {
    const onAnchorResult = (event, arg) => {
      console.log("get-before-anchor-result", arg);
      if (arg.success) {
        resolve(arg.id);
      } else {
        reject(arg.err);
      }
      ipcRenderer.removeListener('get-before-anchor-result', onAnchorResult);
    };
    ipcRenderer.on('get-before-anchor-result', onAnchorResult);
    ipcRenderer.send('get-before-anchor', "get");
  })
};

export const getAfterAnchor = () => {
  return new Promise((resolve, reject) => {
    const onAnchorResult = (event, arg) => {
      console.log("get-after-anchor-result", arg);
      if (arg.success) {
        resolve(arg.id);
      } else {
        reject(arg.err);
      }
      ipcRenderer.removeListener('get-after-anchor-result', onAnchorResult);
    };
    ipcRenderer.on('get-after-anchor-result', onAnchorResult);
    ipcRenderer.send('get-after-anchor', "get");
  })
};
