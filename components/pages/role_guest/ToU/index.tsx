import React from 'react';
import { useSelector } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import Page from "@/components/shared/ui/Page/Page";
import Substrate from "@/components/shared/ui/Substrate/Substrate";
import s from './.module.scss';

const ToU = () => {
    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const t = loadMessages(currentLocale);

    return (
        <Page>
            <Substrate color="bg-color" className={s.wrapper}>
                <h2 className={s.header}>{t.terms_of_use}</h2>
                <div className={s._item}>
                    <h3>{t.use_of_mindhealer_title}</h3>
                    <p>{t.use_of_mindhealer_text}</p>

                    <h3>{t.translations_title}</h3>
                    <p>{t.translations_text}</p>

                    <h3>{t.risks_title}</h3>
                    <p>{t.risks_intro}</p>
                    <ul>
                        <li>{t.risk_1}</li>
                        <li>{t.risk_2}</li>
                        <li>{t.risk_3}</li>
                        <li>{t.risk_4}</li>
                        <li>{t.risk_5}</li>
                    </ul>

                    <h3>{t.investment_risks_title}</h3>
                    <p>{t.investment_risks_text}</p>

                    <h3>{t.tax_compliance_title}</h3>
                    <p>{t.tax_compliance_text}</p>

                    <h3>{t.app_storage_title}</h3>
                    <p>{t.app_storage_text}</p>

                    <h3>{t.no_warranties_title}</h3>
                    <p>{t.no_warranties_text}</p>

                    <h3>{t.limitation_of_liability_title}</h3>
                    <p>{t.limitation_of_liability_text}</p>

                    <h3>{t.arbitration_title}</h3>
                    <p>{t.arbitration_text}</p>
                </div>
            </Substrate>
        </Page>
    );
};

export default ToU;
