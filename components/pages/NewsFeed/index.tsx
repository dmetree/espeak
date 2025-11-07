import React, { useEffect } from 'react'
import Image from 'next/image';

import { useRouter } from "next/router";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from "@/store";
import { fetchPosts } from '@/store/actions/posts';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import Page from "@/components/shared/ui/Page/Page";
import Substrate from "@/components/shared/ui/Substrate/Substrate";

import PostItem from './ui/PostItem';

import s from './.module.scss';

const NewsFeed = () => {
    const router = useRouter();
    const dispatch: AppDispatch = useDispatch<AppDispatch>();

    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const t = loadMessages(currentLocale);

    const postsList = useSelector(({ posts }) => posts.postsList);


    useEffect(() => {
        dispatch(fetchPosts())
    }, [])


    return (
        <Page>
            <Substrate color="bg-color">
                <div className={s.postsContainer}>
                    {postsList && postsList.length > 0 ? (
                        postsList.map((post) => (
                            <PostItem
                                key={post.id}
                                id={post.id}
                                title={post.title}
                                content={post.content}
                                creatorId={post.creatorId}
                                creatorAvatar={post.creatorAvatar}
                                creatorNickname={post.creatorNickname}
                                imageUrl={post.imageUrl}
                                createdAt={post.createdAt}
                                claps={post.claps}
                                comments={post.comments}
                                post={post}
                            />
                        ))
                    ) : (
                        <p>No posts or posts not loading...</p>
                    )}
                </div>
            </Substrate>
        </Page>
    )
}

export default NewsFeed;
