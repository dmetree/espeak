import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadMessages } from "@/components/shared/i18n/translationLoader";
import Page from "@/components/shared/ui/Page/Page";
import Substrate from "@/components/shared/ui/Substrate/Substrate";
import { fetchEvents, getMyEvents } from "@/store/actions/events_actions";

import EventItem from "./ui/EventItem"; // ✅ new import
import { AppDispatch } from "@/store";
import s from "./.module.scss";
import Button from "@/components/shared/ui/Button";
import { EUserRole } from "@/components/shared/types";
import router from "next/router";

const EventList = () => {
    const dispatch: AppDispatch = useDispatch<AppDispatch>();
    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const t = loadMessages(currentLocale);
    const userUid = useSelector(({ user }) => user.uid);
    const userData = useSelector(({ user }) => user?.userData);

    const eventsList = useSelector(({ events }) => events.eventsList);
    const myEventsList = useSelector(({ events }) => events.myEvents);

    const filteredEventsList = eventsList.filter(
        (event) => !myEventsList.some((myEvent) => myEvent.id === event.id)
    );

    const handleCreateEvent = () => {
        router.push("/create_event");
    }

    useEffect(() => {
        if (userUid) {
            dispatch(getMyEvents(userUid) as any);
        }
    }, [dispatch, userUid]);

    useEffect(() => {
        if (eventsList.length === 0) {
            dispatch(fetchEvents() as any);
        }
    }, [dispatch]);



    return (
        <Page>
            <Substrate color="bg-color">
                <div className={s.wrapper}>

                    <div className={s.eventBtns}>
                        {myEventsList.length === 0 ?
                            <h2 className={s.header}>{t.you_have_no_events}</h2> :
                            <h2 className={s.header}>{t.my_event_list}</h2>}
                        <span className={s.navBtnSpan}>
                            {userData?.userRole === EUserRole.Specialist &&
                                <Button size="s" onClick={handleCreateEvent}> +{t.create_event}</Button>
                            }
                        </span>
                    </div>


                    <div className={s.eventGrid}>
                        {myEventsList.map((event) => (
                            <EventItem key={event.id} event={event} t={t} />
                        ))}
                    </div>

                    <h2 className={s.header}>{t.event_list}</h2>

                    <div className={s.eventGrid}>
                        {filteredEventsList.map((event) => (
                            <EventItem key={event.id} event={event} t={t} />
                        ))}
                    </div>
                </div>
            </Substrate>
        </Page>
    );
};

export default EventList;
