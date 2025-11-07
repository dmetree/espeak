import React, { useState, useEffect, useRef } from 'react';

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

import { database } from "@/components/shared/utils/firebase/init";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '@/components/shared/utils/firebase/init';


import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from "@/store";
import { fetchUserData } from '@/store/actions/profile/user';
import { loadMessages } from '@/components/shared/i18n/translationLoader';

import { hideModal } from '@/store/actions/modal';
import { EModalKind, NoAuthError, IApplication, IJobRequestStatus, ISpecProfile } from '@/components/shared/types';



import { Modal } from '@/components/shared/ui/Modal';
import Button from "@/components/shared/ui/Button";
import DiplomaStep from './ui/01_diploma';
import CertificatesStep from './ui/02_certificates';
import SupervisorsStep from './ui/03_supervisors';
import ExtraInfoStep from './ui/04_extra_info';
import s from './.module.css';

import { useRouter } from 'next/router';


import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SpecApplication = () => {

  const router = useRouter();
  const dispatch: AppDispatch = useDispatch<AppDispatch>();

  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);

  const userUid = useSelector(({ user }) => user.uid);
  const userData = useSelector(({ user }) => user?.userData);


  const [formData, setFormData] = useState<IApplication>({
    creatorId: userUid || '',
    uid: '',
    diploma: null,
    diplomaHours: 0,
    diplomaYear: null,
    certificates: [{ url: '', certificateHours: null }],
    therapists: [
      {
        name: '',
        profileLink: '',
        from: '',
        to: '',
        sessions: 0,
      },
    ],
    extra_info: '',
    status: IJobRequestStatus.Pending,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      uid: userUid || '',
    }));
  }, [userUid]);

  const uploadDiploma = async (file: File, userId: string) => {
    const storage = getStorage(); // Initialize storage
    const diplomaRef = ref(storage, `diplomas/${userId}`);

    // Upload the file
    await uploadBytes(diplomaRef, file);

    // Get the download URL
    const downloadURL = await getDownloadURL(diplomaRef);
    return downloadURL;
  };

  const uploadCertificates = async (files: File[], userId: string) => {
    const storage = getStorage(); // Initialize storage

    const uploadPromises = files.map((file: File, index: number) => {
      const certificateRef = ref(storage, `certificates/${userId}/${index}`);

      // Upload the file and return its download URL
      return uploadBytes(certificateRef, file)
        .then(() => getDownloadURL(certificateRef));
    });

    // Wait for all uploads to complete
    const downloadURLs = await Promise.all(uploadPromises);
    return downloadURLs;
  };

  const handleChange =
    (input: string, index?: number) =>
      async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (input === 'image' && e.target instanceof HTMLInputElement) {
          const file = e.target.files ? e.target.files[0] : null;
          if (file) {
            try {
              setLoading(true);
              const downloadURL = await uploadDiploma(file, formData.uid);
              setFormData({
                ...formData,
                diploma: downloadURL,
              });
            } catch (error) {
              console.error('Error uploading diploma: ', error);
            } finally {
              setLoading(false);
            }
          }
        } else if (input === 'certificates' && e.target instanceof HTMLInputElement) {
          const files = e.target.files ? Array.from(e.target.files) : [];
          if (files.length > 0) {
            try {
              setLoading(true);
              const downloadURLs = await uploadCertificates(files, formData.uid);
              setFormData({
                ...formData,
                certificates: downloadURLs.map((url) => ({
                  url,
                  certificateHours: null, // Initialize certificateHours as null
                })),
              });
            } catch (error) {
              console.error('Error uploading certificates: ', error);
            } finally {
              setLoading(false);
            }
          }
        } else if (input === 'certificateHours' && typeof index === 'number') {
          // Update certificateHours for a specific certificate
          const updatedCertificates = [...formData.certificates];
          updatedCertificates[index].certificateHours = Number(e.target.value);
          setFormData({ ...formData, certificates: updatedCertificates });
        } else {
          setFormData({ ...formData, [input]: e.target.value });
        }
      };


  const handleCertificateChange = (
    index: number,
    field: keyof typeof formData.certificates[0],
    value: string | number
  ) => {
    const updatedCertificates = [...formData.certificates];
    updatedCertificates[index][field] = value;
    setFormData({ ...formData, certificates: updatedCertificates });
  };

  const addCertificate = () => {
    setFormData({
      ...formData,
      certificates: [...formData.certificates, { url: '', certificateHours: null }],
    });
  };

  const removeCertificate = (index: number) => {
    const updatedCertificates = formData.certificates.filter(
      (_: any, i: number) => i !== index
    );
    setFormData({ ...formData, certificates: updatedCertificates });
  };

  const handleFileUpload = (index: number, file: File | null) => {
    if (file) {
      const updatedCertificates = [...formData.certificates];
      updatedCertificates[index].url = URL.createObjectURL(file);
      setFormData({ ...formData, certificates: updatedCertificates });
    }
  };

  const handleTherapistChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updatedTherapists = formData.therapists.map((therapist: ISpecProfile, i: number) =>
      i === index ? { ...therapist, [field]: value } : therapist
    );
    setFormData({ ...formData, therapists: updatedTherapists });
  };

  const addTherapist = () => {
    setFormData({
      ...formData,
      therapists: [
        ...formData.therapists,
        {
          name: '',
          profileLink: '',
          from: '',
          to: '',
          sessions: 0,
        },
      ],
    });
  };

  const removeTherapist = (index: number) => {
    setFormData({
      ...formData,
      therapists: formData.therapists.filter((_: any, i: number) => i !== index),
    });
  };

  const validateStep = () => {
    if (currentStep === 1) {
      return formData.diploma && formData.diplomaHours > 0 && formData.diplomaYear;
    }
    if (currentStep === 2) {
      return (
        formData.certificates.length > 0 &&
        formData.certificates.every(cert => cert.url && cert.certificateHours !== null && cert.certificateHours > 0)
      );
    }
    if (currentStep === 3) {
      return formData.therapists.some(therapist => therapist.name && therapist.sessions > 0);
    }
    return true;
  };


  const nextStep = () => {
    if (!validateStep()) {
      toast.error("Please fill in all required fields before proceeding.");
      return;
    }
    setCurrentStep(prevStep => prevStep + 1);
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const cancelForm = () => {
    dispatch(hideModal(EModalKind.PsyworkerApplication));
  };

  const submitPsyworkerApplication = async () => {
    dispatch(hideModal(EModalKind.PsyworkerApplication));
    setCurrentStep(1);


    try {
      // Submit application
      const applCol = collection(database, "applications");
      await addDoc(applCol, formData as unknown as IApplication);

      // Update profile job request status
      const profileRef = doc(database, "users", userUid || "");
      const updatedData = { jobRequest: IJobRequestStatus.Pending };

      await updateDoc(profileRef, updatedData);

      toast.success("Application submitted!");
    }
    catch (error: any) {
      if (error instanceof NoAuthError) {
        router.replace('/login');
      }
      setError(error);
    } finally {
      // setIsApplicationFinished(true);
      setLoading(false);
      dispatch(fetchUserData(userUid));
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <DiplomaStep formData={formData} handleChange={handleChange} />;
      case 2:
        return (
          <CertificatesStep
            formData={formData}
            handleCertificateChange={handleCertificateChange}
            addCertificate={addCertificate}
            removeCertificate={removeCertificate}
            handleFileUpload={handleFileUpload}
          />
        );
      case 3:
        return (
          <SupervisorsStep
            formData={formData}
            handleTherapistChange={handleTherapistChange}
            addTherapist={addTherapist}
            removeTherapist={removeTherapist}
          />
        );
      case 4:
        return (
          <ExtraInfoStep formData={formData} handleChange={handleChange} />
        );
      default:
        return <DiplomaStep formData={formData} handleChange={handleChange} />;
    }
  };

  return (
    <div className={s.container}>
      {renderStep()}
      <div className={s.buttonGroup}>
        {currentStep === 1 && (
          <>
            <Button className={s.btn} onClick={cancelForm}>
              {t.spec_step_nav_btn__Cancel}

            </Button>
            <Button
              className={s.formBtn}
              onClick={nextStep}
              disabled={!validateStep()}
            >
              {t.spec_step_nav_btn__Next}
              {!validateStep() && (
                <>
                  <span className={s.warningIndicator}>!</span>
                  <div className={s.tooltip}>
                    Please fill in all required fields before proceeding.
                  </div>
                </>
              )}
            </Button>
          </>
        )}
        {currentStep === 2 && (
          <>
            <Button className={s.btn} onClick={prevStep}>
              {t.spec_step_nav_btn__Back}
            </Button>
            <Button
              className={s.formBtn}
              onClick={nextStep}
              disabled={!formData.certificates.length || formData.certificates.some(cert => !cert.url || cert.certificateHours === null)}
            >
              {t.spec_step_nav_btn__Next}
              {!validateStep() && (
                <>
                  <span className={s.warningIndicator}>!</span>
                  <div className={s.tooltip}>
                    Please fill in all required fields before proceeding.
                  </div>
                </>
              )}
            </Button>
          </>
        )}
        {currentStep === 3 && (
          <>
            <Button className={s.btn} onClick={prevStep}>
              {t.spec_step_nav_btn__Back}
            </Button>
            {/* <Button
              className={s.btn}
              onClick={nextStep}
              disabled={
                formData.therapists[0].name === '' ||
                formData.therapists[0].sessions === 0
              }
            >
              {t.spec_step_nav_btn__Next}
            </Button> */}
            <Button
              className={s.formBtn}
              onClick={nextStep}
              disabled={
                formData.therapists[0].name === '' ||
                formData.therapists[0].sessions === 0
              }
            >
              {t.spec_step_nav_btn__Next}
              {!validateStep() && (
                <>
                  <span className={s.warningIndicator}>!</span>
                  <div className={s.tooltip}>
                    Please fill in all required fields before proceeding.
                  </div>
                </>
              )}
            </Button>
          </>
        )}
        {currentStep === 4 && (
          <>
            <Button className={s.btn} onClick={prevStep}>
              {t.spec_step_nav_btn__Back}
            </Button>
            <Button className={s.btn} onClick={submitPsyworkerApplication}>
              {t.spec_step_nav_btn__Submit}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default SpecApplication;
