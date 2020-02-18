import React, { useReducer } from 'react';
import './App.css';
import reddit from './reddit-api';

const initialState = {
  videos: [],
  currentId: 0
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
        videos: action.videos,
        currentId: 0
      };
    default:
      throw new Error();
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const needsToLoadVideos = state.videos.length === 0 || state.videos.length === (state.currentId + 1);
  
  console.log("Rendering: ", state);
  if (needsToLoadVideos) {
    console.log("Loading videos. Mocking API: ", process.env.REACT_APP_MOCK_API);
    (
      // (process.env.REACT_APP_MOCK_API)
      (true)
        ? import('./api_output.json').then((list) => list.default)
        : reddit
            .init()
            .getVideos({
              subreddit: "WatchPeopleDieInside"
            })
    ).then((list) => {
      dispatch({ type: "SET_NEW_VIDEOS", videos: list });
    })
    .catch((e) => console.log("Error: ", e));
  }

  return (
    <>
      {
        (state.videos[state.currentId])
          ? <video autoPlay controls src={state.videos[state.currentId].media.reddit_video.fallback_url} width={1024} height={576}></video>
          : "Loading..."
      }
      <button onClick={() => dispatch({ type: "SHOW_NEXT" })}>
        {state.currentId + 1} / {state.videos.length} Next >>
      </button>
    </>
  );
}

export default App;
