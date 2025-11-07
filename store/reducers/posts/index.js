import * as actionTypes from "../../actionTypes";

const initState = {
  post: null,
  editPost: false,
  selectedPost: null,
  postsList: [],
  error: null,
  isLoading: false,
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.TOGGLE_LOADING:
      return {
        ...state,
        isLoading: !state.isLoading,
      };

    case actionTypes.FETCH_POSTS:
      return {
        ...state,
        postsList: action.data,
        error: null,
      };

    case actionTypes.CREATE_POST_SUCCESS:
      return {
        ...state,
        postsList: [action.data, ...state.postsList],
        error: null,
      };
    case actionTypes.GET_POST_BY_ID_SUCCESS:
      return {
        ...state,
        selectedPost: action.data,
      };
    case actionTypes.SET_SELECTED_POST:
      return {
        ...state,
        selectedPost: action.payload,
      };
    case actionTypes.UPDATE_POST_CLAPS:
      // Update the claps count for the selected post
      if (state.selectedPost?.id === action.payload.postId) {
        return {
          ...state,
          selectedPost: {
            ...state.selectedPost,
            claps: action.payload.claps,
          },
        };
      }
    case actionTypes.ADD_COMMENT_SUCCESS:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload.postId
            ? {
                ...post,
                comments: [
                  ...(post.comments || []),
                  action.payload.commentData,
                ],
              }
            : post
        ),
      };
    case actionTypes.DELETE_COMMENT_SUCCESS: {
      const { commentId } = action.payload;

      return {
        ...state,
        comments: state.comments.filter((comment) => comment.id !== commentId),
      };
    }
    case actionTypes.SET_EDIT_POST:
      const { editState } = action.payload;
      return {
        ...state,
        editPost: editState,
      };
    case actionTypes.UPDATE_POST_SUCCESS:
      return {
        ...state,
        postsList: state.postsList.map((post) =>
          post.id === action.payload.postId
            ? { ...post, ...action.payload.postData }
            : post
        ),
        selectedPost:
          state.selectedPost?.id === action.payload.postId
            ? { ...state.selectedPost, ...action.payload.postData }
            : state.selectedPost,
      };
    case actionTypes.ADD_COMMENT_ERROR:
      return { ...state, error: action.error };

    case actionTypes.CREATE_POST_ERROR:
    case actionTypes.FETCH_POSTS_ERROR:
    case actionTypes.GET_POST_BY_ID_ERROR:
      return {
        ...state,
        error: action.error,
      };

    default:
      return state;
  }
};

export default reducer;
