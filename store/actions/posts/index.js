import {
  collection,
  getDocs,
  updateDoc,
  addDoc,
  doc,
  getDoc,
  arrayUnion,
  deleteDoc,
  arrayRemove,
} from "firebase/firestore";
import { database } from "@/components/shared/utils/firebase/init";
import * as actionTypes from "../../actionTypes";

// Action to toggle loading state
export const toggleLoading = () => ({
  type: actionTypes.TOGGLE_LOADING,
});

// Action to fetch posts
export const fetchPosts = () => async (dispatch) => {
  dispatch(toggleLoading());

  try {
    // Correct Firestore query
    const postsRef = collection(database, "posts");
    const querySnapshot = await getDocs(postsRef);

    const posts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    dispatch({
      type: actionTypes.FETCH_POSTS,
      data: posts,
    });
  } catch (error) {
    console.error("Error fetching applications:", error.message);

    dispatch({
      type: actionTypes.FETCH_POSTS_ERROR,
      error: error.message,
    });
  } finally {
    dispatch(toggleLoading());
  }
};

// Action to create a post
export const createPost = (postData) => async (dispatch) => {
  dispatch(toggleLoading());

  try {
    const postsRef = collection(database, "posts");
    const docRef = await addDoc(postsRef, postData);

    dispatch({
      type: actionTypes.CREATE_POST_SUCCESS,
      data: { id: docRef.id, ...postData },
    });
  } catch (error) {
    console.error("Error creating post:", error.message);

    dispatch({
      type: actionTypes.CREATE_POST_ERROR,
      error: error.message,
    });
  } finally {
    dispatch(toggleLoading());
  }
};

// Action to get a post by ID
export const getPostById = (postId) => async (dispatch) => {
  dispatch(toggleLoading()); // Show loading indicator

  try {
    if (!postId) {
      throw new Error("Invalid postId");
    }

    // Reference the document in Firestore
    const postRef = doc(database, "posts", postId);
    const postDoc = await getDoc(postRef);

    if (postDoc.exists()) {
      // Dispatch success action with the retrieved data
      dispatch({
        type: actionTypes.GET_POST_BY_ID_SUCCESS,
        data: { id: postId, ...postDoc.data() },
      });
    } else {
      throw new Error("Post not found");
    }
  } catch (error) {
    console.error("Error fetching post by ID:", error.message);

    // Dispatch error action with error message
    dispatch({
      type: actionTypes.GET_POST_BY_ID_ERROR,
      error: error.message,
    });
  } finally {
    dispatch(toggleLoading()); // Hide loading indicator
  }
};

export const setSelectedPost = (post) => ({
  type: actionTypes.SET_SELECTED_POST,
  payload: post,
});

export const addNewClaps = (postId, newClapsCount) => async (dispatch) => {
  try {
    // Update the claps field in the Firestore document
    const postRef = doc(database, "posts", postId);
    await updateDoc(postRef, { claps: newClapsCount });

    // Dispatch a success action to update Redux state
    dispatch({
      type: actionTypes.UPDATE_POST_CLAPS,
      payload: { postId, claps: newClapsCount },
    });
  } catch (error) {
    console.error("Error updating claps:", error);
    // Handle error if needed, e.g., dispatch an error action
  }
};

export const addCommentToPost = (postId, commentData) => async (dispatch) => {
  dispatch(toggleLoading()); // Show loading indicator

  try {
    if (!postId || !commentData) {
      throw new Error("Invalid postId or commentData");
    }

    // Reference the post document in Firestore
    const postRef = doc(database, "posts", postId);

    // Update the comments array using arrayUnion
    await updateDoc(postRef, {
      comments: arrayUnion(commentData),
    });

    // Dispatch success action to update Redux state
    dispatch({
      type: actionTypes.ADD_COMMENT_SUCCESS,
      payload: { postId, commentData },
    });
  } catch (error) {
    console.error("Error adding comment:", error.message);

    // Dispatch error action to Redux
    dispatch({
      type: actionTypes.ADD_COMMENT_ERROR,
      error: error.message,
    });
  } finally {
    dispatch(toggleLoading()); // Hide loading indicator
  }
};

export const deleteSelectedPost = (postId) => async (dispatch) => {
  dispatch(toggleLoading()); // Show loading indicator

  try {
    if (!postId) {
      throw new Error("Invalid postId");
    }

    // Reference the post document in Firestore
    const postRef = doc(database, "posts", postId);

    // Delete the document
    await deleteDoc(postRef);

    // Dispatch success action to update Redux state
    dispatch({
      type: actionTypes.DELETE_POST_SUCCESS,
      payload: { postId },
    });
  } catch (error) {
    console.error("Error deleting post:", error.message);

    // Dispatch error action with the error message
    dispatch({
      type: actionTypes.DELETE_POST_ERROR,
      error: error.message,
    });
  } finally {
    dispatch(toggleLoading()); // Hide loading indicator
  }
};

export const deleteCommentFromPost =
  (postId, commentId) => async (dispatch, getState) => {
    dispatch(toggleLoading()); // Show loading indicator

    try {
      if (!postId || !commentId) {
        throw new Error("Invalid postId or commentId");
      }

      // Get the current comment from Redux state
      const state = getState();
      const { comments } = state.posts.selectedPost;

      // Find the comment to be deleted
      const commentToDelete = comments.find(
        (comment) => comment.id === commentId
      );

      if (!commentToDelete) {
        throw new Error("Comment not found in Redux state");
      }

      // Reference the post document in Firestore
      const postRef = doc(database, "posts", postId);

      // Remove the comment from Firestore
      await updateDoc(postRef, {
        comments: arrayRemove(commentToDelete),
      });

      // Dispatch success action to update Redux state
      dispatch({
        type: actionTypes.DELETE_COMMENT_SUCCESS,
        payload: { postId, commentId },
      });
    } catch (error) {
      console.error("Error deleting comment:", error.message);

      // Dispatch error action with the error message
      dispatch({
        type: actionTypes.DELETE_COMMENT_ERROR,
        error: error.message,
      });
    } finally {
      dispatch(toggleLoading()); // Hide loading indicator
    }
  };

export const setEditPost = (editState) => ({
  type: actionTypes.SET_EDIT_POST,
  payload: { editState },
});

export const updatePost = (postId, postData) => async (dispatch) => {
  dispatch(toggleLoading()); // Show loading indicator

  try {
    if (!postId || !postData) {
      throw new Error("Invalid postId or postData");
    }

    // Reference the post document in Firestore
    const postRef = doc(database, "posts", postId);

    // Update the Firestore document with the provided data
    await updateDoc(postRef, postData);

    // Dispatch success action to update Redux state
    dispatch({
      type: actionTypes.UPDATE_POST_SUCCESS,
      payload: { postId, postData },
    });
  } catch (error) {
    console.error("Error updating post:", error.message);

    // Dispatch error action to Redux
    dispatch({
      type: actionTypes.UPDATE_POST_ERROR,
      error: error.message,
    });
  } finally {
    dispatch(toggleLoading()); // Hide loading indicator
  }
};
