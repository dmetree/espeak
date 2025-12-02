import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { addCommentToPost, getPostById } from "@/store/actions/posts";
import { v4 as uuidv4 } from 'uuid';

import CommentItem from "./../CommentItem";

import Button from '@/components/shared/ui/Button';
import { LiaTimesSolid } from "react-icons/lia";
import { toast } from "react-toastify";

import s from "./.module.scss";

const Comments = ({ showCommentSection, setShowCommentSection }) => {
    const router = useRouter();
    const dispatch: AppDispatch = useDispatch<AppDispatch>();


    const userUid = useSelector(({ user }) => user.uid);
    const userData = useSelector(({ user }) => user?.userData);
    const selectedPost = useSelector(({ posts }) => posts?.selectedPost);

    // States
    const [comment, setComment] = useState("");
    const [replyTo, setReplyTo] = useState(null); // Track reply context

    // Handle replying to a comment
    const replyClick = (commentData) => {
        setReplyTo({
            replyToPostText: commentData.commentText,
            replyToAuthorId: commentData.authorId,
            replyToAuthorAvatar: commentData.authorAvatar,
            replyToAuthorNickname: commentData.authorNickname,
        });
    };

    const cancelReply = () => {
        setReplyTo(null);
    }


    const writeComment = () => {
        if (!comment.trim()) {
            toast.error("Comment cannot be empty.");
            return;
        }

        const commentToPost = {
            id: uuidv4(),
            authorId: userUid,
            authorAvatar: userData?.avatar || "",
            authorNickname: userData?.nickname || "Anonymous",
            commentText: comment.trim(),
            commentClaps: 0,
            createdAt: new Date().toISOString(), // Replace with Firebase timestamp if required
            ...replyTo, // Include reply context if replying
        };


        dispatch(addCommentToPost(selectedPost.id, commentToPost))
        setComment("");
        setReplyTo(null); // Clear reply context
        toast.success("Sent!");
        dispatch(getPostById(selectedPost.id));
    };

    return (
        <div>
            <section
                className={`${s.commentSection} ${showCommentSection ? s.visible : s.hidden
                    }`}
            >
                {/* <span className={s.wrapper}> */}
                {/* Header */}
                <div className={s.header}>
                    <h3>Comments({selectedPost?.comments?.length || 0})</h3>
                    <button onClick={() => setShowCommentSection(!showCommentSection)}>
                        <LiaTimesSolid />
                    </button>
                </div>



                {/* Comments Section */}
                {selectedPost?.comments?.length === 0 ? (
                    <p className={s.noComments}>This post has no comments</p>
                ) : (
                    <div className={s.commentsSection}>
                        {selectedPost?.comments?.map((comment) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                clickReply={() => replyClick(comment)}
                            />
                        ))}
                    </div>
                )}

                {/* Comment Form */}
                {userUid && (
                    <div className={s.commentForm}>

                        {replyTo &&
                            <div className={s.replyToInfo}>
                                <span className={s.replyTo}>
                                    <span>
                                        Re: &nbsp;
                                    </span>


                                    <span>@{replyTo?.replyToAuthorNickname}</span>
                                    &nbsp;
                                    <Image
                                        width="20"
                                        height="20"
                                        src={replyTo?.replyToAuthorAvatar || "/profile.jpg"}
                                        alt="user-img"
                                        loading="lazy"
                                    />
                                </span>
                                <span className={s.replyTextWrapper}>
                                    <span>{replyTo?.replyToPostText}</span>
                                    <Button

                                        className={s.smallCancel}
                                        onClick={cancelReply}>X</Button>
                                </span>

                            </div>
                        }
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="What are your thoughts?"
                        ></textarea>
                        <div className={s.actions}>
                            {/* <button onClick={() => setComment("")}>Cancel</button> */}
                            <Button onClick={writeComment} className={s.responseBtn}>
                                Send
                            </Button>
                        </div>
                    </div>
                )}
                {/* </span> */}
            </section>
        </div>
    );
};

export default Comments;
