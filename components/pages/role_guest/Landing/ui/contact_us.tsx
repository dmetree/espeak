import Image from 'next/image';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Button from '@/components/shared/ui/Button';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import s from './../landing.module.scss';

import girlWithEarthIcon from '@/components/shared/assets/image_icons/girl-with-earth.svg';
import { Input } from '@/components/shared/ui/Input/Input';

interface FormData {
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  message?: string;
  agree?: string;
}

const ContactSection = () => {
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): { isValid: boolean; errors: FormErrors } => {
    const newErrors: FormErrors = {};

    // Check which name fields are visible - use window width as primary check
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

    // Validate name fields - accept either format
    // If on mobile, require fullName. If on desktop, require firstName+lastName
    // But also check if user filled the opposite format (more flexible)
    const hasFullName = formData.fullName.trim().length > 0;
    const hasFirstName = formData.firstName.trim().length > 0;
    const hasLastName = formData.lastName.trim().length > 0;
    const hasBothNames = hasFirstName && hasLastName;

    if (isMobile) {
      // Mobile: prefer fullName, but accept firstName+lastName as fallback
      if (!hasFullName && !hasBothNames) {
        newErrors.fullName = 'Full name is required';
      }
    } else {
      // Desktop: prefer firstName+lastName, but accept fullName as fallback
      if (!hasBothNames && !hasFullName) {
        if (!hasFirstName) {
          newErrors.firstName = 'First name is required';
        }
        if (!hasLastName) {
          newErrors.lastName = 'Last name is required';
        }
      }
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    // Terms agreement validation
    if (!agree) {
      newErrors.agree = 'You must agree to the Terms and Conditions';
    }

    const isValid = Object.keys(newErrors).length === 0;
    setErrors(newErrors);

    return { isValid, errors: newErrors };
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { isValid, errors: validationErrors } = validateForm();

    if (!isValid) {
      // Show first error message
      const errorMessages = Object.values(validationErrors).filter(Boolean);
      if (errorMessages.length > 0) {
        toast.error(errorMessages[0], {
          position: 'top-right',
          autoClose: 4000,
        });
      }
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          message: formData.message,
          agree: agree,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      // Success
      setIsSubmitted(true);
      setFormData({
        fullName: '',
        firstName: '',
        lastName: '',
        email: '',
        message: '',
      });
      setAgree(false);

      toast.success(data.message || 'Your message has been sent successfully!', {
        position: 'top-right',
        autoClose: 5000,
      });

      // Reset submitted state after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast.error(error.message || 'An error occurred. Please try again later.', {
        position: 'top-right',
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={s.contact}>
      <div className={s.contact__left}>
        <h2>{t.landing_contact.title}</h2>
        <p className={s.contactSub}>{t.landing_contact.sub}</p>

        <form className={s.form} onSubmit={onSubmit}>
          <div className={s.form__names}>
            <div className={s.desktopFirstName}>
              <Input
                mode="basic"
                label={t.landing_contact.first_name}
                placeholder={t.landing_contact.first_name}
                value={formData.firstName}
                onChange={(value) => setFormData({ ...formData, firstName: value })}
                error={errors.firstName}
              />
            </div>
            <div className={s.desktopLastName}>
              <Input
                mode="basic"
                label={t.landing_contact.last_name}
                placeholder={t.landing_contact.last_name}
                value={formData.lastName}
                onChange={(value) => setFormData({ ...formData, lastName: value })}
                error={errors.lastName}
              />
            </div>
          </div>

          <Input
            mode="basic"
            label={t.landing_contact.email}
            placeholder={t.landing_contact.email || 'e.g. john.doe@example.com'}
            type="email"
            value={formData.email}
            onChange={(value) => setFormData({ ...formData, email: value })}
            error={errors.email}
          />

          <div className={s.spacer} />

          <div className={s.textaresWrap}>
            <label className={s.textareaLabel}>{t.landing_contact.message || 'Message'}</label>
            <textarea
              className={s.textarea}
              placeholder={t.landing_contact.message || 'Type your message here...'}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
            {errors.message && <span className={s.errorText}>{errors.message}</span>}
          </div>

          <label className={s.check}>
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => {
                setAgree(e.target.checked);
                if (errors.agree) {
                  setErrors({ ...errors, agree: undefined });
                }
              }}
            />
            {t.landing_contact.agree || 'I agree to the Terms and Conditions'}
            {errors.agree && <span className={s.errorText}>{errors.agree}</span>}
          </label>

          <div className={s.actions}>
            <Button variant="main" type="submit" disabled={loading || isSubmitted}>
              {loading ? 'Sending...' : isSubmitted ? 'Sent!' : t.common.send}
            </Button>
          </div>
        </form>
      </div>

      <Image src={girlWithEarthIcon} alt="mobile" width={600} height={600} className={s.contactImage} />
    </section>
  );
};

export default ContactSection;
