import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { loadMessages } from "@/components/shared/i18n/translationLoader";
import { EModalKind } from '@/components/shared/types';
import { showModal } from '@/store/actions/modal';
import Page from "@/components/shared/ui/Page/Page";
import Substrate from "@/components/shared/ui/Substrate/Substrate";
import { fetchEventById, addUserToEvent, removeUserFromEvent, deleteEvent, finishEvent } from "@/store/actions/events_actions";
import { AppDispatch } from "@/store";
import { useRouter } from "next/router";
import Button from "@/components/shared/ui/Button";
import { toast } from "react-toastify";

import s from "./.module.scss";


// import Belt1 from '@/components/shared/assets/img/belts/e001_belt.webp';
// import Belt2 from '@/components/shared/assets/img/belts/e002_belt.webp';
// import Belt3 from '@/components/shared/assets/img/belts/e003_belt.webp';
// import Belt4 from '@/components/shared/assets/img/belts/e004_belt.webp';
// import Belt5 from '@/components/shared/assets/img/belts/e005_belt.webp';
// import Belt6 from '@/components/shared/assets/img/belts/e006_belt.webp';
// import Belt7 from '@/components/shared/assets/img/belts/e007_belt.webp';
// import Belt8 from '@/components/shared/assets/img/belts/e008_belt.webp';
// import Belt9 from '@/components/shared/assets/img/belts/e009_belt.webp';
// import Belt10 from '@/components/shared/assets/img/belts/e010_belt.webp';


const EventDetails = () => {
    const router = useRouter();
    const { id } = router.query; // <-- get event ID from URL

    const dispatch: AppDispatch = useDispatch<AppDispatch>();
    const userUid = useSelector(({ user }) => user.uid);
    const userData = useSelector(({ user }) => user?.userData);
    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const t = loadMessages(currentLocale);

    const eventAuthor = useSelector(({ events }) => events.selectedEvent?.author?.uid);
    const eventDetails = useSelector(({ events }) => events.selectedEvent);

    const [students, setStudents] = useState(eventDetails?.students || []);

    const isEventStudent = !!eventDetails?.students?.some(
        (student) => student.uid === userUid
    );

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            day: "numeric", // 1, 2, 3...
            month: "short", // "Jan", "Feb", ...
        });
    };



    const handleAuthorClick = () => {
        if (userUid === eventDetails.userUid) {
            router.replace('/office/');
        } else {
            router.replace(`/specialist-profile/${eventDetails.author.nickname}`);
        }

    }


    const handleEnterEventClick = () => {
        dispatch(showModal(EModalKind.EventRoom));
    }

    const handleBuyEvent = () => {
        if (!userUid || !userData) return;

        const userDetails = {
            uid: userUid,
            nickname: userData?.nickname,
            avatar: userData?.avatar,
            partnerOne: userData?.partnerOne,
            partnerTwo: userData?.partnerTwo,
            email: userData?.email,
        };

        dispatch(addUserToEvent(eventDetails.id, userDetails))
            .then(() => {
                toast.success(t.request_confirmed_onchain);
                router.replace('/event_list/');
            })
            .catch((err) => {
                console.error("Buy event error:", err);
                toast.error(t.error_occurred);
            });
    };

    useEffect(() => {
        if (id) {
            dispatch(fetchEventById(id as string)); // <-- fetch event if missing
        }

        if (eventDetails?.students) {
            setStudents(eventDetails.students);
        }
    }, [id, dispatch, eventDetails, eventDetails?.students]);

    if (!eventDetails) {
        return <p>Loading...</p>;
    }

    const editEvent = () => {
        router.push("/edit_event");

        // console.log("edit event", eventDetails.id)
    }

    const handleDeleteEvent = () => {
        if (eventAuthor === userUid) {
            dispatch(deleteEvent(eventDetails.id));
            toast.success(t.done);
            router.push("/event_list");
        }
    }


    const handleRemoveStudent = (studentUid: string) => {
        if (!eventDetails?.id) return;

        // dispatch redux action to update Firestore + Redux
        dispatch(removeUserFromEvent(eventDetails.id, studentUid))
            .then(() => toast.success(t.student_removed))
            .catch(() => toast.error(t.error_occurred));

        // update local UI immediately
        setStudents((prev) => prev.filter((s) => s.uid !== studentUid));
    };


    const handleClaimEventReward = (eventId, students) => {
        // TODO: create a redux action to update event.status: finished
        dispatch(finishEvent(eventId))
        console.log("Event hours: ", eventDetails.hours)
        toast.success(t.event_finished);
        // dispatch(deleteEvent(eventId));
        console.log("Claim event reward: ", eventId, "students: ", students)
    }


    return (
        <Page>
            <Substrate color="bg-color">
                <div className={s.wrapper}>

                    {eventAuthor === userUid && eventDetails?.students?.length === 0 &&
                        <div className={s.eventNav}>
                            <Button size="s" onClick={editEvent}>{t.edit}</Button>
                            <Button size="s"  onClick={handleDeleteEvent}>{t.delete}</Button>
                        </div>
                    }

                    <div className={s.imageWrapper}>
                        {eventDetails.image && (
                            <Image
                                src={eventDetails.image}
                                alt={eventDetails.title}
                                fill
                                className={s.image}
                            />
                        )}
                        <div className={s.overlay}>

                            <h2 className={s.header}>{eventDetails.title}</h2>
                            <div className={s.topRow}>
                                {eventDetails.dates && (
                                    <span className={s.startEndTime}>
                                        {formatDate(eventDetails.dates[0])}
                                    </span>
                                )}
                                {eventDetails.author && (
                                    <div className={s.author} onClick={handleAuthorClick}>
                                        {eventDetails.author.avatar && (
                                            <Image
                                                src={eventDetails.author.avatar}
                                                alt={eventDetails.author.nickname}
                                                width={28}
                                                height={28}
                                                className={s.avatar}
                                            />
                                        )}
                                        <span className={s.nickname}>{eventDetails.author.nickname}</span>
                                        {/* {eventDetails.author.rank && (
                                            <Image
                                                className={s.belt}
                                                src={psyBelt}
                                                alt="Psy belt"
                                                width={18}
                                                height={18}
                                                loading="lazy"
                                            />
                                        )} */}
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>

                    <div
                        className={s.description}
                        dangerouslySetInnerHTML={{ __html: eventDetails.description }}
                    />
                </div>


                {eventAuthor === userUid &&
                    (
                        <div className={s.studentsWrapper}>
                            <br />
                            <hr />
                            <h3 className={s.subHeader}>
                                {t.students_list}: {students.length}
                            </h3>
                            <ol className={s.studentsList}>
                                {students.map((student, index) => (
                                    <li key={student.uid} className={s.studentItem}>
                                        <span className={s.studentItemBody}>
                                            <span>{index + 1}.</span>
                                            <div className={s.studentInfo}>
                                                {student.avatar && (
                                                    <Image
                                                        src={student.avatar}
                                                        alt={student.nickname}
                                                        width={32}
                                                        height={32}
                                                        className={s.avatar}
                                                    />
                                                )}
                                                <span className={s.nickname}>{student.nickname}</span>
                                            </div>
                                        </span>
                                        <span className={s.studentItemBody}>


                                            <Button

                                                className={s.dayRowBtn}
                                                onClick={() => handleRemoveStudent(student.uid)}
                                            >
                                                X
                                            </Button>
                                        </span>

                                    </li>
                                ))}
                            </ol>
                            <br />
                            <hr />
                            {eventDetails.status === "inprocess" ?
                                <Button
                                    size="s"
                                    // className={s.dayRowBtn}
                                    onClick={() => handleClaimEventReward(eventDetails.id, students)}
                                >
                                    &#128176; {t.collect_payments}
                                </Button>
                                : <span className={s.eventFinished}>{t.event_finished}</span>
                            }
                        </div>
                    )}


                <div className={s.priceAndType}>
                    {/* Price */}
                    <p className={s.price}>
                        {eventDetails.price ? `$${eventDetails.price}` : t.free}
                    </p>

                    {/* Event Type */}
                    <p className={s.type}>
                        {eventDetails.eventType === "monthly" ? t.event_type_monthly : t.event_type_oneTime}
                    </p>

                    <p className={s.type}>
                        {t.event_duration}: {eventDetails.hours}

                    </p>

                </div>

                {(userUid === eventAuthor || isEventStudent) && (
                    <Button size="s" onClick={handleEnterEventClick}>
                        {t.event_enter_room}
                    </Button>
                )}

                {userUid !== eventAuthor && !isEventStudent && (
                    <Button size="s" onClick={handleBuyEvent}>
                        {t.event_buy_ticket}
                    </Button>
                )}
            </Substrate>
        </Page>
    );
};

export default EventDetails;


