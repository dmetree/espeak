import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import { fetchMyAppointments } from '@/store/actions/appointments';
import { EUserRole, EModalKind } from "@/components/shared/types";
import { showModal } from '@/store/actions/modal';

import { WalletIcon } from './Icons/wallet';
import { PartnerIcon } from './Icons/partner';
import { WorkIcon } from './Icons/work';
import { NewsIcon } from './Icons/articles';
import { fetchPosts, setEditPost } from "@/store/actions/posts";
import { MyAppointmentIcon } from './Icons/myAppointment';
import { SearchExpertIcon } from './Icons/searchExpert';
import { MakeAppointmentIcon } from './Icons/makeAppointment';
import { MyOfficeIcon } from './Icons/myOffice';
import { WriteArticleIcon } from './Icons/writeArticle';
import { ClientsRequestsIcon } from './Icons/clientsRequest';
import { RewardsIcon } from './Icons/rewards';
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


const Dashboard = () => {

    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const myAppointments = useSelector(({ appointments }) => appointments.myAppointments);
    const t = loadMessages(currentLocale);
    const router = useRouter();
    const dispatch: AppDispatch = useDispatch<AppDispatch>();

    const userUid = useSelector(({ user }) => user.uid);
    const userRole = useSelector(({ user }) => user?.userData?.userRole);
    const userData = useSelector(({ user }) => user?.userData);


    const ergoWalletConnected = useSelector(({ networkErgo }) => networkErgo.ergoWalletConnected);
    const eventsList = useSelector(({ events }) => events.eventsList);

    const postsList = useSelector(({ posts }) => posts.postsList);

    const specialistList = useSelector(
        ({ specialists }: { specialists: { specialistList: ISpecProfile[] } }) =>
            specialists.specialistList
    );

    const isMobile = useIsLessThan(768);

    const capitalizeFirstLetters = (str: string) =>
        str.replace(/\b\w/g, (char) => char.toUpperCase());

    const handleMyAppointments = () => {
        router.push("/novice_appointments");
    }

    const handleBookSession = () => {
        if (!ergoWalletConnected) {
            dispatch(blockChainActions.toggleWalletSelector());
            toast.warn(t.connect_your_wallet)
        }
        if (ergoWalletConnected) {
            dispatch(showModal(EModalKind.BookSession));
        }
    };

    const handleGoToOffice = () => {
        router.push("/office");
    }

    const handleWriteArticle = () => {
        dispatch(setEditPost(false));
        dispatch(showModal(EModalKind.CreatePost));
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
        // dispatch(showModal(EModalKind.FindSpecialist));
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

    useEffect(() => {
        dispatch(fetchEvents() as any);
    }, [dispatch]);

    useEffect(() => {
        if (specialistList.length === 0) {
            dispatch(findRandomSpecialists(userUid));
        }
    }, [])

    useEffect(() => {
        dispatch(fetchPosts())
    }, [])

    return (
        <Page className={s.userboardPage}>
            <Substrate className={s.userboard} color="bg-color">
                <div className={s.welcomeText}>
                    <h3 className={s.h3}>
                        {t.novice_hello}
                        {userData?.nickname ? capitalizeFirstLetters(userData.nickname) : "User"} <br></br>
                        {t.novice_welcome}
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
                            <Button size="s" onClick={handleViewEventsList}>&#128064; {t.events_seminars}</Button>
                            {userData?.userRole === EUserRole.Specialist &&
                                <Button size="s" onClick={handleCreateEvent}> +{t.create_event}</Button>
                            }
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
                            {
                                userData?.userRole === EUserRole.Novice &&
                                <Button size="s" onClick={handleMyAppointments}>  {t.my_appointments} </Button>
                            }
                            {
                                userData?.userRole === EUserRole.Specialist &&
                                <Button size="s" onClick={handleGoToOffice}>  {t.office} </Button>
                            }
                            <Button size="s" onClick={handleBookSession}> {t.novice_book_session}</Button>
                            <Button size="s" onClick={handleExpertSearch}>&#128064; {t.search_for_expert}</Button>
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
                            <Button size="s" onClick={handleNewsFeed}>&#128064; {t.novice_news_feed} </Button>
                            {userData?.userRole === EUserRole.Specialist &&
                                <Button size="s" onClick={handleWriteArticle}>+ {t.create_article}</Button>}
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


                {/* {userData?.userRole === EUserRole.Specialist &&

                    <div className={s.grid}>
                        <div className={s.card} onClick={handleGoToOffice}>
                            <MyOfficeIcon
                                size={isMobile ? '30' : '40'}
                                classIcon={s.icons}
                            />
                            {t.goToOffice}
                        </div>

                        <div className={s.card} onClick={handleCreateEvent}>
                            <PartnerIcon
                                size={isMobile ? '36' : '50'}
                                classIcon={s.icons}
                            />
                            {t.create_event}
                        </div>

                        <div className={s.card} onClick={handleClientRequests}>
                            <ClientsRequestsIcon
                                size={isMobile ? '36' : '50'}
                                classIcon={s.icons}
                            />
                            {t.client_requests}
                        </div>

                        <div className={s.card} onClick={handleWriteArticle}>
                            <WriteArticleIcon
                                size={isMobile ? '30' : '40'}
                                classIcon={s.icons}
                            />
                            {t.create_article}
                        </div>

                        <div className={s.card} onClick={handleCollectRewards}>
                            <RewardsIcon
                                size={isMobile ? '36' : '50'}
                                classIcon={s.icons}
                            />
                            {t.collect_rewards}
                        </div>
                    </div>
                } */}


                {/* <div className={s.grid}>
                    <div className={s.card} onClick={handleViewEventsList}>
                        <MakeAppointmentIcon
                            size={isMobile ? '30' : '40'}
                            classIcon={s.icons}
                        />
                        {t.events_seminars}
                    </div>
                    <div className={s.card} onClick={handleBookSession}>
                        <MakeAppointmentIcon
                            size={isMobile ? '30' : '40'}
                            classIcon={s.icons}
                        />
                        {t.novice_book_session}
                    </div>
                    <div className={s.card} onClick={handleExpertSearch}>
                        <SearchExpertIcon
                            size={isMobile ? '30' : '40'}
                            classIcon={s.icons}
                        />
                        {t.search_for_expert}
                    </div>

                    {
                        userData?.userRole === EUserRole.Novice &&
                        <div className={s.card} onClick={handleMyAppointments}>
                            <MyAppointmentIcon
                                size={isMobile ? '30' : '40'}
                                classIcon={s.icons}
                            />

                            {t.my_appointments}
                        </div>
                    }


                    <div className={s.card} onClick={handleNewsFeed}>
                        <NewsIcon
                            size={isMobile ? '30' : '40'}
                            classIcon={s.icons}
                        />

                        {t.novice_news_feed}
                    </div>
                </div> */}

                {/* Earn */}
                <section className={s.dbSection}>
                    <div className={s.eventBtns}>
                        {/* <h2 className={s.header}>{t.novice_earn}</h2> */}

                        {/* {userData?.userRole === EUserRole.Novice &&
                            <Button size="s" onClick={handleWorkAsTherapist}>{t.work_at_mindhealer}</Button>}
                        <Button size="s" onClick={handleBecomePartner}>  {t.become_partner} </Button> */}
                    </div>

                    {/* <div className={s.grid}> */}

                    {userData?.userRole === EUserRole.Novice &&
                        <div className="">
                            <h2 className={s.header}>{t.become_psyworker}</h2>
                            <p className={s.subtext}>{t.become_psyworker_text_1}</p>
                            <p className={s.subtext}>{t.become_psyworker_text_2}</p>

                            <Button size="s" onClick={handleWorkAsTherapist}>{t.work_at_mindhealer}</Button>
                        </div>
                    }
                </section>

                <section className={s.dbSection}>
                    <div className="">
                        <h2 className={s.header}>{t.become_partner_h}</h2>
                        <p className={s.subtext}>{t.subheader}</p>
                        <p className={s.subtext}> {t.how_it_work} - {t.how_it_work_one}</p>
                        <Button size="s" onClick={handleBecomePartner}>  {t.become_partner} </Button>
                    </div>
                </section>

                {/* {
                        userData?.userRole === EUserRole.Novice &&
                        <div className={s.card} onClick={handleWorkAsTherapist}>
                            <WorkIcon
                                size={isMobile ? '30' : '40'}
                                classIcon={s.icons}
                            />
                            {t.work_at_mindhealer}
                        </div>
                    } */
                }
                {/* 
                        <div className={s.card} onClick={handleBecomePartner}>
                            <PartnerIcon
                                size={isMobile ? '36' : '50'}
                                classIcon={s.icons}
                            />
                            {t.become_partner}
                        </div> */}

                {/* </div> */}


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

                {/* <div className={s.card} onClick={handleGetSigUSD}>
                    <Image
                        width={isMobile ? '30' : '40'}
                        src={sigusdImage}
                        alt="sigusd image"
                        className={s.icons}
                        loading="lazy"
                    />
                    {t.how_get_sigUSD}
                </div>
                <div className={s.card} onClick={handleHowToBuyErgo}>
                    <Image
                        width={isMobile ? '30' : '40'}
                        src={sigusdImage}
                        alt="sigusd image"
                        className={s.icons}
                        loading="lazy"
                    />
                    {t.how_buy_ergo}
                </div>
                <div className={s.card} onClick={handleCreateKuCoinAccount}>
                    <Image
                        width={isMobile ? '30' : '40'}
                        src={sigusdImage}
                        alt="sigusd image"
                        className={s.icons}
                        loading="lazy"
                    />
                    {t.how_create_kucoin_account}
                </div>
                <div className={s.card} onClick={handleP2PKuCoin}>
                    <Image
                        width={isMobile ? '30' : '40'}
                        src={sigusdImage}
                        alt="sigusd image"
                        className={s.icons}
                        loading="lazy"
                    />
                    {t.how_make_p2p_kucoin}
                </div> */}



            </Substrate>
        </Page>
    )
}

export default Dashboard
