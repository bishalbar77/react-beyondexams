import { FETCH_VIDEOS, UPDATE_COMPONENT, HANDLE_LIKE, HANDLE_ANNOTATION_CHANGE, HANDLE_COMMENT_CHANGE, HANDLE_LOAD } from "../actions/actionTypes";

const intialState = {
  videos: [],
  index: 0,
  initial: false,
  loading: true,
  liked: false,
  startTime: 0,
  endTime: null,
  autoPlay: 0,
  token: null,
  askifyLength: null,
  tags: [],
  courseId: null,
  course: null,
};

export default (state = intialState, action) => {
  switch (action.type) {
    case FETCH_VIDEOS: {
      return {
        ...state,
        loading: action.loading,
        initial: action.initial,
        token: action.token,
        index: action.index,
        startTime: action.startTime,
        endTime: action.endTime,
        autoPlay: action.autoPlay,
        askifyLength: action.askifyLength,
        selectedVideo: action.selectedVideo,
        videos: action.videos,
        courseId: action.courseId,
        course: action.course,
      };
    }
    case UPDATE_COMPONENT: {
      return {
        ...state,
        selectedVideo: state.videos[action.index],
        index: action.index,
        liked: action.liked,
        startTime: action.startTime,
        loading: false,
        autoPlay: action.autoPlay,
        token: action.token,
      };
    }
    case HANDLE_LIKE: {
      return {
        ...state,
        liked: action.liked,
      };
    }
    case HANDLE_ANNOTATION_CHANGE: {
      let selectedVideo = state.selectedVideo;
      selectedVideo.annotations = action.timeStampedNotes;
      return {
        ...state,
        selectedVideo: selectedVideo,
      };
    }
    case HANDLE_COMMENT_CHANGE: {
      let commentsArray = [...state.comments];
      commentsArray.unshift({
        snippet: {
          topLevelComment: {
            snippet: {
              authorProfileImageUrl: "https://cdn0.iconfinder.com/data/icons/social-media-network-4/48/male_avatar-512.png",
              authorDisplayName: "User",
              textOriginal: action.message,
            },
          },
        },
      });
      return {
        ...state,
        comments: commentsArray,
      };
    }
    case HANDLE_LOAD: {
      return {
        ...state,
        loading: true,
      };
    }
    default:
      return state;
  }
};
