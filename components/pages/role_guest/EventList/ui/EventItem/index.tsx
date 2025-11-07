import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Button from "@/components/shared/ui/Button";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";

import { setSelectedEvent } from "@/store/actions/events_actions";
import FallbackImage from "@/components/shared/assets/img/fallback.png";

import s from "./.module.scss";


import Belt1 from '@/components/shared/assets/img/belts/e001_belt.webp';
import Belt2 from '@/components/shared/assets/img/belts/e002_belt.webp';
import Belt3 from '@/components/shared/assets/img/belts/e003_belt.webp';
import Belt4 from '@/components/shared/assets/img/belts/e004_belt.webp';
import Belt5 from '@/components/shared/assets/img/belts/e005_belt.webp';
import Belt6 from '@/components/shared/assets/img/belts/e006_belt.webp';
import Belt7 from '@/components/shared/assets/img/belts/e007_belt.webp';
import Belt8 from '@/components/shared/assets/img/belts/e008_belt.webp';
import Belt9 from '@/components/shared/assets/img/belts/e009_belt.webp';
import Belt10 from '@/components/shared/assets/img/belts/e010_belt.webp';

const EventItem = ({ event, t }) => {
    const [imgError, setImgError] = useState(false);

    const router = useRouter();
    const dispatch: AppDispatch = useDispatch<AppDispatch>();
    const userUid = useSelector(({ user }) => user.uid);

    const belts = useMemo(() => [
        Belt1, Belt2, Belt3, Belt4, Belt5,
        Belt6, Belt7, Belt8, Belt9, Belt10
    ], []);

    const psyBelt = belts[event.author.rank - 1];

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            day: "numeric", // 1, 2, 3...
            month: "short", // "Jan", "Feb", ...
        });
    };

    const handleAuthorClick = () => {
        if (userUid === event.userUid) {
            router.replace('/office/');
        } else {
            router.replace(`/specialist-profile/${event.author.nickname}`);
        }
    }

    const handleViewEventClick = () => {
        dispatch(setSelectedEvent(event));
        router.replace(`/event_details/${event.id}`);
    };

    useEffect(() => {
        setImgError(false);
        return () => setImgError(false);
    }, [event.image]);

    return (
        // todo: if event.author.uid === userUid set border color to orange
        <div
            className={`${s.eventCard} ${event.author?.uid === userUid ? s.ownEvent : ""
                }`}
        >
            {/* Image */}
            <div className={s.imageWrapper}>
                {event.image && (
                    <Image
                        // src={event.image}
                        src={imgError ? FallbackImage : event.image}
                        alt={event.title}
                        fill
                        className={s.image}
                        onError={() => setImgError(true)}
                    />
                )}
            </div>

            <div className={s.startAndAuthor}>
                <div className={s.startEndTime}>
                    {event.dates && (
                        <span>
                            {formatDate(event.dates[0])}
                        </span>
                    )}

                    {/* {event.dates && (
                    <p className={s.time}>
                        {formatDate(event.dates[event.dates.length - 1])}
                    </p>
                )} */}
                </div>

                <div className="">
                    {/* Author */}
                    {event.author && (
                        <div className={s.author} onClick={handleAuthorClick}>
                            {event.author.avatar && (
                                <Image
                                    src={event.author.avatar}
                                    alt={event.author.nickname}
                                    width={30}
                                    height={30}
                                    className={s.avatar}
                                />
                            )}
                            <span className={s.nickname}>{event.author.nickname}</span>
                            {event.author.rank && (
                                <Image className={s.belt} src={psyBelt} alt="Psy belt" width={20} height={20} loading="lazy" />
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Title */}
            <h3 className={s.title}> {/* Start & End Time */}


                {event.title}</h3>

            {/* Description */}
            <p className={s.description}>
                {event.description?.replace(/<[^>]+>/g, "").slice(0, 100)}...
            </p>

            <div>
                <div className={s.priceAndType}>
                    {/* Price */}
                    <p className={s.price}>
                        {event.price ? `$${event.price}` : t.free}
                    </p>

                    {/* Event Type */}
                    <p className={s.type}>
                        {event.eventType === "monthly" ? t.event_type_monthly : t.event_type_oneTime}
                    </p>
                </div>


                {/* View More */}
                <Button size="s" onClick={handleViewEventClick}>{t.view_more}</Button>
            </div>
        </div>
    );
};

export default EventItem;
