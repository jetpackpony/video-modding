import React, { useReducer, useRef } from 'react';
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
  listType: "before-after",
  endOfList: false,
  subreddit: "WatchPeopleDieInside",
  listingType: reddit.LISTING_TYPES.HOT
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
    case 'END_OF_LIST':
      return {
        ...state,
        endOfList: true
      };
    case "SET_SUBREDDIT":
      return {
        ...state,
        subreddit: action.subreddit,
        videos: [],
        currentId: 0,
        listType: "before-after",
        endOfList: false,
      };
    case 'SET_LISTING_TYPE':
      return {
        ...state,
        listingType: action.listingType,
        videos: [],
        currentId: 0,
        listType: "before-after",
        endOfList: false,
      };
    default:
      throw new Error();
  }
};

const loadVideos = async (subreddit, listingType) => {
  const latestBefore = await getBeforeAnchor(subreddit, listingType);
  console.log("Before anchor: ", latestBefore);
  if (latestBefore) {
    const list = await reddit
      .init()
      .getVideos({
        subreddit: subreddit,
        before: latestBefore,
        listingType
      });
    if (list.length > 0) {
      return { type: "before", list, subreddit, listingType };
    }
  }

  const latestAfter = await getAfterAnchor(subreddit, listingType);
  console.log("After anchor: ", latestAfter);
  const list = await reddit
    .init()
    .getVideos({
      subreddit: subreddit,
      after: latestAfter || null,
      listingType
    });
  
  if (list.length > 0) {
    if (!latestBefore && !latestAfter) {
      return { type: "before-after", list, subreddit, listingType };
    }

    return { type: "after", list, subreddit, listingType };
  } else {
    return null;
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const needsToLoadVideos = state.videos.length === 0 || ((state.currentId + 1) > state.videos.length);

  if (needsToLoadVideos && !state.endOfList) {
    const isMockAPI = isDev && (process.env.REACT_APP_MOCK_API === "true");
    console.log("Loading videos. Mocking API: ", isMockAPI);
    (
      (isMockAPI)
        ? import('./api_output_short.json')
          .then((list) => ({ list: list.default, type: "before", subreddit: state.subreddit, listingType: state.listingType }))
        : loadVideos(state.subreddit, state.listingType)
    ).then((res) => {
      if (res) {
        if (res.subreddit !== state.subreddit || res.listingType !== state.listingType) {
          console.log("Subreddit or listingtype changed. Ignoring results");
        } else {
          console.log("Videos list: ", res.list, res.type);
          dispatch({ type: "SET_NEW_VIDEOS", videos: res.list, listType: res.type });
        }
      } else {
        dispatch({ type: "END_OF_LIST" });
      }
    })
      .catch((e) => console.log("Error: ", e));
  }
  

  const saveVideoToDBWrap = (video, videoData) => {
    return saveVideoToDB(video, videoData, state.listType, state.subreddit, state.listingType)
      .then(() => {
        if (state.listType === "before-after") {
          dispatch({ type: "SET_LIST_TYPE", listType: "after" });
        }
      });
  };

  const skipVideoWrap = (video) => {
    return skipVideo(video, state.listType, state.subreddit, state.listingType)
      .then(() => {
        if (state.listType === "before-after") {
          dispatch({ type: "SET_LIST_TYPE", listType: "after" });
        }
      });
  };

  const showNext = () => dispatch({ type: "SHOW_NEXT" });

  const subredditEl = useRef(null);
  const onSubredditChange = (e) => {
    e.preventDefault();
    console.log(subredditEl.current.value);
    dispatch({ type: "SET_SUBREDDIT", subreddit: subredditEl.current.value });
  };
  const onListingTypeChange = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    dispatch({ type: "SET_LISTING_TYPE", listingType: e.target.value });
  };

  return (
    <>
      <form>
        <input ref={subredditEl} type="text" defaultValue={state.subreddit} />
        <button onClick={onSubredditChange}>Ok</button>
      </form>
      <select onChange={onListingTypeChange} defaultValue={state.listingType}>
        {
          Object.keys(reddit.LISTING_TYPES).map((k) => {
            const val = reddit.LISTING_TYPES[k];
            return <option key={val} value={val}>{val}</option>
          })
        }
      </select>
      {
        (state.endOfList)
          ? "No more videos in this bitch"
          : (state.videos[state.currentId])
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