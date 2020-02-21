import React, { useReducer } from 'react';
import './App.css';
import reddit from './reddit-api';
import Player from './Player';
import { saveVideoToDB, getBeforeAnchor, getAfterAnchor } from './saveVideo';

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
        videos: action.videos,
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
    console.log("Loading videos. Mocking API: ", process.env.REACT_APP_MOCK_API);
    (
      // (process.env.REACT_APP_MOCK_API)
      (false)
        ? import('./api_output.json').then((list) => list.default)
        : loadVideos()
    ).then(({ type, list }) => {
      console.log("Videos list: ", list);
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

  return (
    <>
      {
        (state.videos[state.currentId])
          ? <Player
            key={state.videos[state.currentId].name}
            video={state.videos[state.currentId]}
            saveVideoToDB={saveVideoToDBWrap}
          />
          : "Loading..."
      }
      <button onClick={() => dispatch({ type: "SHOW_NEXT" })}>
        {state.currentId + 1} / {state.videos.length} Next >>
      </button>
    </>
  );
}

export default App;