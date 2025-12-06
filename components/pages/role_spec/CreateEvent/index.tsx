import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import Page from "@/components/shared/ui/Page/Page";
import Substrate from "@/components/shared/ui/Substrate/Substrate";
import Button from '@/components/shared/ui/Button';
import LanguageSelector from '@/components/shared/ui/LanguageSelector';
import { getAllLangOptions } from '@/components/shared/i18n/translationLoader';

import { EventForm, EventStatus, EventType, Option } from "@/components/shared/types/types";
import { Input } from "@/components/shared/ui/Input/Input"; // ✅ match DiplomaStep
import s from "./.module.scss";

import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

import { collection, addDoc } from "firebase/firestore";
import { database } from "@/components/shared/utils/firebase/init";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const CreateEvent = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const t = loadMessages(currentLocale);
    const userUid = useSelector(({ user }) => user.uid);
    const userData = useSelector(({ user }) => user?.userData);

    const selectedEventDetails = useSelector(({ events }) => events.selectedEvent);

    console.log("Event selected: ", selectedEventDetails)

    const [formData, setFormData] = useState<EventForm>({
        language: null,
        title: "",
        description: "",
        videoLink: "",
        price: "",
        dates: [""],
        students: [],
        image: null,
        author: {
            uid: userUid,
            avatar: userData?.avatar ? userData?.avatar : "",
            nickname: userData?.nickname ? userData?.nickname : "",
            rank: userData?.psyRank ? userData?.psyRank : "",
        },
        eventType: EventType.OneTime,
        status: EventStatus.InProcess,
        hours: 0,
    });

    const [errorFile, setFileError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const langOptions = getAllLangOptions(t);

    const handleChange =
        (field: keyof EventForm, index?: number) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                if (field === "dates" && typeof index === "number") {
                    const updatedDates = [...formData.dates];
                    updatedDates[index] = e.target.value;
                    setFormData({ ...formData, dates: updatedDates });
                } else {
                    setFormData({ ...formData, [field]: e.target.value });
                }
            };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setFileError("File size should be less than 2 MB.");
                return;
            }
            setFileError(null);
            const objectUrl = URL.createObjectURL(file);
            setFormData({ ...formData, image: objectUrl });
        }
    };

    const handleImageClick = () => fileInputRef.current?.click();

    const addDate = () =>
        setFormData({ ...formData, dates: [...formData.dates, ""] });
    const removeDate = (index: number) =>
        setFormData({
            ...formData,
            dates: formData.dates.filter((_, i) => i !== index),
        });

    const uploadEventImage = async (file: File, eventId: string) => {
        const storage = getStorage();
        const imageRef = ref(storage, `events/${eventId}/image`);
        await uploadBytes(imageRef, file);
        return getDownloadURL(imageRef);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let uploadedImageUrl = formData.image;
            if (fileInputRef.current?.files?.[0]) {
                uploadedImageUrl = await uploadEventImage(
                    fileInputRef.current.files[0],
                    userUid
                );
            }
            const eventData = {
                ...formData,
                image: uploadedImageUrl,
                createdAt: new Date(),
            };
            const docRef = await addDoc(collection(database, "events"), eventData);
            // console.log("Event created with ID:", docRef.id);
            toast.success("Event created!");
            resetForm();
            router.replace('/event_list');
            // TODO add a clean up function

        } catch (error) {
            console.error("Error creating event:", error);
        }
    };


    const resetForm = () => {
        setFormData({
            language: null,
            title: "",
            description: "",
            videoLink: "",
            price: "",
            dates: [""],
            students: [],
            image: null,
            author: {
                uid: userUid,
                avatar: userData?.avatar ? userData?.avatar : "",
                nickname: userData?.nickname ? userData?.nickname : "",
                rank: userData?.psyRank ? userData?.psyRank : "",
            },
            eventType: EventType.OneTime,
            status: EventStatus.InProcess,
            hours: 0,
        });
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // clear file input
        }
        setFileError(null);
    };

    return (
        <Page className={s.userboardPage}>
            <Substrate className={s.userboard} color="bg-color">
                <h2 className={s.formStepH}>{t.create_event}</h2>


                <form onSubmit={handleSubmit} className={s.form}>
                    {/* Language */}
                    <LanguageSelector
                        value={formData.language}
                        options={langOptions}
                        onChange={(val) =>
                            setFormData({ ...formData, language: val as Option | null })
                        }
                        t={t}
                        isMulti={false}
                        labelKey="lang_event"
                    />

                    {/* Event Type */}
                    <br />
                    <label className={s.label}>{t.event_type}</label>
                    <div className={s.eventTypeSelector}>
                        <div
                            className={`${s.eventTypeOption} ${formData.eventType === EventType.OneTime ? s.active : ""
                                }`}
                            onClick={() => setFormData({ ...formData, eventType: EventType.OneTime })}
                        >
                            {t.event_type_oneTime}
                        </div>
                        <div
                            className={`${s.eventTypeOption} ${formData.eventType === EventType.Monthly ? s.active : ""
                                }`}
                            onClick={() => setFormData({ ...formData, eventType: EventType.Monthly })}
                        >
                            {t.event_type_monthly}
                        </div>
                    </div>



                    {/* Title */}
                    <br />
                    <label className={s.label}>{t.event_title}</label>
                    <input
                        type="text"
                        className={s.input}
                        value={formData.title}
                        onChange={handleChange("title")}
                        placeholder={t.event_title}
                    />
                    {/* Image Upload */}
                    <br />
                    <label className={s.label}>{t.event_image}</label>
                    <div className={s.imageBox}>
                        <div
                            className={s.imageContainer}
                            style={{
                                backgroundImage: formData.image
                                    ? `url(${formData.image})`
                                    : "none",
                            }}
                            onClick={handleImageClick}
                        >
                            {!formData.image && t.add_image}
                        </div>
                        {errorFile && <p className={s.errorText}>{errorFile}</p>}
                        <input
                            type="file"
                            accept="image/png, image/jpeg, image/jpg"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            hidden
                        />
                    </div>

                    {/* Description */}
                    <br />
                    <label className={s.label}>{t.event_description}</label>
                    <ReactQuill
                        className={s.textarea}
                        value={formData.description || ""}
                        onChange={(value) =>
                            setFormData({ ...formData, description: value })
                        }
                        placeholder={t.event_description}
                        theme="snow"
                    />

                    {/* Video link */}
                    <br />
                    <div className="">
                        <label className={s.label}>{t.event_video_link}</label>
                        <input
                            type="url"
                            className={s.input}
                            value={formData.videoLink}
                            onChange={handleChange("videoLink")}
                            placeholder="https://www.youtube.com/..."
                        />
                    </div>

                    {/* Meeting dates */}
                    <br />
                    <label className={s.label}>{t.event_meeting_dates}</label>
                    {formData.dates.map((date, i) => (
                        <div key={i} className={s.dateRow}>
                            <input
                                type="datetime-local"
                                className={s.input}
                                step="3600"   // ⏰ jumps in 1-hour increments
                                value={date}
                                onChange={handleChange("dates", i)}
                            />
                            <Button type="button" onClick={() => removeDate(i)}>
                                X
                            </Button>
                        </div>
                    ))}


                    <Button
                        className={s.addEventMeetingBtn}
                        type="button"
                        onClick={addDate}
                    >
                        + {t.add_event_meeting}
                    </Button>

                    {/* Event duration */}

                    <label className={s.label}>{t.event_duration}</label>
                    <input
                        type="number"
                        className={s.input}
                        value={formData.hours}
                        onChange={handleChange("hours")}
                        placeholder="10"
                    />
                    <br />

                    {/* Price */}

                    <label className={s.label}>{t.event_price}</label>
                    <input
                        type="number"
                        className={s.input}
                        value={formData.price}
                        onChange={handleChange("price")}
                        placeholder="$100"
                    />
                    <br />
                    <Button className={s.createBtn} type="submit">
                        {t.create_event}
                    </Button>
                </form>
            </Substrate>
        </Page>
    );
};

export default CreateEvent;

