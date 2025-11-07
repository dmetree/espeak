import React from 'react'
import { useRouter } from "next/router";

import { EModalKind, IJobRequestStatus } from '@/components/shared/types';
import { useDispatch, useSelector } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import Page from "@/components/shared/ui/Page/Page";
import Substrate from "@/components/shared/ui/Substrate/Substrate";
import Button from '@/components/shared/ui/Button';

import { showModal, hideModal, toggleModal } from '@/store/actions/modal'; // Assuming actions are in this file

import s from './.module.css';
import Link from 'next/link';

const BecomeMindHealer = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const t = loadMessages(currentLocale);

    const ergoWalletConnected = useSelector(({ networkErgo }) => networkErgo.ergoWalletConnected);

    const userUid = useSelector(({ user }) => user.uid);
    const userData = useSelector(({ user }) => user?.userData);

    const handleSubmitApplication = () => {
        dispatch(showModal(EModalKind.PsyworkerApplication));
    };

    const goToRanks = () => {

    }

    return (
        <Page>
            <Substrate color="bg-color">
                <h2 className={s.header}>{t.become_psyworker}</h2>
                <div className={s.content}>
                    <h4 className={s.header}>{t.become_psyworker_text_1}</h4>
                    {userData?.jobRequest === IJobRequestStatus.None && <div className={s.text}>{t.become_psyworker_text_2}</div>}
                    {userData?.jobRequest === IJobRequestStatus.Pending && <div className={s.done}>{t.process_initiated}</div>}
                    {userData?.jobRequest === IJobRequestStatus.Accepted && <div className={s.done}>{t.application_accepted}</div>}


                    {(userData?.jobRequest === IJobRequestStatus.None || userData?.jobRequest === IJobRequestStatus.Declined) &&
                        <Button
                            disabled={!ergoWalletConnected}
                            className={s.button}
                            onClick={handleSubmitApplication}>
                            {ergoWalletConnected ? (
                                (t.submit_application)
                            ) : (
                                <div className={s.tooltipWrapper}>
                                    <div className={s.tooltip}>
                                        {t.no_submit_connect_wallet}
                                    </div>
                                </div>
                            )}
                        </Button>

                    }
                    <hr />
                    <div className={s.item}>
                        <span className={s.pending}>ToDo&nbsp;</span>
                        {t.become_psyworker_todo_0_01}
                        &nbsp;<Link href="https://chromewebstore.google.com/detail/nautilus-wallet/gjlmehlldlphhljhpnlddaodbjjcchai">{t.download_nautilus_two}</Link>


                    </div>
                    <div className={s.item}>
                        <span className={s.pending}>ToDo&nbsp;</span>
                        {t.become_psyworker_todo_0_02}
                        &nbsp;<Link href="https://chromewebstore.google.com/detail/nautilus-wallet/gjlmehlldlphhljhpnlddaodbjjcchai">{t.become_psyworker_todo_0_03}</Link>


                    </div>
                    <div className={s.item}>
                        {userData?.jobRequest === IJobRequestStatus.None && <span className={s.pending}>ToDo&nbsp;</span>}
                        {userData?.jobRequest === IJobRequestStatus.Pending && <span className={s.done}>Done&nbsp;</span>}
                        {userData?.jobRequest === IJobRequestStatus.Accepted && <div className={s.done}>Approved&nbsp;</div>}

                        {t.become_psyworker_todo_1}
                    </div>
                    <div className={s.item}><span className={s.pending}>ToDo</span> {t.become_psyworker_todo_2}</div>
                    <div className={s.item}><span className={s.pending}>ToDo</span> {t.become_psyworker_todo_3}</div>
                    <hr />
                    <div className={s.text}>{t.become_psyworker_todo_4} <Link href={"https://mindhealer.cloud/ranks/"}>{t.psy_ranks}</Link></div>
                </div>
            </Substrate>
        </Page>
    )
}

export default BecomeMindHealer
