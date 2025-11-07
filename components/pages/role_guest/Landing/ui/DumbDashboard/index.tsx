import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import { fetchMyAppointments } from '@/store/actions/appointments';
import { EUserRole, EModalKind } from "@/components/shared/types";
import { showModal } from '@/store/actions/modal';
import { WalletIcon } from "@/components/pages/Dashboard/Icons/wallet";

import { fetchPosts, setEditPost } from "@/store/actions/posts";

import { ISpecProfile } from "@/components/shared/types";

import { useIsLessThan } from '@/components/shared/utils/isMobile';
import Page from "@/components/shared/ui/Page/Page";
import Substrate from "@/components/shared/ui/Substrate/Substrate";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import s from './.module.scss';

import * as blockChainActions from "@/store/actions/networkCardano";
import { spawn } from "child_process";
import EventItem from "@/components/pages/role_guest/EventList/ui/EventItem";
import { fetchEvents } from "@/store/actions/events_actions";
import Button from "@/components/shared/ui/Button";
import SpecialistCard from "@/components/pages/ViewExperts/TherapistCard";
import { findRandomSpecialists } from "@/store/actions/specialists";
import PostItem from "@/components/pages/NewsFeed/ui/PostItem";
import Footer from "@/components/features/Footer";

import { eventsList } from './../DumbData/DumbEventList';
import { postsList } from './../DumbData/DumbPostList';
import { specialistList } from './../DumbData/DumbSpecialistList';

const Dashboard = () => {

    const currentLocale = useSelector(({ locale }) => locale.currentLocale);

    const t = loadMessages(currentLocale);
    const router = useRouter();

    const isMobile = useIsLessThan(768);

    const capitalizeFirstLetters = (str: string) =>
        str.replace(/\b\w/g, (char) => char.toUpperCase());

    const handleMyAppointments = () => {
        router.push("/novice_appointments");
    }

    const handleBookSession = () => {

    };

    const handleGoToOffice = () => {
        router.push("/office");
    }

    const handleWriteArticle = () => {

    }

    const handleCollectRewards = () => {
        router.push("/claim_rewards");
    }

    const handleCreateEvent = () => {
        router.push("/create_event");
    }

    const handleClientRequests = () => {
        router.push("/psy_requests");
    }


    const handleViewEventsList = () => {
        router.push("/event_list");
    }

    const handleExpertSearch = () => {
        router.push("/view_experts");
    }

    const handleWorkAsTherapist = () => {
        router.push("/become_mindhealer");
    }

    const handleBecomePartner = () => {
        router.push("/become_partner");
    }

    const handleNewsFeed = () => {
        router.push("/news_feed");
    }

    const handleCreateWallet = () => {
        if (currentLocale === "en") {
            window.open("https://www.youtube.com/watch?v=jktq2jOiSOQ", "_blank");
        }

        if (currentLocale === "ru") {
            window.open("https://www.youtube.com/watch?v=jktq2jOiSOQ", "_blank");
        }
    };

    const handleGetSigUSD = () => {
        if (currentLocale === "en") {
            window.open("", "_blank");
        }

        if (currentLocale === "ru") {
            window.open("", "_blank");
        }
    };

    const handleHowToBuyErgo = () => {
        if (currentLocale === "en") {
            window.open("", "_blank");
        }

        if (currentLocale === "ru") {
            window.open("", "_blank");
        }
    }

    const handleCreateKuCoinAccount = () => {
        if (currentLocale === "en") {
            window.open("", "_blank");
        }

        if (currentLocale === "ru") {
            window.open("", "_blank");
        }
    }

    const handleP2PKuCoin = () => {
        if (currentLocale === "en") {
            window.open("", "_blank");
        }

        if (currentLocale === "ru") {
            window.open("", "_blank");
        }
    }

    // Doesn't work has to be fixed somehow...
    const scrollToTop = () => {
        console.log("Scrollin..");
        if (typeof window !== "undefined") {
            const el = document.querySelector("#scrollable-container"); // change selector
            if (el) {
                el.scrollTo({ top: 0, behavior: "smooth" });
            } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        }
    };


    return (
        <Substrate className={s.userboard} color="bg-color">
            <div className={s.welcomeText}>
                <h3 className={s.h3}>

                    {/* {userData?.nickname ? capitalizeFirstLetters(userData.nickname) : "User"} <br></br> */}
                    {t.novice_hello} {t.novice_welcome}
                </h3>
                <div className={s.subtext}>{t.novice_start}</div>
            </div>

            {/* Events */}
            {/* TODO: if myEvents replace list of events with myEvents */}
            <section className={s.dbSection}>
                <div className={s.eventBtns}>
                    <h2 className={s.header}>{t.event_list}</h2>
                    <span className={s.navBtnSpan}>
                        {/* TODO: add Btn "View my events" (those that I have created or have payed for) */}
                        <Button size="s" onClick={scrollToTop}>&#128064; {t.events_seminars}</Button>
                        <Button size="s" onClick={scrollToTop}> +{t.create_event}</Button>
                    </span>
                </div>
                <div className={s.eventGrid}>
                    {[...eventsList]
                        .sort(() => Math.random() - 0.5)
                        .slice(0, 3)
                        .map((event) => (
                            <EventItem key={event.id} event={event} t={t} />
                        ))}
                </div>
            </section>


            {/* Experts */}
            <section className={s.dbSection}>
                <div className={s.eventBtns}>
                    <h2 className={s.header}>{t.appointments}</h2>
                    <span className={s.navBtnSpan}>
                        <Button size="s" onClick={scrollToTop}>  {t.my_appointments} </Button>
                        <Button size="s" onClick={scrollToTop}> {t.novice_book_session}</Button>
                        <Button size="s" onClick={scrollToTop}>&#128064; {t.search_for_expert}</Button>
                    </span>

                </div>
                <div className={s.specialistList}>
                    {
                        specialistList.map(({ uid, ...specialist }) => {
                            console.log('specialist', specialist)
                            return (
                                <SpecialistCard key={uid} uid={uid as string} {...specialist} />
                            )
                        })
                    }
                </div>
            </section>


            {/* Articles */}
            <section className={s.dbSection}>
                <div className={s.eventBtns}>
                    <h2 className={s.header}>{t.view_posts}</h2>
                    <span className={s.navBtnSpan}>
                        <Button size="s" onClick={scrollToTop}>&#128064; {t.novice_news_feed} </Button>
                        <Button size="s" onClick={scrollToTop}>+ {t.create_article}</Button>
                    </span>
                </div>
                <div className={s.postsContainer}>
                    {
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
                    }
                </div>
            </section>

            {/* Earn */}
            <section className={s.dbSection}>


                <div className="">
                    <h2 className={s.header}>{t.become_psyworker}</h2>
                    <p className={s.subtext}>{t.become_psyworker_text_1}</p>
                    <p className={s.subtext}>{t.become_psyworker_text_2}</p>

                    <Button size="s" onClick={handleWorkAsTherapist}>{t.work_at_mindhealer}</Button>
                </div>

            </section>

            <section className={s.dbSection}>
                <div className="">
                    <h2 className={s.header}>{t.become_partner_h}</h2>
                    <p className={s.subtext}>{t.subheader}</p>
                    <p className={s.subtext}> {t.how_it_work} - {t.how_it_work_one}</p>
                    <Button size="s" onClick={handleBecomePartner}>  {t.become_partner} </Button>
                </div>
            </section>




            <h4 className={s.h3}>{t.novice_learn} </h4>
            <div className={s.grid}>
                <div className={s.card} onClick={handleCreateWallet}>
                    <WalletIcon
                        size={isMobile ? '30' : '40'}
                        classIcon={s.icons}
                    />
                    {t.how_create_wallet}
                </div>
            </div>
        </Substrate>
    )
}

export default Dashboard
