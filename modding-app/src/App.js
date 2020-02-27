import React, { useReducer } from 'react';
import './App.css';
import reddit from './reddit-api';
import Player from './Player';
import {
  saveVideoToDB,
  skipVideo,
  getBeforeAnchor,
  getAfterAnchor
} from './saveVideo';
const isDev = window.require('electron-is-dev');
console.log("RUNNING DEV: ", isDev);

const initialState = {
  videos: [],
  currentId: 0,
  listType: "before-after"
};
const reducer = (state, action) => {
  switch (action.type) {
    case 'SHOW_NEXT':
      return {
        ...state,
        currentId: state.currentId + 1
      };
    case 'SET_NEW_VIDEOS':
      return {
        ...state,
        videos: (
          (action.listType === "before")
            ? action.videos.slice().reverse()
            : action.videos
        ),
        currentId: 0,
        listType: action.listType
      };
    case 'SET_LIST_TYPE':
      return {
        ...state,
        listType: action.listType
      };
    default:
      throw new Error();
  }
};

const loadVideos = async () => {
  const latestBefore = await getBeforeAnchor();
  console.log("Before anchor: ", latestBefore);
  if (latestBefore) {
    const list = await reddit
      .init()
      .getVideos({
        subreddit: "WatchPeopleDieInside",
        before: latestBefore
      });
    if (list.length > 0) {
      return { type: "before", list };
    }
  }

  const latestAfter = await getAfterAnchor();
  console.log("After anchor: ", latestAfter);
  const list = await reddit
    .init()
    .getVideos({
      subreddit: "WatchPeopleDieInside",
      after: latestAfter || null
    });
  
  if (!latestBefore && !latestAfter) {
    return { type: "before-after", list };
  }

  return { type: "after", list };
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const needsToLoadVideos = state.videos.length === 0 || ((state.currentId + 1) > state.videos.length);
  
  if (needsToLoadVideos) {
    const isMockAPI = isDev && (process.env.REACT_APP_MOCK_API === "true");
    console.log("Loading videos. Mocking API: ", isMockAPI);
    (
      (isMockAPI)
        ? import('./api_output_short.json').then((list) => ({ list: list.default, type: "before" }))
        : loadVideos()
    ).then(({ type, list }) => {
      console.log("Videos list: ", list, type);
      dispatch({ type: "SET_NEW_VIDEOS", videos: list, listType: type });
    })
    .catch((e) => console.log("Error: ", e));
  }

  const saveVideoToDBWrap = (video, videoData) => {
    return saveVideoToDB(video, videoData, state.listType)
      .then(() => {
        if (state.listType === "before-after") {
          dispatch({ type: "SET_LIST_TYPE", listType: "after" });
        }
      });
  };

  const skipVideoWrap = (video) => {
    return skipVideo(video, state.listType)
      .then(() => {
        if (state.listType === "before-after") {
          dispatch({ type: "SET_LIST_TYPE", listType: "after" });
        }
      });
  };

  const showNext = () => dispatch({ type: "SHOW_NEXT" });

  return (
    <>
      {
        (state.videos[state.currentId])
          ? <Player
            key={state.videos[state.currentId].name}
            video={state.videos[state.currentId]}
            saveVideoToDB={saveVideoToDBWrap}
            skipVideo={skipVideoWrap}
            showNext={showNext}
            currentVideo={state.currentId + 1}
            totalVideos={state.videos.length}
          />
          : "Loading..."
      }
    </>
  );
}

export default App;