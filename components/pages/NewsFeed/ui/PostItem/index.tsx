import React from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedPost } from "@/store/actions/posts";
import parse from "html-react-parser";
import Button from '@/components/shared/ui/Button';
import s from "./PostItem.module.scss";

const PostItem = ({
    id,
    title,
    content,
    creatorId,
    creatorAvatar,
    creatorNickname,
    imageUrl, createdAt,
    claps,
    comments,
    post
}) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const parsedContent = parse(content);

    const viewProfile = () => {
        router.push(`/specialist-profile/${creatorNickname}`);
    }

    const onPostClick = () => {
        if (id) {
            dispatch(setSelectedPost(post));
            router.push(`/post/${id}`);
        } else {
            console.warn('Id is missing for navigation');
        }
    };

    return (
        <div className={s.postItem} >
            <div
                onClick={viewProfile}
                className={s.postAuthor}>
                {creatorAvatar &&
                    <img src={creatorAvatar} alt="Avatar" className={s.avatarNav} />
                }
                <span>{creatorNickname}</span>
            </div>
            <div className={s.post}>
                <div className={s.postBody}>
                    <span onClick={onPostClick}>
                        <h3 className={s.title}>{title}</h3>

                        <div className={s.content} >
                            {Array.isArray(parsedContent) ? (
                                parsedContent.map((block, index) => (
                                    <span key={index}>{block.props?.children || ""}</span>
                                ))
                            ) : (
                                <p>{parsedContent}</p>
                            )}
                        </div>
                    </span>




                    <div className={s.btnSection}>
                        <div className={s.postDate}>
                            {new Date(createdAt).toLocaleDateString('en-US', {
                                month: 'long',
                                day: '2-digit',
                                year: 'numeric',
                            }).replace(/ /g, '  ')}
                        </div>
                        <div className={s.claps}>
                            <span className={s.clapsLabel}>Claps:</span>
                            <span>{claps}</span>
                        </div>

                        <div className={s.comments}>
                            <span className={s.clapsLabel}> Comments: </span>
                            <span>{comments?.length}</span>

                        </div>
                    </div>
                </div>

                <div className={s.container}>
                    {imageUrl && (
                        <div className={s.imageWrapper}>
                            <img src={imageUrl} alt="postImg" />
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default PostItem;
