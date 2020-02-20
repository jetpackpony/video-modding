
export const initialState = {
  duration: 0,
  start: 0,
  end: 0,
  isPlaying: false,
};

export const actions = {
  INIT_VIDEO: "INIT_VIDEO",
  UPDATE_START: "UPDATE_START",
  UPDATE_END: "UPDATE_END",
  SET_IS_PLAYING: "SET_IS_PLAYING",
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
    default:
      throw new Error("Unknown action in Player reducer: ", action, state);
  }
};
