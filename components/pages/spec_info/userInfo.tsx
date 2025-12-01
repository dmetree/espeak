import React, { useEffect, useMemo, useRef, useState } from 'react';
import parse from 'html-react-parser';
import { getLocalizedContent } from '@/hooks/localize';
import { Tooltip } from '@/components/shared/ui/Tooltip/Tooltip';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import styles from './.module.scss';
import Link from 'next/link';
import { storage } from '@/components/shared/utils/firebase/init';
import { AppDispatch } from '@/store';
import { actionUpdateProfile } from '@/store/actions/profile/user';

const UserInfo = ({ specialistData, t, isPublic, currentLocale }) => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const userUid = useSelector(({ user }) => user.uid);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formState, setFormState] = useState({
    nickname: '',
    age: '',
    nativeLanguage: '',
    teachLanguage: '',
    about: '',
    introVideo: '',
    topicsInput: '',
    topics: [] as string[],
    price: '',
  });

  const languageOptions = useMemo(() => {
    const dict = t['user-languages'] || {};
    return Object.entries(dict).map(([code, label]) => ({
      code,
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

    setFormState({
      nickname: specialistData.nickname || '',
      age: specialistData.age ? String(specialistData.age) : '',
      nativeLanguage:
        specialistData.nativeLanguage || specialistData.languages?.[0] || '',
      teachLanguage:
        specialistData.teachLanguage || specialistData.languages?.[0] || '',
      about: typeof about === 'string' ? about : '',
      introVideo: specialistData.introVideo || '',
      topicsInput: '',
      topics: Array.isArray(specialistData.topics)
        ? specialistData.topics
        : [],
      price: specialistData.price ? String(specialistData.price / 100) : '',
    });

    setAvatarPreview(specialistData.avatar || null);
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

  const handleTopicsKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key !== 'Enter' && event.key !== ',') return;

    event.preventDefault();
    const value = formState.topicsInput.trim();
    if (!value) return;

    setFormState((prev) => ({
      ...prev,
      topics: prev.topics.includes(value)
        ? prev.topics
        : [...prev.topics, value],
      topicsInput: '',
    }));
  };

  const handleRemoveTopic = (topic: string) => {
    setFormState((prev) => ({
      ...prev,
      topics: prev.topics.filter((t) => t !== topic),
    }));
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

      setFormState({
        nickname: specialistData.nickname || '',
        age: specialistData.age ? String(specialistData.age) : '',
        nativeLanguage:
          specialistData.nativeLanguage || specialistData.languages?.[0] || '',
        teachLanguage:
          specialistData.teachLanguage || specialistData.languages?.[0] || '',
        about: typeof about === 'string' ? about : '',
        introVideo: specialistData.introVideo || '',
        topicsInput: '',
        topics: Array.isArray(specialistData.topics)
          ? specialistData.topics
          : [],
        price: specialistData.price
          ? String(specialistData.price / 100)
          : '',
      });

      setAvatarPreview(specialistData.avatar || null);
      setAvatarFile(null);
    }
  };

  const handleSave = async () => {
    if (!specialistData || !userUid) return;

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
    const option = languageOptions.find((opt) => opt.code === code);
    return option?.label || code;
  };

  const avatarSrc =
    avatarPreview ||
    specialistData.avatar ||
    'https://api.builder.io/api/v1/image/assets/TEMP/1511ba036a33e82d57c74c1d6bfdba0636f16395?width=280';

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            {isEditing ? 'Edit profile' : 'My profile'}
          </h1>

          {!isPublic && (
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
          )}
        </div>

        <div className={styles.content}>
          <div className={styles.profileSection}>
            <button
              type="button"
              className={styles.avatarButton}
              onClick={handleAvatarClick}
              disabled={!isEditing}
            >
              <img
                src={avatarSrc}
                alt="Profile"
                className={styles.profileImage}
              />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: 'none' }}
            />

            <div className={styles.profileInfo}>
              <div className={styles.profileHeader}>
                {isEditing ? (
                  <input
                    type="text"
                    className={styles.textInput}
                    value={formState.nickname}
                    onChange={(e) => handleChange('nickname', e.target.value)}
                    placeholder="Name / Nickname"
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
                  <span className={styles.label}>Speaks:</span>
                  {isEditing ? (
                    <select
                      className={styles.select}
                      value={formState.nativeLanguage}
                      onChange={(e) =>
                        handleChange('nativeLanguage', e.target.value)
                      }
                    >
                      <option value="">Select language</option>
                      {languageOptions.map((opt) => (
                        <option key={opt.code} value={opt.code}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className={styles.value}>
                      {speaksLabel ? resolveLanguageLabel(speaksLabel) : '—'}
                    </span>
                  )}
                </div>

                <div className={styles.inlineField}>
                  <span className={styles.label}>Teaches:</span>
                  {isEditing ? (
                    <select
                      className={styles.select}
                      value={formState.teachLanguage}
                      onChange={(e) =>
                        handleChange('teachLanguage', e.target.value)
                      }
                    >
                      <option value="">Select language</option>
                      {languageOptions.map((opt) => (
                        <option key={opt.code} value={opt.code}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className={styles.value}>
                      {teachesLabel
                        ? resolveLanguageLabel(teachesLabel)
                        : '—'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>About me</h3>
            {isEditing ? (
              <textarea
                className={styles.textarea}
                value={formState.about}
                onChange={(e) => handleChange('about', e.target.value)}
                rows={6}
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

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Interesting topics</h3>
            {isEditing ? (
              <div className={styles.topicsEditor}>
                <div className={styles.topicsContainer}>
                  {formState.topics.map((topic) => (
                    <button
                      type="button"
                      key={topic}
                      className={styles.topicChip}
                      onClick={() => handleRemoveTopic(topic)}
                    >
                      {topic}
                      <span className={styles.topicRemove}>×</span>
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  className={styles.textInput}
                  placeholder="Type topic and press Enter"
                  value={formState.topicsInput}
                  onChange={(e) => handleChange('topicsInput', e.target.value)}
                  onKeyDown={handleTopicsKeyDown}
                />
              </div>
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

          {specialistData.timeZone && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Timezone</h3>
              <p className={styles.sectionText}>{specialistData.timeZone}</p>
            </section>
          )}

          {isTeacher && (
          <section className={styles.videoSection}>
            <div className={styles.videoText}>
              <h3 className={styles.sectionTitle}>My introduction video</h3>
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

          {isTeacher && (
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
          )}

          {isTeacher && (
          <div className={styles.statsCard}>
            <div className={styles.statItem}>
              <svg
                className={styles.starIcon}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.4687 22.4997C18.3109 22.5004 18.1568 22.4511 18.0286 22.3591L12 17.9885L5.97139 22.3591C5.84259 22.4525 5.68742 22.5026 5.52832 22.502C5.36921 22.5014 5.21441 22.4502 5.08629 22.3559C4.95818 22.2615 4.86339 22.1289 4.81563 21.9771C4.76787 21.8254 4.76961 21.6623 4.82061 21.5116L7.17186 14.5474L1.07811 10.3685C0.946113 10.2781 0.846491 10.1478 0.793797 9.99675C0.741103 9.84568 0.7381 9.68172 0.785225 9.52883C0.83235 9.37593 0.927135 9.24211 1.05573 9.14692C1.18432 9.05173 1.33999 9.00016 1.49998 8.99974H9.0178L11.2865 2.01771C11.3354 1.86697 11.4308 1.73558 11.559 1.6424C11.6871 1.54922 11.8415 1.49902 12 1.49902C12.1584 1.49902 12.3128 1.54922 12.441 1.6424C12.5692 1.73558 12.6645 1.86697 12.7134 2.01771L14.9822 9.00208H22.5C22.6602 9.002 22.8162 9.05322 22.9452 9.14823C23.0741 9.24323 23.1693 9.37704 23.2167 9.53005C23.2642 9.68307 23.2613 9.84724 23.2087 9.99854C23.1561 10.1498 23.0564 10.2803 22.9242 10.3708L16.8281 14.5474L19.178 21.5097C19.216 21.6225 19.2267 21.7426 19.2092 21.8603C19.1917 21.978 19.1464 22.0898 19.0771 22.1865C19.0078 22.2832 18.9165 22.3621 18.8107 22.4165C18.7049 22.471 18.5877 22.4995 18.4687 22.4997Z"
                  fill="#FFC245"
                />
              </svg>
              <p className={styles.statValue}>5.0</p>
            </div>
            <p className={styles.statValue}>1 000 lessons</p>
            <p className={styles.statValue}>200 students</p>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
