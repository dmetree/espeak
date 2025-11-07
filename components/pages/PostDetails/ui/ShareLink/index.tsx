import React, { useState, useEffect } from "react";
import {
    FacebookShareButton,
    LinkedinShareButton,
    TwitterShareButton,
    XIcon
} from "react-share";
import {
    BiLink,
    BiLogoFacebookCircle,
    BiLogoTwitter,
    BiLogoLinkedinSquare,
} from "react-icons/bi";
import { toast } from "react-toastify";

import s from './.module.scss'

const SharePost = () => {
    const [path, setPath] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setPath(window.location.href); // Update path only in the browser
        }
    }, []);

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(path);
            toast.success("Link has been copied");

        } catch (error) {
            toast.error(error.message);

        }
    };

    return (
        <div className="relative">
            <span className={s.shareIcon} onClick={copyLink}>
                <BiLink size={24} />
            </span>

            <span className={s.shareIcon}>
                <TwitterShareButton url={path} title="Share on Twitter">
                    <XIcon size={22} />
                </TwitterShareButton>
            </span>


            <span className={s.shareIcon}>
                <FacebookShareButton url={path} title="Share on Facebook">
                    <BiLogoFacebookCircle size={24} />
                </FacebookShareButton>
            </span>

            <span className={s.shareIcon}>

                <LinkedinShareButton url={path} title="Share on LinkedIn">
                    <BiLogoLinkedinSquare size={24} />
                </LinkedinShareButton>
            </span>
        </div>
    );
};

export default SharePost;