import { useEffect, useState } from 'react';
import styles from './TeacherInfoForm.module.scss';
import HobbySelector, { HobbyOption } from '@/components/shared/ui/HobbySelector';

const TeacherInfoForm = () => {
  const [form, setForm] = useState({
    name: '',
    age: '',
    photo: null as File | null,
    video: null as File | null,
    about: '',
    hobby: [] as HobbyOption[],
    price: '',
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleHobbyChange = (options: HobbyOption[]) => {
    setForm((prev) => ({ ...prev, hobby: options }));
  };

  const handleFile = (field: 'photo' | 'video', file: File | null) => {
    setForm((prev) => ({ ...prev, [field]: file }));

    if (field === 'photo') {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
      setPhotoPreview(file ? URL.createObjectURL(file) : null);
    }
  };

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  return (
    <div className={styles.form}>
      <h1 className={styles.title}>Teacher information</h1>
      <p className={styles.subtitle}>
        Help us create your teacher profile by providing the following details.
      </p>

      <div className={styles.fields}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label>Name / Nickname</label>
            <input
              name="name"
              placeholder="Write your name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label>Age (optional)</label>
            <input
              name="age"
              placeholder="Write your age"
              value={form.age}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={`${styles.field} ${styles.photoField}`}>
            <label>Photo</label>
            {photoPreview && (
              <div
                className={styles.photoPreview}
                style={{ backgroundImage: `url(${photoPreview})` }}
              />
            )}
            <label className={styles.uploadButton}>
              Upload
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFile('photo', e.target.files?.[0] || null)}
              />
            </label>
          </div>

          <div className={styles.field}>
            <label>Introduction video (optional)</label>
            <label className={styles.uploadButton}>
              Upload
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleFile('video', e.target.files?.[0] || null)}
              />
            </label>
          </div>
        </div>

        <div className={styles.field}>
          <label>About</label>
          <textarea
            name="about"
            placeholder="Share a brief introduction about yourself, your teaching philosophy, and what makes your lessons special"
            value={form.about}
            onChange={handleChange}
          />
        </div>

        <div className={styles.rowLast}>
          <div className={styles.field}>
            <label>Hobbies and topics you like to talk about</label>
            <HobbySelector value={form.hobby} onChange={handleHobbyChange} />
          </div>

          <div className={styles.field}>
            <label>Price per lesson</label>
            <div className={styles.priceInput}>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                placeholder=""
              />
              <span>$</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherInfoForm;
