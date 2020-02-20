
export const initialState = {
  duration: 0,
  start: 0,
  end: 0,
  isPlaying: false,
  isMuted: false,
  selectedMusicFile: "",
  musicRangeValue: 0
};

export const actions = {
  INIT_VIDEO: "INIT_VIDEO",
  UPDATE_START: "UPDATE_START",
  UPDATE_END: "UPDATE_END",
  SET_IS_PLAYING: "SET_IS_PLAYING",
  SET_MUTED: "SET_MUTED",
  SET_MUSIC_FILE: "SET_MUSIC_FILE",
  SET_MUSIC_RANGE: "SET_MUSIC_RANGE",
};

export const reducer = (state, action) => {
  switch(action.type) {
    case actions.INIT_VIDEO:
      return {
        ...state,
        duration: action.duration,
        start: 0,
        end: action.duration
      };
    case actions.UPDATE_START:
      return {
        ...state,
        start: action.newStart
      };
    case actions.UPDATE_END:
      return {
        ...state,
        end: action.newEnd
      };
    case actions.SET_IS_PLAYING:
      return {
        ...state,
        isPlaying: action.isPlaying
      };
    case actions.SET_MUTED:
      return {
        ...state,
        isMuted: action.isMuted
      };
    case actions.SET_MUSIC_FILE:
      return {
        ...state,
        selectedMusicFile: action.fileName,
      };
    case actions.SET_MUSIC_RANGE:
      return {
        ...state,
        musicRangeValue: action.start
      };
    default:
      console.log("Unknown action in Player reducer: ", action, state);
      throw new Error("Unknown action in Player reducer");
  }
};
