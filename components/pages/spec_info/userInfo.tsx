import React, { useEffect, useMemo, useRef, useState } from 'react';
import parse from 'html-react-parser';
import { getLocalizedContent } from '@/hooks/localize';
import { Tooltip } from '@/components/shared/ui/Tooltip/Tooltip';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import styles from './.module.scss';

import { storage } from '@/components/shared/utils/firebase/init';
import { AppDispatch } from '@/store';
import { actionUpdateProfile } from '@/store/actions/profile/user';
import { minifyAddress, copyTextToClipboard } from '@/components/shared/utils/helper';
import { toggleWalletSelector } from '@/store/actions/networkCardano';

import LanguageSelector from '@/components/pages/spec_info/ui/LanguageSelector';
import AboutTextarea from '@/components/pages/spec_info/ui/AboutTextarea';
import ServicesEditor from '@/components/pages/spec_info/ui/ServiceEditor';
import NicknameInput from '@/components/pages/spec_info/ui/NicknameInput';
import AvatarUploader from '@/components/pages/spec_info/ui/AvatarUploader';
import MethodSelector from '@/components/pages/spec_info/ui/MethodSelector';
import { ColoredInfoBlock } from '@/components/pages/spec_info/ui/ColoredInfoBlock';

type SelectOption = { value: string; label: string };

type Service = {
  title: { [lang: string]: string };
  description?: { [lang: string]: string };
  length: number;
  price: string;
};

const UserInfo = ({ specialistData, t, isPublic, currentLocale }) => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const userUid = useSelector(({ user }) => user.uid);
  const cardanoAddress = useSelector(({ networkCardano }) => networkCardano.user?.address);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null!);

  const hasWallet = Boolean(specialistData?.walletAddress);

  const [priceErrors, setPriceErrors] = useState<string[]>([]);
  const [activeLang, setActiveLang] = useState(currentLocale || 'en');

  const [formState, setFormState] = useState({
    nickname: '',
    age: '',
    nativeLanguage: '',
    teachLanguage: '',
    about: '',
    introVideo: '',
    topics: [] as string[],
    price: '',
    services: [] as Service[],
  });

  const languageOptions = useMemo((): SelectOption[] => {
    const dict = t['user-languages'] || {};
    return Object.entries(dict).map(([code, label]) => ({
      value: String(code),
      label: String(label),
    }));
  }, [t]);

  const handleShareClick = () => {
    const { origin, pathname } = window.location;

    const pageUrl =
      pathname === '/office/'
        ? `${origin}/specialist-profile/${specialistData?.nickname}`
        : `${origin}${pathname}`;

    navigator.clipboard
      .writeText(pageUrl)
      .then(() => {
        toast.success(t.specialist_url_copied);
      })
      .catch((err) => {
        console.error('Failed to copy URL:', err);
        toast.error(t.specialist_url_copied_fail);
      });
  };

  useEffect(() => {
    if (!specialistData) return;

    const about = specialistData.infoAbout
      ? getLocalizedContent(specialistData.infoAbout, currentLocale)
      : '';

    const services: Service[] = Array.isArray(specialistData.services)
      ? specialistData.services.map((service: any) => {
          const title =
            typeof service?.title === 'object' && service?.title
              ? service.title
              : { [currentLocale]: String(service?.title || '') };

          const description =
            typeof service?.description === 'object' && service?.description
              ? service.description
              : service?.description
              ? { [currentLocale]: String(service.description) }
              : {};

          const priceNumber =
            typeof service?.price === 'number'
              ? service.price / 100
              : Number(service?.price);

          return {
            ...service,
            title,
            description,
            length: Number(service?.length) || 55,
            price:
              Number.isFinite(priceNumber) && priceNumber
                ? String(priceNumber)
                : '',
          };
        })
      : [];

    setFormState({
      nickname: specialistData.nickname || '',
      age: specialistData.age ? String(specialistData.age) : '',
      nativeLanguage:
        specialistData.nativeLanguage || specialistData.languages?.[0] || '',
      teachLanguage:
        specialistData.teachLanguage || specialistData.languages?.[0] || '',
      about: typeof about === 'string' ? about : '',
      introVideo: specialistData.introVideo || '',
      topics: Array.isArray(specialistData.topics) ? specialistData.topics : [],
      price: specialistData.price ? String(specialistData.price / 100) : '',
      services,
    });

    setAvatarPreview(specialistData.avatar || null);
    setActiveLang(currentLocale || 'en');
    setPriceErrors([]);
  }, [specialistData, currentLocale]);

  const handleAvatarClick = () => {
    if (!isEditing) return;
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadAvatar = async (file: File, userId: string) => {
    const storageRef = ref(storage, `avatars/${userId}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleChange = (
    field: keyof typeof formState,
    value: string | string[],
  ) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleServiceChange = (
    index: number,
    field: string,
    value: any,
    lang?: string,
  ) => {
    setFormState((prev) => {
      const updatedServices = [...prev.services];
      const currentService = updatedServices[index];

      if (lang) {
        updatedServices[index] = {
          ...currentService,
          [field]: {
            ...((currentService as any)[field] || {}),
            [lang]: value,
          },
        } as any;
      } else {
        updatedServices[index] = {
          ...currentService,
          [field]: value,
        } as any;
      }

      return {
        ...prev,
        services: updatedServices,
      };
    });
  };

  const handleAddService = () => {
    setFormState((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        {
          title: {},
          description: {},
          length: 55,
          price: '',
        },
      ],
    }));

    setPriceErrors((prev) => [...prev, '']);
  };

  const handleDeleteService = (index: number) => {
    setFormState((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));

    setPriceErrors((prev) => prev.filter((_, i) => i !== index));
  };


  const handleEditToggle = () => {
    if (isPublic) return;
    setIsEditing((prev) => !prev);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (specialistData) {
      const about = specialistData.infoAbout
        ? getLocalizedContent(specialistData.infoAbout, currentLocale)
        : '';

      const services: Service[] = Array.isArray(specialistData.services)
        ? specialistData.services.map((service: any) => {
            const title =
              typeof service?.title === 'object' && service?.title
                ? service.title
                : { [currentLocale]: String(service?.title || '') };

            const description =
              typeof service?.description === 'object' && service?.description
                ? service.description
                : service?.description
                ? { [currentLocale]: String(service.description) }
                : {};

            const priceNumber =
              typeof service?.price === 'number'
                ? service.price / 100
                : Number(service?.price);

            return {
              ...service,
              title,
              description,
              length: Number(service?.length) || 55,
              price:
                Number.isFinite(priceNumber) && priceNumber
                  ? String(priceNumber)
                  : '',
            };
          })
        : [];

      setFormState({
        nickname: specialistData.nickname || '',
        age: specialistData.age ? String(specialistData.age) : '',
        nativeLanguage:
          specialistData.nativeLanguage || specialistData.languages?.[0] || '',
        teachLanguage:
          specialistData.teachLanguage || specialistData.languages?.[0] || '',
        about: typeof about === 'string' ? about : '',
        introVideo: specialistData.introVideo || '',
        topics: Array.isArray(specialistData.topics) ? specialistData.topics : [],
        price: specialistData.price ? String(specialistData.price / 100) : '',
        services,
      });

      setAvatarPreview(specialistData.avatar || null);
      setAvatarFile(null);
      setActiveLang(currentLocale || 'en');
      setPriceErrors([]);
    }
  };

  const handleSave = async () => {
    if (!specialistData || !userUid) return;

    // validate services prices (same rule as UpdateProfile)
    const invalidPrices = formState.services
      .map((s) => Number(s.price))
      .map((p, i) => (p < 5 ? i : -1))
      .filter((i) => i !== -1);

    if (invalidPrices.length > 0) {
      const errorMsgs = formState.services.map((_, i) =>
        invalidPrices.includes(i) ? 'Minimum price is $5' : '',
      );
      setPriceErrors(errorMsgs);
      toast.error('Please fix pricing errors before saving.');
      return;
    }

    try {
      setIsSaving(true);

      let avatarUrl = specialistData.avatar || '';
      if (avatarFile) {
        avatarUrl = await uploadAvatar(avatarFile, userUid);
      }

      const numericPrice = formState.price
        ? Math.max(0, Number(formState.price))
        : 0;

      const infoAbout = {
        ...(specialistData.infoAbout || {}),
        [currentLocale]: formState.about,
      };

      const languages = Array.from(
        new Set(
          [formState.nativeLanguage, formState.teachLanguage].filter(Boolean),
        ),
      );

      const updatedData: any = {
        avatar: avatarUrl,
        nickname: formState.nickname.trim(),
        age: formState.age ? Number(formState.age) : null,
        nativeLanguage: formState.nativeLanguage || null,
        teachLanguage: formState.teachLanguage || null,
        introVideo: formState.introVideo.trim(),
        infoAbout,
        topics: formState.topics,
        price: numericPrice ? Math.round(numericPrice * 100) : null,
        services: formState.services.map((service) => ({
          ...service,
          title: Object.fromEntries(
            Object.entries(service.title || {}).map(([lang, text]) => [
              lang,
              typeof text === 'string' ? text.trim() : '',
            ]),
          ),
          description: Object.fromEntries(
            Object.entries(service.description || {}).map(([lang, text]) => [
              lang,
              typeof text === 'string' ? text.trim() : '',
            ]),
          ),
          price: Math.round(Number(service.price || 0) * 100),
        })),
      };

      if (languages.length) {
        updatedData.languages = languages;
      }

      await dispatch(actionUpdateProfile(updatedData, userUid));

      toast.success(t.specialist_profile_updated || 'Profile updated');
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error updating profile', error);
      toast.error(
        t.specialist_profile_update_failed ||
          error?.message ||
          'Failed to update profile',
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!specialistData) return null;

  const isTeacher = specialistData.userRole === 'specialist';

  const displayName = formState.nickname || specialistData.nickname || '';

  const speaksLabel = formState.nativeLanguage ||
    specialistData.nativeLanguage ||
    specialistData.languages?.[0] ||
    '';

  const teachesLabel = formState.teachLanguage ||
    specialistData.teachLanguage ||
    specialistData.languages?.[0] ||
    '';

  const resolveLanguageLabel = (code: string) => {
    const option = languageOptions.find((opt) => opt.value === code);
    return option?.label || code;
  };

  console.log('formState.services', formState.services, formState)

  const avatarSrc =
    avatarPreview ||
    specialistData.avatar ||
    'https://api.builder.io/api/v1/image/assets/TEMP/1511ba036a33e82d57c74c1d6bfdba0636f16395?width=280';

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {!isPublic && (
          <div className={styles.header}>
            <h1 className={styles.title}>
              {isEditing ? 'Edit profile' : 'My profile'}
            </h1>

            <div className={styles.headerActions}>
              {isEditing && (
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Cancel
                </button>
              )}
              <button
                type="button"
                className={styles.editButton}
                onClick={isEditing ? handleSave : handleEditToggle}
                disabled={isSaving}
              >
                {isEditing ? 'Save' : 'Edit'}
              </button>
            </div>

          </div>
        )}

        <div className={styles.content}>
          <div className={styles.contentGeneral}>
            <div className={styles.profileSection}>
              {isEditing ? (
                <AvatarUploader
                  avatar={avatarSrc}
                  fileInputRef={fileInputRef}
                  onFileChange={handleAvatarChange}
                  onClick={handleAvatarClick}
                  fileSizeError={''}
                  t={t}
                />
              ) : (
                <img
                  src={avatarSrc}
                  alt="Profile"
                  className={styles.profileImage}
                />
              )}

              <div className={styles.profileInfo}>
                <div className={styles.profileHeader}>
                  {isEditing ? (
                    <NicknameInput
                      nickname={formState.nickname}
                      onChange={(value) => handleChange('nickname', value)}
                      t={t}
                    />
                  ) : (
                    <h2 className={styles.profileName}>{displayName}</h2>
                  )}
                  {isTeacher && (
                    <p className={styles.profileRole}>Teacher</p>
                  )}
                </div>

                <div className={styles.inlineFields}>
                  <div className={styles.inlineField}>
                    {isEditing ? (
                      <LanguageSelector
                        label="Speaks"
                        isMulti={false}
                        value={
                          formState.nativeLanguage
                            ? {
                                value: formState.nativeLanguage,
                                label: resolveLanguageLabel(formState.nativeLanguage),
                              }
                            : null
                        }
                        options={languageOptions}
                        onChange={(selected: any) => {
                          const opt = Array.isArray(selected)
                            ? selected[0]
                            : selected;
                          handleChange('nativeLanguage', opt?.value || '');
                        }}
                        t={t}
                      />
                    ) : (
                      <>
                        <span className={styles.label}>Speaks:</span>
                        <span className={styles.value}>
                          {speaksLabel ? resolveLanguageLabel(speaksLabel) : '—'}
                        </span>
                      </>
                    )}
                  </div>

                  <div className={styles.inlineField}>
                    {isEditing ? (
                      <LanguageSelector
                        label="Teaches"
                        isMulti={false}
                        value={
                          formState.teachLanguage
                            ? {
                                value: formState.teachLanguage,
                                label: resolveLanguageLabel(formState.teachLanguage),
                              }
                            : null
                        }
                        options={languageOptions}
                        onChange={(selected: any) => {
                          const opt = Array.isArray(selected)
                            ? selected[0]
                            : selected;
                          handleChange('teachLanguage', opt?.value || '');
                        }}
                        t={t}
                      />
                    ) : (
                      <>
                        <span className={styles.label}>Teaches:</span>
                        <span className={styles.value}>
                          {teachesLabel ? resolveLanguageLabel(teachesLabel) : '—'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div>
            {hasWallet ? (
              <div className={styles.walletBox}>
                <div className="">
                  <h3>Your Cardano wallet:</h3>
                  <p className={styles.priceValue}>{minifyAddress(specialistData.walletAddress, 5)}</p>
                </div>

                <button
                  type="button"
                  className={styles.saveWalletButton}
                  onClick={() => {
                    if (!specialistData.walletAddress) return;
                    copyTextToClipboard(specialistData.walletAddress);
                    toast.success('Wallet address copied');
                  }}
                >
                  Copy address
                </button>
              </div>
            ) : (
              <div className={styles.walletBox}>
                <p className={styles.walletText}>
                  <button
                    type="button"
                    className={styles.walletLink}
                    onClick={() => dispatch(toggleWalletSelector())}
                  >
                    Connect wallet
                  </button>{" "}
                  and save it to your profile.
                </p>
                <span className={styles.walletNote}>
                  You can save your wallet address only once.
                </span>
                <button
                  type="button"
                  className={styles.saveWalletButton}
                  onClick={async () => {
                    if (!userUid) {
                      toast.error('You must be logged in to save a wallet.');
                      return;
                    }
                    if (!cardanoAddress) {
                      toast.error('Connect a Cardano wallet first.');
                      return;
                    }

                    try {
                      await dispatch(
                        actionUpdateProfile({ walletAddress: cardanoAddress }, userUid),
                      );
                      toast.success('Wallet saved to your profile.');
                    } catch (e) {
                      console.error(e);
                      toast.error('Failed to save wallet. Please try again.');
                    }
                  }}
                >
                  Save Wallet
                </button>
              </div>
            )}
            </div>
          </div>

          <ColoredInfoBlock isEditing={isEditing}/>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>About</h3>
            {isEditing ? (
              <AboutTextarea
                aboutText={{ [currentLocale]: formState.about }}
                selectedLanguages={[currentLocale]}
                activeLang={currentLocale}
                setActiveLang={() => undefined}
                onChange={(_, text) => handleChange('about', text)}
                t={t}
              />
            ) : specialistData.infoAbout ? (
              <div className={styles.sectionText}>
                {parse(
                  getLocalizedContent(
                    specialistData.infoAbout,
                    currentLocale,
                  ) || '',
                )}
              </div>
            ) : (
              <p className={styles.sectionText}>No description yet.</p>
            )}
          </section>

          {isTeacher && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Services</h3>
              {isEditing ? (
                <ServicesEditor
                  services={formState.services}
                  servicesOptions={[]}
                  onServiceChange={handleServiceChange}
                  onAddService={handleAddService}
                  onDeleteService={handleDeleteService}
                  t={t}
                  priceErrors={priceErrors}
                  selectedLanguages={[currentLocale]}
                  activeLang={activeLang}
                  setActiveLang={setActiveLang}
                />
              ) : Array.isArray(specialistData.services) &&
                specialistData.services.length > 0 ? (
                <div className={styles.sectionText}>
                  {specialistData.services.map((service: any, idx: number) => {
                    const title = getLocalizedContent(service.title || {}, currentLocale);

                    const description = getLocalizedContent(
                      service.description || {},
                      currentLocale,
                    );

                    const price =
                      typeof service.price === 'number'
                        ? service.price / 100
                        : Number(service.price);

                    return (
                      <div key={`${idx}-${String(title)}`}>
                        <strong>{typeof title === 'string' ? title : '—'}</strong>

                        {Number.isFinite(price) && price ? (
                          <span>{` — $${price}`}</span>
                        ) : null}

                        <div
                          dangerouslySetInnerHTML={{
                            __html: typeof description === 'string' ? description : '',
                          }}
                        />
                      </div>
                    );
                  })}

                </div>
              ) : (
                <p className={styles.sectionText}>No services added yet.</p>
              )}
            </section>
          )}

          <div className={styles.topicsAndTimezone}>
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Interesting topics</h3>
              {isEditing ? (
                <MethodSelector
                  label="Interesting topics"
                  translationKey="topics"
                  name="topics"
                  isCreatable
                  value={formState.topics.map((topic) => ({ value: topic, label: topic }))}
                  options={Array.from(new Set(formState.topics)).map((topic) => ({
                    value: topic,
                    label: topic,
                  }))}
                  onChange={(selected: any) => {
                    const list = Array.isArray(selected) ? selected : [];
                    handleChange(
                      'topics',
                      list.map((opt) => opt.value),
                    );
                  }}
                  t={t}
                />
              ) : formState.topics.length > 0 ? (
                <div className={styles.topicsContainer}>
                  {formState.topics.map((topic) => (
                    <span key={topic} className={styles.topic}>
                      {topic}
                    </span>
                  ))}
                </div>
              ) : (
                <p className={styles.sectionText}>No topics added yet.</p>
              )}
            </section>

            {/* {isTeacher && (
              <section className={styles.priceSection}>
                <h3 className={styles.sectionTitle}>Price (per lesson)</h3>
                {isEditing ? (
                  <div className={styles.priceInputWrapper}>
                    <input
                      type="number"
                      min={0}
                      className={styles.priceInput}
                      value={formState.price}
                      onChange={(e) => handleChange('price', e.target.value)}
                    />
                    <span className={styles.priceSuffix}>$</span>
                  </div>
                ) : (
                  <p className={styles.priceValue}>
                    {specialistData.price ? specialistData.price / 100 : '—'} $
                  </p>
                )}
              </section>
            )} */}

            {specialistData.timeZone && (
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Timezone</h3>
                <p className={styles.sectionText}>{specialistData.timeZone}</p>
              </section>
            )}
          </div>


          {isTeacher && (
            <section className={styles.videoSection}>
              <div className={styles.videoText}>
                <h3 className={styles.sectionTitle}>Introduction video</h3>
                {specialistData.introVideo ? (
                  <a
                    href={specialistData.introVideo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.sectionText} ${styles.link}`}
                  >
                    Open current video
                  </a>
                ) : (
                  <p className={`${styles.sectionText} ${styles.muted}`}>
                    No video at this moment, please add your introduction video
                    link.
                  </p>
                )}
              </div>
              {isEditing && (
                <input
                  type="text"
                  className={styles.textInput}
                  placeholder="https://www.youtube.com/..."
                  value={formState.introVideo}
                  onChange={(e) => handleChange('introVideo', e.target.value)}
                />
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
