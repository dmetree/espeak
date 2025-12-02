import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import Select from "react-select";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { storage } from "@/components/shared/utils/firebase/init";
import GenderSelector from "@/components/shared/ui/GenderSelector/GenderSelector";

import { useDispatch, useSelector } from "react-redux";
import { loadMessages } from "@/components/shared/i18n/translationLoader";
import { actionUpdateProfile } from "@/store/actions/profile/user";
import { actionCreateUser } from "@/store/actions/profile/user";

import Button from "@/components/shared/ui/Button";
import { Input } from "@/components/shared/ui/Input/Input";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import TimeZonePicker from "@/components/shared/ui/TimeZonePicker/TimeZonePicker";

import s from "./.module.scss";

import {
  getAllLangOptions,
  getOptionsFromCodes,
  getAllSpecialityOptions,
  getOptionsFromSpeciality,
  getAllMethodsOptions,
  getOptionsFromMethods,
  getAllServicesOptions,
  getOptionsFromServices,
} from "@/components/shared/i18n/translationLoader";

const UpdateUserToSpec = () => {
  const userUid = useSelector(({ user }) => user.uid);
  const userEmail = useSelector(({ user }) => user?.email);
  const applicantUserData = useSelector(({ user }) => user?.applicantUserData);

  const dispatch = useDispatch();
  const router = useRouter();

  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const t = loadMessages(currentLocale);

  const [formData, setFormData] = useState({
    nickname: "",
    gender: "",
    timeZone: "",
    birthYear: "",
    languages: [],
    psySpecialities: [],
    psyMethods: [],
    services: [],
    infoAbout: "",
    userRole: "specialist",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (applicantUserData) {
      setFormData({
        nickname: applicantUserData.nickname || "",
        avatar: applicantUserData.avatar || null,
        gender: applicantUserData.gender || "",
        timeZone: applicantUserData.timeZone || "",
        birthYear: applicantUserData.birthYear || "",
        languages: applicantUserData.languages || [],
        psySpecialities: applicantUserData.psySpecialities || [],
        psyMethods: applicantUserData.psyMethods || [],
        services: applicantUserData.services || [],
        infoAbout: applicantUserData.infoAbout || "",
      });
    }
  }, [applicantUserData]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
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

  const handleLanguagesChange = (selectOption) => {
    const langCodeList = selectOption.map(({ value, label }) => value);
    setFormData((prevData) => ({
      ...prevData,
      languages: langCodeList,
    }));
  };

  const handleSpecialityChange = (selectOption) => {
    const specialityCodeList = selectOption.map(({ value, label }) => value);
    setFormData((prevData) => ({
      ...prevData,
      psySpecialities: specialityCodeList,
    }));
  };

  const handleMethodsChange = (selectOption) => {
    const methodsCodeList = selectOption.map(({ value, label }) => value);
    setFormData((prevData) => ({
      ...prevData,
      psyMethods: methodsCodeList,
    }));
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        avatar: file,
      }));
    }
  };

  const uploadAvatar = async (file, userId) => {
    if (!file) throw new Error("No file provided for upload");

    const avatarRef = ref(storage, `avatars/${userId}`);
    // Upload the file
    const snapshot = await uploadBytes(avatarRef, file);
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  };

  const handleServiceChange = (index, field, value) => {
    setFormData((prevData) => {
      const updatedServices = [...prevData.services];
      const updatedValue =
        field === "price" ? Math.max(5, Math.min(9000, value)) : value; // Ensure price is between 5 and 1000
      updatedServices[index] = {
        ...updatedServices[index],
        [field]: updatedValue,
      };
      return {
        ...prevData,
        services: updatedServices,
      };
    });
  };

  const handleAddService = () => {
    setFormData((prevData) => ({
      ...prevData,
      services: [...prevData.services, { title: "", length: 55, price: "" }],
    }));
  };

  const handleDeleteService = (index) => {
    const updatedServices = formData.services.filter((_, i) => i !== index);
    setFormData((prevData) => ({
      ...prevData,
      services: updatedServices,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let avatarUrl = null;

      // Upload a new avatar if it has been added
      if (formData.avatar) {
        avatarUrl = await uploadAvatar(formData.avatar, "temp-user-id"); // Temporary ID for the avatar path
      }

      const newUserData = { ...formData, avatar: avatarUrl };

      console.log("Data to be saved in Firestore:", newUserData);

      // Dispatch Redux action to create a new user
      await dispatch(actionCreateUser(newUserData));

      toast.success("New user profile was created.");
      router.replace("/admin");
    } catch (error) {
      console.error("Error creating user profile:", error);
      toast.error("Failed to create a user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAboutInfoChange = (event) => {
    const { value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      infoAbout: value,
    }));
  };

  const langOptions = useMemo(() => {
    return getAllLangOptions(t);
  }, [t]);

  const savedLanguages = useMemo(() => {
    return getOptionsFromCodes(formData?.languages, t);
  }, [t, formData.languages]);

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
    return getOptionsFromServices(formData?.psyServices, t);
  }, [t, formData.psyServices]);

  return (
    <div className="">
      {/* <div className={s.leftColumn}> */}
      <div className="">User name: {formData.nickname}</div>
      {/* Image Upload for Avatar */}
      <div className={s.avatarContainer}>
        {formData.avatar ? (
          <img
            src={
              typeof formData.avatar === "string"
                ? formData.avatar
                : URL.createObjectURL(formData.avatar)
            }
            alt="Avatar Preview"
            className={s.avatarPreview}
          />
        ) : (
          <div alt="Avatar Preview" className={s.avatarPreview} />
        )}
        <input type="file" accept="image/*" onChange={handleAvatarChange} />
      </div>

      <div className={s.formLabel}>User email: {userEmail}</div>

      <form onSubmit={handleSubmit} className={s.formContainer}>
        <>
          <label htmlFor="">{t.profile_title}</label>

          <Input
            formLabel
            inputClassName={s.formInput}
            type="text"
            name="nickname"
            id="nickname"
            value={formData.nickname}
            onChange={handleInputChange}
            placeholder={t.your_psy_name}
            required
          />

          <div className="">
            User role: TODO add select to select and change userRole portalUser
            / specialist
          </div>

          {/* TODO: Add input for psyrank */}
          <div className={s.formLabel}>
            <span>Current rank: </span>
            {applicantUserData?.psyRank}
          </div>

          <div className="">Personal Therapy</div>
          <div className="">Client Sessions</div>
          <div className="">Hr Education</div>
          <div className="">Psy since year</div>

          <div className={s.formLabel}>
            <span>{t.specialist_expert_in}</span>
            <Select
              isMulti
              name="specialities"
              options={specialityOptions}
              value={savedSpeciality}
              onChange={handleSpecialityChange}
            />
          </div>

          <span className={s.psyMethodsLabel}>
            {t.specialist_author_of_methods}
          </span>

          <div className={s.formLabel}>
            <span>{t.specialist_psy_methods}</span>
            <Select
              isMulti
              name="methods"
              options={methodsOptions}
              value={savedMethods}
              onChange={handleMethodsChange}
            />
          </div>

          {/* TODO add input to add teachers by nickname */}
          <div className="">Teachers / Supervisors:</div>

          {/* TODO add input to add notable students by nickname */}
          <div className="">Students:</div>

          <div className={s.formLabel}>
            <span>Languages:</span>
            <Select
              isMulti
              name="langs"
              options={langOptions}
              value={savedLanguages}
              onChange={handleLanguagesChange}
            />
          </div>

          <div className={s.formLabel}>
            <span>{t.specialist_services}</span>
            {formData.services.length === 0 ? (
              <span>Empty. No services added.</span>
            ) : (
              <div className={s.servicesList}>
                {formData.services.map((service, index) => (
                  <div key={index} className={s.serviceItem}>
                    <span>{index + 1}.</span>
                    <Select
                      className={s.serviceTitle}
                      name="title"
                      options={servicesOptions}
                      value={servicesOptions.find(
                        (option) => option.value === service.title
                      )}
                      onChange={(selectedOption) =>
                        handleServiceChange(
                          index,
                          "title",
                          selectedOption.value
                        )
                      }
                      placeholder="Service Title"
                    />
                    <div className={s.serviceParam}>
                      <div className={s.inputContainer}>
                        <Input
                          className={s.serviceParamInput}
                          type="number"
                          name="length"
                          value={service.length}
                          onChange={(e) =>
                            handleServiceChange(index, "length", e.target.value)
                          }
                          placeholder="Length"
                          readOnly
                        />
                        <span className={s.inputPostfix}>min</span>
                      </div>
                    </div>

                    <div className={s.serviceParam}>
                      <div className={s.inputContainer}>
                        <span className={s.inputPrefix}>$</span>
                        <Input
                          className={s.serviceParamInput}
                          type="number"
                          name="price"
                          value={service.price || 5} // Default value to 5 if not set
                          onChange={(e) =>
                            handleServiceChange(
                              index,
                              "price",
                              Math.max(5, Math.min(9000, e.target.value))
                            )
                          }
                          placeholder="Price in"
                          min="5" // Ensures user cannot input a value less than 5
                          max="9000"
                        />
                      </div>
                    </div>

                    <Button
                      className={s.deleteServiceBtn}
                      onClick={() => handleDeleteService(index)}
                    >
                      X
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <Button
              type="button"
              className={s.addServiceBtn}
              onClick={handleAddService}
            >
              + Add Service
            </Button>
          </div>

          <div className="">
            <div>About</div>
            <textarea
              value={formData.infoAbout}
              onChange={handleAboutInfoChange}
              rows="10"
              className={s.textarea}
            ></textarea>
          </div>
        </>

        <Button type="submit">{t.save}</Button>
      </form>
    </div>
  );
};

export default UpdateUserToSpec;
