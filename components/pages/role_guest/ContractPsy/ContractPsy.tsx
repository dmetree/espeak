import React from 'react'
import Image from 'next/image';

import { useDispatch, useSelector } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import Page from "@/components/shared/ui/Page/Page";
import Substrate from "@/components/shared/ui/Substrate/Substrate";

import s from './.module.scss';
import BookingFlow from '@/components/pages/role_guest/ContractPsy/BookingFlow';

const ContractPsy = () => {
    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const t = loadMessages(currentLocale);

    return (
        <Page >
            <Substrate color="bg-color">
                <div className={s.wrapper}>

                    <div className={s.psy_contract_item}>
                        {/* <h2 className={s.psy_contract_header}>{t.psy_contract_structure}</h2>
                        <ul>
                            <li className={s.psy_contract_elem}>{t.general_el_01}</li>
                            <li className={s.psy_contract_elem}>{t.general_el_02}</li>
                            <li className={s.psy_contract_elem}>{t.general_el_03}</li>
                            <li className={s.psy_contract_elem}>{t.general_el_04}</li>
                            <li className={s.psy_contract_elem}>{t.general_el_05}</li>
                            <li className={s.psy_contract_elem}>{t.general_el_06}</li>
                            <li className={s.psy_contract_elem}>{t.general_el_07}</li>
                            <li className={s.psy_contract_elem}>{t.general_el_08}</li>
                            <li className={s.psy_contract_elem}>{t.general_el_09}</li>
                        </ul> */}

                        <BookingFlow />

                        <h2 className={s.header}>{t.psy_contract}</h2>
                        <h2>{t.psychologist_}</h2>
                        <h3>{t.psychologist_responsibilities}</h3>
                        <ul>
                            <li>{t.psy_resp_el_00}</li>
                            <li>{t.psy_resp_el_01}</li>
                            <li>{t.psy_resp_el_02}</li>
                            <li>{t.psy_resp_el_03}</li>
                            <li>{t.psy_resp_el_04}</li>
                            <li>{t.psy_resp_el_05}</li>
                            <li>{t.psy_resp_el_06}</li>
                            <li>{t.psy_resp_el_07}</li>
                            <li>{t.psy_resp_el_08}</li>
                        </ul>

                        <h3>{t.psychologist_not_resp}</h3>
                        <ul>
                            <li>{t.psy_not_resp_el_01}</li>
                            <li>{t.psy_not_resp_el_02}</li>
                            <li>{t.psy_not_resp_el_03}</li>
                            <li>{t.psy_not_resp_el_04}</li>
                        </ul>

                        <h3>{t.psy_rights}</h3>
                        <ul>
                            <li>{t.psy_rights_el_01}</li>
                            <li>{t.psy_rights_el_02}</li>
                            {/* <li>{t.psy_rights_el_03}</li> */}
                            <li>{t.psy_rights_el_04}</li>
                            <li>{t.psy_rights_el_05}</li>
                        </ul>

                        <h2>{t.client}</h2>
                        <h3>{t.clients_resp}</h3>
                        <ul>
                            <li>{t.client_resp_el_01}</li>
                            <li>{t.client_resp_el_02}</li>
                            <li>{t.client_resp_el_03}</li>
                            <li>{t.client_resp_el_04}</li>
                            <li>{t.client_resp_el_05}</li>
                            <li>{t.client_resp_el_06}</li>
                            <li>{t.client_resp_el_07}</li>
                        </ul>

                        <h3>{t.client_resp_to_psy}</h3>
                        <ul>
                            <li>{t.client_resp_to_psy_el_01}</li>
                            <li>{t.client_resp_to_psy_el_02}</li>
                            <li>{t.client_resp_to_psy_el_03}</li>
                            <li>{t.client_resp_to_psy_el_04}</li>
                            {/* <li>{t('client_resp_to_psy_el_05')}</li> */}
                            {/* <li>{t('client_resp_to_psy_el_06')}</li> */}
                            <li>{t.client_resp_to_psy_el_07}</li>
                            <li>{t.client_resp_to_psy_el_08}</li>
                        </ul>

                        {/* <h3>{t.client_rights}</h3>
                        <ul>
                            <li>{t.client_rights_el_01}</li>
                            <li>{t.client_rights_el_02}</li>
                            <li>{t.client_rights_el_03}</li>
                            <li>{t.client_rights_el_04}</li>
                        </ul> */}
                    </div>
                </div>
            </Substrate>
        </Page>
    )
}

export default ContractPsy
