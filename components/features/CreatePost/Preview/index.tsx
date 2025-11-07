import React, { useEffect, useRef, useState } from "react";

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from '@/components/shared/utils/firebase/init';

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";

import { loadMessages } from '@/components/shared/i18n/translationLoader';
import { createPost, setEditPost, updatePost } from "@/store/actions/posts";
import { hideModal } from "@/store/actions/modal";
import { NoAuthError, EModalKind } from "@/components/shared/types";

import { LiaTimesSolid } from "react-icons/lia";
import dynamic from "next/dynamic";
import TagsInput from "react-tagsinput";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

import Page from "@/components/shared/ui/Page/Page";
import Button from "@/components/shared/ui/Button";
import parse from "html-react-parser";

import s from "./Preview.module.scss";

// Dynamically load ReactQuill
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import 'react-quill/dist/quill.bubble.css';
import 'react-tagsinput/react-tagsinput.css'
import { spawn } from "child_process";

interface PreviewProps {
    setPublish: any;
    description: any;
    title: any;
    setDescription: any;
}

interface PreviewState {
    title: string;
    photo: File | string;
}

const Preview: React.FC<PreviewProps> = ({ setPublish, description, title, setDescription }) => {
    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const t = loadMessages(currentLocale);

    const router = useRouter();
    const dispatch: AppDispatch = useDispatch<AppDispatch>();
    const userUid = useSelector(({ user }) => user.uid);
    const userData = useSelector(({ user }) => user?.userData);
    const selectedPost = useSelector(({ posts }) => posts?.selectedPost);
    const editPost = useSelector(({ posts }) => posts?.editPost);

    const imageRef = useRef<HTMLInputElement>(null); // Explicitly define the type
    const [imageUrl, setImageUrl] = useState("");
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(false);

    const [preview, setPreview] = useState<PreviewState>({
        title: "",
        photo: "", // Initially a string
    });

    const handleImageClick = () => {
        imageRef.current?.click(); // Now TypeScript knows 'click' exists
    };

    useEffect(() => {
        setPreview((prev) => ({
            ...prev,
            title,
        }));
    }, [title]);

    useEffect(() => {
        if (editPost) {
            setImageUrl(selectedPost?.imageUrl);
            setTags(selectedPost?.tags);
        }
    }, [editPost, selectedPost])


    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (!preview.title || !description || tags.length === 0) {
                toast.error("All fields are required!");
                return;
            }

            if (preview.title.length < 15) {
                toast.error("Title must be at least 15 characters.");
                return;
            }

            let url = "";
            if (imageUrl && preview.photo instanceof File) { // Ensure it's a File before accessing `.name`
                const storageRef = ref(storage, `image/${preview.photo.name}`);
                await uploadBytes(storageRef, preview.photo);
                url = await getDownloadURL(storageRef);
            }

            const postData = {
                creatorId: userUid,
                creatorNickname: userData.nickname,
                creatorAvatar: userData.avatar,
                title: preview.title,
                content: description, // Use rich text content
                tags,
                imageUrl: url === "" ? imageUrl : url,
                pageViews: 0,
                comments: [],
                claps: 0,
                createdAt: new Date().toISOString(),
            };

            // New post
            if (!editPost) {
                await dispatch(createPost(postData));
                toast.success("Post created!");
            }

            // Edit post
            if (editPost) {
                await dispatch(updatePost(selectedPost?.id, postData));
                dispatch(setEditPost(false));
            }

            dispatch(hideModal(EModalKind.CreatePost));
            router.push("/news_feed");

            setPublish(false);
            setPreview({ title: "", photo: "" });
        } catch (error) {
            if (error instanceof NoAuthError) {
                router.push("/login");
            }
            console.error("Submission Error:", error);
            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Page className={s.previewContainer}>
            <div className={s.size}>
                <span onClick={() => setPublish(false)} className={s.closeIcon}>
                    <LiaTimesSolid />
                </span>
                <div className={s.contentContainer}>
                    <div className={s.storyPreview}>
                        <h2 className={s.header}>{t.create_post} Preview</h2>
                        <div
                            style={{ backgroundImage: `url(${imageUrl})` }}
                            onClick={handleImageClick}
                            className={s.imageContainer}
                        >
                            {!imageUrl && "Add Image"}
                        </div>
                        <input
                            onChange={(e) => {
                                const files = e.target.files; // Extract files to avoid repeating `e.target.files`
                                if (files && files[0]) {
                                    setImageUrl(URL.createObjectURL(files[0]));
                                    setPreview({ ...preview, photo: files[0] });
                                } else {
                                    console.error("No file selected.");
                                }
                            }}
                            ref={imageRef}
                            type="file"
                            hidden
                        />
                        {/* <input
                            type="text"
                            placeholder="Title"
                            className={s.titleInput}
                            value={preview.title}
                            onChange={(e) =>
                                setPreview({ ...preview, title: e.target.value })
                            }
                        />
                        <div className={s.previewBlock}>
                            {parse(description)}
                        </div> */}
                        <p className={s.note}>
                            <span className={s.noteBold}>

                                {!editPost && <span>Note:</span>}
                                {editPost && <span>WARNING!</span>}
                            </span>&nbsp;

                            {!editPost && <span>Changes here will affect how your story appears in public places.</span>}
                            {editPost && <span>When you UPDATE your post existing comments and claps are deleted.</span>}
                        </p>
                    </div>
                    <div className={s.publishingInfo}>
                        <h3 className={s.publishHeading}>
                            Publishing to: &nbsp;
                            <span className={s.publishName}>{userData?.nickname}</span>
                        </h3>
                        <p>
                            Add or change topics up to 5 so readers know what your story is
                            about
                        </p>
                        <TagsInput value={tags} onChange={setTags} />
                        <Button onClick={handleSubmit} >
                            {loading ? "Submitting..." : "Publish Now"}
                        </Button>
                    </div>
                </div>
            </div>
        </Page>
    );
};

export default Preview;
