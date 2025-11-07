import React, { useState, useEffect, useMemo, useRef } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Image from "next/image";
import { useRouter } from "next/router";
import Select from 'react-select';

import { storage } from '@/components/shared/utils/firebase/init';
import GenderSelector from '@/components/shared/ui/GenderSelector/GenderSelector';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from "@/store";
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import { actionUpdateProfile, deleteUserProfile, logout } from '@/store/actions/profile/user';

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
import Loading from '@/components/shared/ui/Loader';
import ServicesEditor from '@/components/pages/role_novice/EditProfile/ui/UpdateProfile/ui/ServiceEditor';
import AvatarUploader from '@/components/pages/role_novice/EditProfile/ui/UpdateProfile/ui/AvatarUploader';
import NicknameInput from '@/components/pages/role_novice/EditProfile/ui/UpdateProfile/ui/NicknameInput';
import GenderSelectorBlock from '@/components/pages/role_novice/EditProfile/ui/UpdateProfile/ui/GenderSelectorBlock';
import MethodSelector from '@/components/pages/role_novice/EditProfile/ui/UpdateProfile/ui/MethodSelector';
import SpecialitySelector from '@/components/pages/role_novice/EditProfile/ui/UpdateProfile/ui/SpecialitySelector';
import AboutTextarea from '@/components/pages/role_novice/EditProfile/ui/UpdateProfile/ui/AboutTextarea';
import SubmitButtons from '@/components/pages/role_novice/EditProfile/ui/UpdateProfile/ui/SubmitButtons';
import PriceInput from '@/components/pages/role_novice/EditProfile/ui/UpdateProfile/ui/PriceInput';
import PsyRankSection from '@/components/pages/role_novice/EditProfile/ui/UpdateProfile/ui/PsyRankSection';
import LanguageSelector from '@/components/shared/ui/LanguageSelector';
import IntroductionVideo from '@/components/pages/role_novice/EditProfile/ui/UpdateProfile/ui/IntroductionVideo';


const UpdateProfile = () => {

  const userUid = useSelector(({ user }) => user.uid);
  const userEmail = useSelector(({ user }) => user?.email);
  const userRole = useSelector(({ user }) => user?.userData?.userRole);
  const userData = useSelector(({ user }) => user?.userData);

  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fileSizeError, setFileSizeError] = useState<string>('');
  const [priceErrors, setPriceErrors] = useState<string[]>([]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nickname: '',
    avatar: '',
    gender: '',
    timeZone: '',
    birthYear: '',
    languages: [],
    psySpecialities: [],
    psyMethods: [],
    price: 5,  // TODO: create handlePriceChange method to update this value
    services: [],
    // infoAbout: '',
    infoAbout: {},
    introVideo: '',
  });

  const [loading, setLoading] = useState(false);
  const [activeLang, setActiveLang] = useState(formData.languages[0] || 'en');


  const handleBecomePsyWorker = () => {
    router.replace('/become_mindhealer');
  };

  useEffect(() => {
    if (userData) {
      setFormData({
        nickname: userData.nickname || '',
        avatar: userData.avatar || null,
        gender: userData.gender || '',
        timeZone: userData.timeZone || '',
        birthYear: userData.birthYear || '',
        languages: userData.languages || [],
        psySpecialities: userData.psySpecialities || [],
        psyMethods: userData.psyMethods || [],
        price: userData.price ? userData.price / 100 : 5,
        services: userData.services?.map((s) => ({
          ...s,
          price: s.price ? s.price / 100 : 5, // <-- divide each service price
        })) || [],
        // infoAbout: userData.infoAbout || '',
        infoAbout: userData.infoAbout || {},
        introVideo: userData.introVideo || '',
      });
    }
  }, [userData]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log('event', event.target, name, value)
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTimeZoneChange = (timeZone) => {
    setFormData((prevData) => ({
      ...prevData,
      timeZone: timeZone,
    }));
  };

  // const handleSpecialityChange = (selectOption) => {
  //   const specialityCodeList = selectOption.map(({ value, label }) => value);
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     psySpecialities: specialityCodeList,
  //   }));
  // };

  // const handleMethodsChange = (selectOption) => {
  //   const methodsCodeList = selectOption.map(({ value, label }) => value);
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     psyMethods: methodsCodeList,
  //   }));
  // };


  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const maxSize = 0.5 * 1024 * 1024; // 0.5MB in bytes (524,288 bytes)

      if (file.size > maxSize) {
        setFileSizeError("File size should be less than 0.5MB. Please upload a smaller image.");
        // Reset the input field to prevent invalid file selection
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      setFileSizeError('');
      setAvatarFile(file); // Store the file for upload

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result as string })); // Display preview
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async (file: File, userId: string) => {
    const storageRef = ref(storage, `avatars/${userId}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleServiceChange = (index, field, value, lang) => {
    setFormData((prevData) => {
      const updatedServices = [...prevData.services];
      const currentService = updatedServices[index];

      if (lang) {
        updatedServices[index] = {
          ...currentService,
          [field]: {
            ...(currentService[field] || {}),
            [lang]: value,
          },
        };
      } else {
        updatedServices[index] = {
          ...currentService,
          [field]: value,
        };
      }

      return {
        ...prevData,
        services: updatedServices,
      };
    });
  };

  // const handlePriceChange = (value: number) => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     price: value,
  //   }));
  // };


  const handleAddService = () => {
    setFormData((prevData) => ({
      ...prevData,
      services: [...prevData.services, { title: '', length: 55, price: '' }],
    }));
  };

  const handleDeleteService = (index) => {
    const updatedServices = formData.services.filter((_, i) => i !== index);
    setFormData((prevData) => ({
      ...prevData,
      services: updatedServices,
    }));
  };

  const handleDeleteProfile = () => {
    dispatch(deleteUserProfile(userUid));
    router.replace('/');
    toast.error('Your profile is deleted.');
    dispatch(logout());
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const errors: string[] = [];

    const invalidPrices = formData.services.map((s) => Number(s.price)).map((p, i) => (p < 5 ? i : -1)).filter(i => i !== -1);
    if (invalidPrices.length > 0) {
      const errorMsgs = formData.services.map((s, i) =>
        invalidPrices.includes(i) ? 'Minimum price is $5' : ''
      );
      setPriceErrors(errorMsgs);
      toast.error('Please fix pricing errors before submitting.');
      setLoading(false);
      return;
    }

    try {
      let avatarUrl = userData?.avatar || '';

      if (avatarFile) {
        avatarUrl = await uploadAvatar(avatarFile, userUid);
      }

      const numericPrice = Math.max(5, Math.min(9000, Number(formData.price) || 5));

      const updatedData = {
        ...formData,
        avatar: avatarUrl,
        price: Math.round(numericPrice * 100),
        description: s.description?.trim() || '',
        services: formData.services.map((s) => ({
          ...s,
          description: Object.fromEntries(
            Object.entries(s.description || {}).map(([lang, text]) => [lang, typeof text === 'string' ? text.trim() : ''])
          ),
          price: Math.round(Number(s.price) * 100),
        })),
      };

      await dispatch(actionUpdateProfile(updatedData, userUid));
      toast.success("Your profile was updated.");
      // router.replace('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAboutInfoChange = (lang: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      infoAbout: {
        ...prev.infoAbout,
        [lang]: value,
      },
    }));
  };

  const langOptions = useMemo(() => {
    return getAllLangOptions(t);
  }, [t]);

  const savedLanguages = useMemo(() => {
    return getOptionsFromCodes(formData.languages, t); // Map selected languages to the options
  }, [formData.languages, t]);

  const specialityOptions = useMemo(() => {
    return getAllSpecialityOptions(t);
  }, [t]);

  const savedSpeciality = useMemo(() => {
    return getOptionsFromSpeciality(formData?.psySpecialities, t);
  }, [t, formData.psySpecialities]);

  const methodsOptions = useMemo(() => {
    return getAllMethodsOptions(t);
  }, [t]);

  const savedMethods = useMemo(() => {
    return getOptionsFromMethods(formData?.psyMethods, t);
  }, [t, formData.psyMethods]);

  const servicesOptions = useMemo(() => {
    return getAllServicesOptions(t);
  }, [t]);

  const savedServices = useMemo(() => {
    return getOptionsFromServices(formData?.services, t);
  }, [t, formData.services]);


  const capitalizeFirstLetters = (str: string) =>
    str.replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div className={s.editProfileWrapper}>
      {loading && (
        <>
          <div className={s.loaderWrapper}>
            <Loading />
          </div>
        </>
      )}
      <div className={s.infoWrap}>
        <div className={s.profileWrapper}>
          <div className={s.avatarBlock}>
            <AvatarUploader
              avatar={formData.avatar}
              fileInputRef={fileInputRef}
              onFileChange={handleAvatarChange}
              onClick={handleImageClick}
              fileSizeError={fileSizeError}
              t={t}
            />
            {/* {fileSizeError && <div className={s.errorMessage}>{fileSizeError}</div>} */}
          </div>

          <div className={s.profileInfo}>
            <div className={s.hello}>

              <span className={s.formLabelTitle}>{t.your_nickname} </span>
              <strong>{formData?.nickname}</strong>
            </div>
            <div className={s.formLabel}>

              <span className={s.formLabelTitle}>{t.email} </span>
              <strong>{userEmail}</strong>
            </div>
            {userRole === 'specialist' && (<PsyRankSection psyRank={userData?.psyRank} t={t} />)}
          </div>
        </div>

        <form onSubmit={handleSubmit} className={s.formContainer}>
          {userRole === 'portal-user' && (
            <Button
              className={s.become_psy_btn}
              size="s"
              onClick={handleBecomePsyWorker}
            >
              {t.become_psyworker}
            </Button>
          )}

          {userRole === 'specialist' && (
            <>
              {/* <div className={s.psynameInfo}>{t.profile_title_info}</div> */}
              <NicknameInput
                nickname={formData.nickname}
                onChange={handleInputChange}
                t={t}
              />

              {/* <GenderSelectorBlock
                gender={formData.gender}
                onChange={(value) => handleInputChange({ target: { name: 'gender', value } })}
                t={t}
              /> */}

              <SpecialitySelector
                value={savedSpeciality}
                options={specialityOptions}
                onChange={(options) => setFormData(prev => ({ ...prev, psySpecialities: options.map(o => o.value) }))}
                t={t}
              />

              <MethodSelector
                value={savedMethods}
                options={methodsOptions}
                onChange={(options) => setFormData(prev => ({ ...prev, psyMethods: options.map(o => o.value) }))}
                t={t}
              />

              <LanguageSelector
                value={savedLanguages}
                options={langOptions}
                onChange={(selected) =>
                  setFormData(prev => ({
                    ...prev,
                    languages: Array.isArray(selected) ? selected.map(o => o.value) : []
                  }))
                }
                t={t}
                isMulti
              />

              <IntroductionVideo
                introVideo={formData.introVideo}
                onChange={handleInputChange}
                t={t}
              />

              {/* <PriceInput
                price={formData.price}
                onChange={handlePriceChange}
                t={t}
              /> */}

              <AboutTextarea
                aboutText={formData.infoAbout}
                selectedLanguages={formData.languages}
                activeLang={activeLang}
                setActiveLang={setActiveLang}
                onChange={handleAboutInfoChange}
                t={t}
              />

              <ServicesEditor
                services={formData.services}
                servicesOptions={servicesOptions}
                onServiceChange={handleServiceChange}
                onAddService={handleAddService}
                onDeleteService={handleDeleteService}
                t={t}
                priceErrors={priceErrors}
                selectedLanguages={formData.languages}
                activeLang={activeLang}
                setActiveLang={setActiveLang}
              />
            </>
          )}

          {/* <div className={s.formLabel}>
              <TimeZonePicker
                timeZone={formData.timeZone}
                handleTimeZoneChange={handleTimeZoneChange}
              />
            </div> */}
          <SubmitButtons loading={loading} onDelete={handleDeleteProfile} t={t} />
        </form>
      </div>

    </div>
  );
};

export default UpdateProfile;
