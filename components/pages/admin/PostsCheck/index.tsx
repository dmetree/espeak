import React, { useEffect } from 'react';

import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Page from "@/components/shared/ui/Page/Page";
import Substrate from "@/components/shared/ui/Substrate/Substrate";
import Button from "@/components/shared/ui/Button";
import s from './.module.css';

export const PostCheck = () => {

    const router = useRouter();
    const dispatch = useDispatch();

    const userUid = useSelector(({ user }) => user.uid);
    const reportedPostsList = useSelector(({ posts }) => posts.reportedPostsList);

    const viewPostHandle = () => {
        console.log("View post. Delete the post if content is inappropriate")
    }

    // useEffect(() => {
    //   TODO: fetch posts that are marked as "inappropriate";
    // }, [])


    return (
        <Page className=''>
            <Substrate className='' color="bg-color">
                <h3>Reported posts check</h3>
                {reportedPostsList?.isLoading ? (
                    <div>Loading...</div>
                ) : (
                    <div className={s.articles}>
                        {reportedPostsList?.length === 0 && <div>No new posts complaints have been received.</div>}
                        {reportedPostsList?.map((post: any, index: number) => (
                            <div className={s.articleItem} key={index}>
                                <div className={s.creatorId}>Creator: {post.creatorId}</div>
                                <div className="">Title: {post.content}</div>
                                <div className="">
                                    <div className=""> Author: email / nickname</div>
                                </div>

                                <div className={s.btnBlock}>
                                    <Button
                                        className={s.articleBtn}
                                        onClick={viewPostHandle}
                                    >View</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Substrate>
        </Page>
    )
}