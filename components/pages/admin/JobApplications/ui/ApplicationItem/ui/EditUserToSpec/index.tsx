import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from "next/router";
import Select from 'react-select';
import { IJobRequestStatus, IUserTypes } from '@/components/shared/types/types';
import Image from 'next/image';

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { storage } from '@/components/shared/utils/firebase/init';
import GenderSelector from '@/components/shared/ui/GenderSelector/GenderSelector';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from "@/store";
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import { actionUpdateProfile, getUserById } from '@/store/actions/profile/user';
import { actionUpdateApplication } from '@/store/actions/jobApplications';

import Button from "@/components/shared/ui/Button";
import { Input } from "@/components/shared/ui/Input/Input";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import TimeZonePicker from '@/components/shared/ui/TimeZonePicker/TimeZonePicker'

import s from './.module.scss';

import {
    getAllLangOptions,
    getOptionsFromCodes,
    getAllSpecialityOptions,
    getOptionsFromSpeciality,
    getAllMethodsOptions,
    getOptionsFromMethods,
    getAllServicesOptions,
    getOptionsFromServices
} from '@/components/shared/i18n/translationLoader';

interface EditUserToSpecProps {
    selectedJobApplicationUserId: any;
}

const EditUserToSpec: React.FC<EditUserToSpecProps> = ({ selectedJobApplicationUserId }) => {

    const [applicationStatus, setApplicationStatus] = useState(IJobRequestStatus.Pending)

    const userUid = useSelector(({ user }) => user.uid);
    const userEmail = useSelector(({ user }) => user?.email);
    const selectedJobApplication = useSelector(({ jobApplications }) => jobApplications.selectedJobApplication);
    const applicantUserData = useSelector(({ user }) => user?.applicantUserData);

    const router = useRouter();
    const dispatch: AppDispatch = useDispatch<AppDispatch>();

    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const t = loadMessages(currentLocale);

    const [formData, setFormData] = useState({
        nickname: '',
        avatar: '',
        gender: '',
        timeZone: '',
        birthYear: '',
        languages: '',
        psySpecialities: [],
        psyMethods: [],
        services: [],
        psyRank: 0,
        hrInPsy: 0,
        hrPsy: 0,
        hrEducation: 0,
        inProfessionSince: 2025,
        infoAbout: '',

        psyServices: '',

        jobRequest: '',
        userRole: '',
    });

    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (applicantUserData) {
            setFormData({
                nickname: applicantUserData.nickname || '',
                avatar: applicantUserData.avatar || null,
                gender: applicantUserData.gender || '',
                timeZone: applicantUserData.timeZone || '',
                birthYear: applicantUserData.birthYear || '',
                languages: applicantUserData.languages || [],
                psySpecialities: applicantUserData.psySpecialities || [],
                psyMethods: applicantUserData.psyMethods || [],
                services: applicantUserData.services || [],
                psyRank: applicantUserData.psyRank || 0,
                hrInPsy: applicantUserData.hrInPsy || 0,
                hrPsy: applicantUserData.hrPsy || 0,
                hrEducation: applicantUserData.hrEducation || 0,
                inProfessionSince: applicantUserData.inProfessionSince || 2025,
                infoAbout: applicantUserData.infoAbout || '',

                psyServices: '',

                jobRequest: applicantUserData.jobRequest || '',
                userRole: applicantUserData.userRole || '',
            });
        }
    }, [applicantUserData]);

    /* @ts-ignore */
    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name === 'psyRank') {
            if (/^(10|[0-9])$/.test(value) || value === '') {
                setFormData((prevData) => ({
                    ...prevData,
                    [name]: value === '' ? '' : Number(value),
                }));
            }
        } else if (name === 'hrInPsy') {
            // Ensure only numbers between 0 and 10000
            if (/^\d{1,5}$/.test(value) && Number(value) <= 10000) {
                setFormData((prevData) => ({
                    ...prevData,
                    [name]: value === '' ? '' : Number(value),
                }));
            }
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleTimeZoneChange = (timeZone: any) => {
        setFormData((prevData) => ({
            ...prevData,
            timeZone: timeZone,
        }));
    };

    /* @ts-ignore */
    const handleLanguagesChange = (selectOption: any) => {
        /* @ts-ignore */
        const langCodeList = selectOption.map(({ value, label }) => value);
        setFormData((prevData) => ({
            ...prevData,
            languages: langCodeList,
        }));
    };

    /* @ts-ignore */
    const handleSpecialityChange = (selectOption) => {
        /* @ts-ignore */
        const specialityCodeList = selectOption.map(({ value, label }) => value);
        setFormData((prevData) => ({
            ...prevData,
            psySpecialities: specialityCodeList,
        }));
    };

    /* @ts-ignore */
    const handleMethodsChange = (selectOption) => {
        /* @ts-ignore */
        const methodsCodeList = selectOption.map(({ value, label }) => value);
        setFormData((prevData) => ({
            ...prevData,
            psyMethods: methodsCodeList,
        }));
    };

    /* @ts-ignore */
    // const handleServiceChange = (index, field, value) => {
    //     setFormData((prevData) => {
    //         const updatedServices = [...prevData.services];
    //         const updatedValue = field === 'price' ? Math.max(5, Math.min(9000, value)) : value; // Ensure price is between 5 and 1000
    //         /* @ts-ignore */
    //         updatedServices[index] = {
    //             /* @ts-ignore */
    //             ...updatedServices[index],
    //             [field]: updatedValue,
    //         };
    //         return {
    //             ...prevData,
    //             services: updatedServices,
    //         };
    //     });
    // };

    // const handleAddService = () => {
    //     /* @ts-ignore */
    //     setFormData((prevData) => ({
    //         ...prevData,
    //         services: [...prevData.services, { title: '', length: 55, price: '' }],
    //     }));
    // };

    // const handleDeleteService = (index: number) => {
    //     const updatedServices = formData.services.filter((_, i) => i !== index);
    //     setFormData((prevData) => ({
    //         ...prevData,
    //         services: updatedServices,
    //     }));
    // };


    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Dispatch Redux action to create a new user
            await dispatch(actionUpdateProfile(formData, selectedJobApplicationUserId));

            await dispatch(actionUpdateApplication(applicationStatus, selectedJobApplication.id));

            toast.success("New user profile was created.");
            router.replace('/admin/job_applications/');
        } catch (error) {
            console.error("Error creating user profile:", error);
            toast.error("Failed to create a user. Please try again.");
        } finally {
            setLoading(false);
        }
    };



    const jobApplicationDecline = () => {
        setApplicationStatus(IJobRequestStatus.Declined);

        setFormData((prevData) => ({
            ...prevData,
            jobRequest: IJobRequestStatus.None,
            userRole: IUserTypes.User,
        }));
    };

    const jobApplicationApprove = () => {
        setApplicationStatus(IJobRequestStatus.Accepted)

        setFormData((prevData) => ({
            ...prevData,
            jobRequest: IJobRequestStatus.Accepted,
            userRole: IUserTypes.Spec,
        }));
    };

    // const langOptions = useMemo(() => {
    //     /* @ts-ignore */
    //     return getAllLangOptions(t);
    // }, [t]);

    // const savedLanguages = useMemo(() => {
    //     /* @ts-ignore */
    //     return getOptionsFromCodes(formData?.languages, t);
    // }, [t, formData.languages]);

    const specialityOptions = useMemo(() => {
        /* @ts-ignore */
        return getAllSpecialityOptions(t);
    }, [t]);

    const savedSpeciality = useMemo(() => {
        /* @ts-ignore */
        return getOptionsFromSpeciality(formData?.psySpecialities, t);
    }, [t, formData.psySpecialities]);

    const methodsOptions = useMemo(() => {
        /* @ts-ignore */
        return getAllMethodsOptions(t);
    }, [t]);

    const savedMethods = useMemo(() => {
        /* @ts-ignore */
        return getOptionsFromMethods(formData?.psyMethods, t);
    }, [t, formData.psyMethods]);

    // const servicesOptions = useMemo(() => {
    //     /* @ts-ignore */
    //     return getAllServicesOptions(t);
    // }, [t]);

    // const savedServices = useMemo(() => {
    //     /* @ts-ignore */
    //     return getOptionsFromServices(formData?.psyServices, t);
    // }, [t, formData.psyServices]);


    useEffect(() => {
        dispatch(getUserById(selectedJobApplicationUserId))
    }, [dispatch, selectedJobApplicationUserId]);

    useEffect(() => {
        if (applicantUserData) {
            setFormData((prevData) => ({
                ...prevData,
                nickname: applicantUserData.nickname || '',
                avatar: applicantUserData.avatar || null,
                gender: applicantUserData.gender || '',
                timeZone: applicantUserData.timeZone || '',
                birthYear: applicantUserData.birthYear || '',
                languages: applicantUserData.languages || [],
                psySpecialities: applicantUserData.psySpecialities || [],
                psyMethods: applicantUserData.psyMethods || [],
                services: applicantUserData.services || [],
                psyRank: applicantUserData.psyRank || 0,
                hrInPsy: applicantUserData.hrInPsy || 0, // Add this line
            }));
        }
    }, [applicantUserData]);



    return (
        <div className="">
            {/* <div className={s.leftColumn}> */}
            <div className="">User name: {formData.nickname}</div>
            <div className={s.formLabel}>
                User email:  {applicantUserData?.email}
            </div>
            {/* Image Upload for Avatar */}
            <div className={s.avatarContainer}>
                {formData?.avatar ? (
                    <Image loading="lazy" width='100' height='160' src={typeof formData.avatar === 'string' ? formData.avatar : URL.createObjectURL(formData.avatar)} alt="Avatar Preview" className={s.avatarPreview} />
                ) : <div className={s.avatarPreview} />}
            </div>

            <form onSubmit={handleSubmit} className={s.formContainer}>
                <>
                    <div className={s.formLabel}>
                        <span>Rank: </span>
                        <Input
                            className={s.serviceParamInput}
                            type="number"
                            name="psyRank"
                            /* @ts-ignore */
                            value={formData.psyRank}
                            onChange={(e) => handleInputChange(e)}
                            placeholder="PsyRank"
                            min="0"
                            max="10"
                            maxLength={2}
                        />
                    </div>

                    <div className={s.formLabel}>
                        <span>Personal Therapy: </span>
                        <Input
                            className={s.serviceParamInput}
                            type="number"
                            name="hrInPsy"
                            /* @ts-ignore */
                            value={formData.hrInPsy}
                            onChange={(e) => handleInputChange(e)}
                            placeholder="HrInPsy"
                            min="0"
                            max="10000"
                        />
                    </div>

                    <div className={s.formLabel}>
                        <span>Client Sessions: </span>
                        <Input
                            className={s.serviceParamInput}
                            type="number"
                            name="hrPsy"
                            /* @ts-ignore */
                            value={formData.hrPsy}
                            onChange={(e) => handleInputChange(e)}
                            placeholder="HrPsy"
                            min="0"
                            max="10000"
                        />
                    </div>

                    <div className={s.formLabel}>
                        <span>Hr Education: </span>
                        <Input
                            className={s.serviceParamInput}
                            type="number"
                            name="hrEducation"
                            /* @ts-ignore */
                            value={formData.hrEducation}
                            onChange={(e) => handleInputChange(e)}
                            placeholder="HrEducation"
                            min="0"
                            max="90000"
                        />
                    </div>

                    <div className={s.formLabel}>
                        <span>In Psy since Year</span>
                        <Input
                            className={s.serviceParamInput}
                            type="number"
                            name="inProfessionSince"
                            /* @ts-ignore */
                            value={formData.inProfessionSince}
                            onChange={(e) => handleInputChange(e)}
                            placeholder="In Profession Since"
                            min="1900"
                            max="2025"
                        />
                    </div>


                    {/* TODO add input to add teachers by nickname */}
                    <div className="">Teachers / Supervisors:</div>

                    {/* TODO add input to add notable students by nickname */}
                    <div className="">Students:</div>

                    <div className={s.formLabel}>
                        <span>Languages:</span>
                        {/* <Select
                            isMulti
                            name="langs"
                            options={langOptions}
                            value={savedLanguages}
                            onChange={handleLanguagesChange}
                        /> */}
                    </div>

                    <div className="">
                        <div>About:</div>
                        <div className="">{formData.infoAbout}</div>
                    </div>

                    <div className={s.actionBtns}>
                        <Button

                            className={s.articleBtn}
                            onClick={jobApplicationDecline}>Decline
                        </Button>
                        <Button
                            className={s.articleBtn}
                            onClick={jobApplicationApprove}>Approve
                        </Button>
                    </div>
                </>
                <Button type="submit">{t.save}</Button>
            </form>


        </div>
    );
};

export default EditUserToSpec;
