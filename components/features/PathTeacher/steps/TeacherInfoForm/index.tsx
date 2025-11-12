import { useState } from 'react';
import styles from './TeacherInfoForm.module.scss';

const TeacherInfoForm = () => {
  const [form, setForm] = useState({
    name: '',
    age: '',
    photo: null,
    video: null,
    about: '',
    hobby: '',
    price: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFile = (field, file) => setForm({ ...form, [field]: file });

  const handleSubmit = (e) => {
    e.preventDefault();
    // onSubmit(form);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1 className={styles.title}>Teacher information</h1>
      <p className={styles.subtitle}>
        Help us create your teacher profile by providing the following details.
      </p>

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
        <div className={styles.field}>
          <label>Photo</label>
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
          <label>My introduction video</label>
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
        <label>About me</label>
        <textarea
          name="about"
          placeholder="Share a brief introduction about yourself, your teaching philosophy, and what makes your lessons special"
          value={form.about}
          onChange={handleChange}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label>Hobbies and topics you like to talk about</label>
          <select
            name="hobby"
            value={form.hobby}
            onChange={handleChange}
          >
            <option value="">Choose category</option>
            <option value="travel">Travel</option>
            <option value="music">Music</option>
            <option value="sports">Sports</option>
            <option value="books">Books</option>
            <option value="culture">Culture</option>
          </select>
        </div>

        <div className={styles.field}>
          <label>Price per lesson</label>
          <div className={styles.priceInput}>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="0"
            />
            <span>$</span>
          </div>
        </div>
      </div>

      <button type="submit" className={styles.submit}>Continue</button>
    </form>
  );
};

export default TeacherInfoForm;
