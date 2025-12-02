import { format } from 'date-fns';

import React, { useEffect, useMemo, useState } from 'react';
import parse from "html-react-parser";

import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { EModalKind } from '@/components/shared/types';
import { getPostById, addNewClaps, deleteSelectedPost, setEditPost } from '@/store/actions/posts';
import { showModal } from '@/store/actions/modal';

import Page from "@/components/shared/ui/Page/Page";
import Button from '@/components/shared/ui/Button';
import Substrate from "@/components/shared/ui/Substrate/Substrate";
import PostActions from "./ui/ShareLink"
import Comments from './ui/Comments';

import { FaRegComment, FaGrinHearts } from "react-icons/fa";
import { PiHandsClappingDuotone } from "react-icons/pi";
import { toast } from "react-toastify";

import s from './PostDetails.module.scss';
import { loadMessages } from '@/components/shared/i18n/translationLoader';



const PostDetails = () => {
    const router = useRouter();
    const dispatch: AppDispatch = useDispatch<AppDispatch>();
    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const t = loadMessages(currentLocale);

    const [claps, setClaps] = useState(0)

    const userUid = useSelector(({ user }) => user.uid);
    const userData = useSelector(({ user }) => user?.userData);
    const selectedPost = useSelector(({ posts }) => posts?.selectedPost);


    const [showCommentSection, setShowCommentSection] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);


    // Parse content only if selectedPost and its content exist
    const parsedContent = selectedPost?.content ? parse(selectedPost.content) : null;

    const viewProfile = () => {
        router.push(`/specialist-profile/${selectedPost.creatorNickname}`);
    }

    const addClick = () => {
        setClaps(claps + 1);
    }

    const showComments = () => {
        setShowCommentSection(!showCommentSection)
    }

    const editPost = () => {
        console.log('Edit post')
        dispatch(setEditPost(true));
        dispatch(showModal(EModalKind.CreatePost));
    }


    // const deletePost = () => {
    //     // TODO add a modal asking for confirmation to delete Post

    //     dispatch(deleteSelectedPost(selectedPost.id))
    //     toast.error("Post Deleted!");
    //     router.push(`/news_feed`);
    // }
    const deletePost = () => {
        setShowConfirmModal(true); // Show confirmation modal
    };

    const confirmDelete = () => {
        dispatch(deleteSelectedPost(selectedPost.id));
        toast.error("Post Deleted!");
        router.push(`/news_feed`);
        setShowConfirmModal(false); // Close modal after deletion
    };



    useEffect(() => {
        if (selectedPost && claps !== selectedPost.claps) {
            const timeoutId = setTimeout(() => {
                dispatch(addNewClaps(selectedPost.id, claps));
            }, 3000);

            // Cleanup timer if `claps` changes again before 3 seconds
            return () => clearTimeout(timeoutId);
        }
    }, [claps, selectedPost, dispatch]);


    useEffect(() => {
        const { pathname, asPath } = router;
        if (userUid && selectedPost === null && pathname.startsWith('/post')) {
            const postId = asPath.split('/post/')[1]?.replace('/', '');
            dispatch(getPostById(postId));
        }
    }, [userUid, router, selectedPost, dispatch]);


    useEffect(() => {
        setClaps(selectedPost?.claps)
    }, [selectedPost])



    return (
        <Page className={s.userboardPage}>
            <Substrate className={s.userboard} color="bg-color">

                <h2 className={s.title}>{selectedPost?.title}</h2>
                <div
                    className={s.postAuthor}
                    onClick={viewProfile}
                >
                    {selectedPost?.creatorAvatar &&
                        <img src={selectedPost?.creatorAvatar} alt="Avatar" className={s.avatarNav} />
                    }
                    <span>{selectedPost?.creatorNickname}</span>
                </div>
                <div className={s.postDate}>
                    {new Date(selectedPost?.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: '2-digit',
                        year: 'numeric',
                    }).replace(/ /g, '  ')}
                </div>

                <hr />

                <div className={s.actionsSection}>
                    <div className="">
                        <div className={s.clapsComments}>
                            <div className={s.claps} onClick={addClick}>

                                {/* <span className={s.smallBtn}>Claps</span> */}

                                <span className={s.iconProps}>
                                    <PiHandsClappingDuotone size={24} title="Claps" />
                                </span>
                                {/* <span className={s.smallBtn}>{selectedPost?.claps}</span> */}
                                <span className={s.smallBtn}>{claps}</span>
                            </div>

                            <div className={s.comments} onClick={showComments}>
                                {/* <span className={s.smallBtn}>Comments</span> */}

                                <span className={s.iconProps}>
                                    <FaRegComment size={20} title="Comments" />
                                </span>
                                <span className={s.smallBtn}> {selectedPost?.comments.length}</span>
                            </div>

                            {userUid === selectedPost?.creatorId &&
                                <div className={s.authorActions}>
                                    <Button className={s.actionItem}
                                        onClick={editPost}
                                    >
                                        {t.edit}
                                    </Button>
                                    <Button

                                        className={s.actionItem}
                                        onClick={deletePost}
                                    >
                                        {t.delete}
                                    </Button>
                                </div>
                            }
                        </div>


                    </div>
                    <PostActions />
                </div>
                <hr />

                <div className={s.container}>
                    {selectedPost?.imageUrl && (
                        <div className={s.imageWrapper}>
                            <img src={selectedPost?.imageUrl} alt="postImg" />
                        </div>
                    )}
                </div>


                <div className={s.content}>
                    {Array.isArray(parsedContent) ? (
                        parsedContent.map((block, index) => (
                            <p key={index}>{block.props?.children || ""}</p>
                        ))
                    ) : (
                        <p>{parsedContent}</p>
                    )}
                </div>
            </Substrate>
            <Comments
                showCommentSection={showCommentSection}
                setShowCommentSection={setShowCommentSection}
            />
            {showConfirmModal && (
                <div className={s.confirmModal}>
                    <div className={s.modalContent}>
                        <p>{t.sure_to_delete}</p>
                        <div className={s.modalActions}>
                            <Button onClick={confirmDelete}>{t.yes_delete}</Button>
                            <Button  onClick={() => setShowConfirmModal(false)}>{t.cancel}</Button>
                        </div>
                    </div>
                </div>
            )}

        </Page>
    );
};
export default PostDetails;
