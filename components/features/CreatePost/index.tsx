"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic"; // Import for dynamic loading
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import { createPost } from '@/store/actions/posts';
import { hideModal } from '@/store/actions/modal';
import { EModalKind } from '@/components/shared/types';

import Preview from './Preview';

import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { NoAuthError } from "@/components/shared/types";
import { useRouter } from "next/router";
import "react-toastify/dist/ReactToastify.css";
import Page from "@/components/shared/ui/Page/Page";
import Button from "@/components/shared/ui/Button";
import ReactQuill from "react-quill";
import s from './.module.scss';
import "react-quill/dist/quill.snow.css";


// Dynamically import ReactQuill
// const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
// import 'react-quill/dist/quill.bubble.css';

const CreatePost = () => {
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);

  const userUid = useSelector(({ user }) => user.uid);
  const userData = useSelector(({ user }) => user?.userData);
  const selectedPost = useSelector(({ posts }) => posts?.selectedPost);
  const editPost = useSelector(({ posts }) => posts?.editPost);

  const [publish, setPublish] = useState(false);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");


  useEffect(() => {
    if (editPost) {
      setTitle(selectedPost?.title);
      setDescription(selectedPost?.content);
    }
  }, [editPost, selectedPost])


  const publishPost = () => {
    setPublish(true);
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "color", "image"],
      [{ "code-block": true }],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "indent",
    "image",
    "code-block",
    "color",
  ];

  return (
    <Page className={s.page}>
      <div className={s.createPostContainer}>
        <h2 className={s.header}>{t.create_post}</h2>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="Title"
          className={s.titleInput}
        />

        <ReactQuill
          theme="snow"
          value={description}
          onChange={setDescription}

          modules={modules}
          formats={formats}
          placeholder="Tell Your Story..."
          className={s.write}
        />

        <div className={`${publish ? s.visible : s.invisible}`}>
          <Preview
            setPublish={setPublish}
            description={description}
            setDescription={setDescription}
            title={title}
          />
        </div>
        <br />
        <Button onClick={publishPost}>{t.publish}</Button>
      </div>
    </Page>
  );
};

export default CreatePost;
