import React, { useState } from 'react'
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { getPostById, deleteCommentFromPost, addCommentToPost } from '@/store/actions/posts';
import { v4 as uuidv4 } from 'uuid';

import { toast } from "react-toastify";

import s from './.module.scss'

const CommentItem = ({ comment, clickReply }) => {

    const dispatch: AppDispatch = useDispatch<AppDispatch>();
    const userUid = useSelector(({ user }) => user.uid);
    const userData = useSelector(({ user }) => user?.userData);
    const selectedPost = useSelector(({ posts }) => posts?.selectedPost);
    const [commentActions, setCommentActions] = useState(false);


    const formattedDate = (() => {
        const date = new Date(comment?.createdAt);
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const day = date.getDate();
        const month = date.toLocaleString("en-US", { month: "long" });
        const year = date.getFullYear();
        return `${hours}:${minutes} ${month} ${day}, ${year}`;
    })();

    const showCommentActions = () => {
        setCommentActions(!commentActions);
    }

    const createReplayMessage = () => {
        clickReply();
        setCommentActions(!commentActions);
    }

    const deleteComment = () => {
        dispatch(deleteCommentFromPost(selectedPost.id, comment.id))
        setCommentActions(!commentActions);
        dispatch(getPostById(selectedPost.id));
    }

    const flagComment = () => {
        setCommentActions(!commentActions);
        toast.error("Comment has been flaged, we're looking into it.");
    }

    return (
        <span className={s.wrapper}>
            <div
                className={`${s.userInfo} ${comment?.authorId === userUid ? s.imUser : ""}`}>
                <span className={s.userNameImg}>

                    <Image
                        width="20"
                        height="20"
                        src={comment?.authorAvatar || "/profile.jpg"}
                        alt="user-img"
                        loading="lazy"
                    />
                    &nbsp;
                    <span className={s.nameDateBox}>
                        <span className={s.authorName}>{comment?.authorNickname} </span>
                        <span className={s.dateTime}>{formattedDate}</span>
                    </span>
                </span>

                {comment?.replyToAuthorNickname &&
                    <div className={s.ifReply}>
                        <span>@{comment.replyToAuthorNickname}</span>

                        &nbsp;
                        <Image
                            width="20"
                            height="20"
                            src={comment?.replyToAuthorAvatar || "/profile.jpg"}
                            alt="user-img"
                            loading="lazy"
                        />
                    </div>


                }
            </div>
            <div
                className={`${s.comment} ${comment?.authorId === userUid ? s.myComment : ""}`}
            >
                <span
                    className={s.actionsLabel}
                    onClick={showCommentActions}
                >
                    {commentActions &&
                        <div className={s.actionsList}>
                            <div
                                className={s.actionItem}
                                onClick={createReplayMessage}>Reply</div>

                            {comment?.authorId === userUid &&
                                <div className={s.actionItem}
                                    onClick={deleteComment}>Delete</div>}
                            {comment?.authorId !== userUid &&
                                <div className={s.actionItem}
                                    onClick={flagComment}>Flag</div>}
                        </div>
                    }
                </span>
                <div className={s.commentText}>{comment.commentText}</div> {/* Adjust to match the structure of your comment data */}
            </div>
        </span>
    )
}

export default CommentItem
