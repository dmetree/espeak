import React, { useState } from 'react';
import dynamic from 'next/dynamic';

import Button from '@/components/shared/ui/Button';
import { Input } from '@/components/shared/ui/Input/Input';

import s from './.module.scss';

type Service = {
  title: { [lang: string]: string };
  description?: { [lang: string]: string };
  length: number;
  price: string;
};

type Option = {
  value: string;
  label: any;
};

type Props = {
  services: Service[];
  servicesOptions: Option[];
  onServiceChange: (index: number, field: string, value: any, lang?: string) => void;
  onAddService: () => void;
  onDeleteService: (index: number) => void;
  t: any;
  priceErrors: string[];
  selectedLanguages: string[];
  activeLang: string;
  setActiveLang: (lang: string) => void;
};



const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
});

const ServicesEditor: React.FC<Props> = ({
  services,
  onServiceChange,
  onAddService,
  onDeleteService,
  t,
  priceErrors,
  selectedLanguages,
  activeLang,
  setActiveLang
}) => {

  return (
    <div className={s.formLabel}>
      {selectedLanguages.length > 1 && (
        <div className={s.langTabs}>
          {selectedLanguages.map((lang) => (
            <button
              key={lang}
              type="button"
              className={`${s.langTab} ${activeLang === lang ? s.active : ''}`}
              onClick={() => setActiveLang(lang)}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      <span className={`${s.formLabelTitle} ${s.labelWithTooltip}`}>{t.specialist_services}</span>
      {services.length === 0 ? (
        <span>{t.no_services_added || 'No services added.'}</span>
      ) : (
        <div className={s.servicesList}>
          {services.map((service, index) => (
            <React.Fragment key={index}>
              <div className={s.serviceItem}>
                <span>{index + 1}.</span>
                <div className={s.serviceWrap}>
                  <div className={s.serviceUp}>
                    <Input
                      inputClassName={s.formInput}
                      type="text"
                      name="title"
                      value={service.title?.[activeLang] || ''}
                      onChange={(value) =>
                        onServiceChange(index, 'title', value, activeLang)
                      }
                      placeholder={t.service_title || 'Service title'}
                    />


                    <div className={s.serviceParam}>
                      <div className={s.inputContainer}>
                        <Input
                          className={`${s.serviceParamInput} ${s.minInput}`}
                          type="number"
                          name="length"
                          value={String(service.length)}
                          onChange={(value) =>
                            onServiceChange(index, 'length', Number(value))
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
                          value={service.price}
                          onChange={(value) =>
                            onServiceChange(index, 'price', value)
                          }
                          placeholder="5"
                        />
                      </div>
                    </div>
                  </div>

                  <div className={s.serviceDown}>
                    {/* Новое поле: Описание */}
                    <ReactQuill
                      value={service.description?.[activeLang] || ''}
                      onChange={(value) => onServiceChange(index, 'description', value, activeLang)}
                      placeholder={t.service_description || 'Description'}
                      className={s.richText}
                    />

                  </div>
                  <Button
                    cancel
                    tiny
                    className={s.deleteServiceBtn}
                    onClick={() => onDeleteService(index)}
                  >
                    <span className={s.btnIcon}>X</span>
                    <span className={s.btnText}>{t.delete_service || 'Delete service'}</span>
                  </Button>

                </div>
              </div>


              {priceErrors[index] && (
                <div className={s.errorText}>{priceErrors[index]}</div>
              )}
            </React.Fragment>
          ))}
        </div>

      )}

      <Button className={s.addServiceBtn} onClick={onAddService}>
        + {t.add_service || 'Add Service'}
      </Button>
    </div>
  );
};

export default ServicesEditor;
