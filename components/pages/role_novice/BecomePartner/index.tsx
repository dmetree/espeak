import React, { useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { loadMessages } from '@/components/shared/i18n/translationLoader';

import Page from "@/components/shared/ui/Page/Page";
import Substrate from "@/components/shared/ui/Substrate/Substrate";
import { HowToStart } from '@/components/pages/role_novice/BecomePartner/ui/HowToStart';
import { GenerateRefButton } from '@/components/pages/role_novice/BecomePartner/ui/GenerateRefButton';
import { ShareQR } from '@/components/pages/role_novice/BecomePartner/ui/ShareQR';
import { CopyLink } from '@/components/pages/role_novice/BecomePartner/ui/CopyLink';
import { HowItWorks } from '@/components/pages/role_novice/BecomePartner/ui/HowItWorks';

import s from "./.module.scss";

const BecomePartner = () => {
    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const t = loadMessages(currentLocale);
    const dispatch: AppDispatch = useDispatch<AppDispatch>();
    // const website = 'http://localhost:3000/'
    const website = 'https://mindhealer.cloud/'
    const userData = useSelector(({ user }) => user?.userData);
    const ergoWalletAddress = useSelector(({ networkErgo }) => networkErgo?.ergoWalletAddress[0]);

    const [refLink, setRefLink] = useState('');


    const createRefLink = async () => {

        if (userData?.partnerOne && ergoWalletAddress) {
            // console.log("Le one")
            const fullRefLink = encodeURIComponent(website + "?r1=" + ergoWalletAddress + "&r2=" + userData?.partnerOne);
            try {
                const response = await fetch(`https://tinyurl.com/api-create.php?url=${fullRefLink}`);
                const shortUrl = await response.text();
                setRefLink(shortUrl);
            } catch (error) {
                // console.error("Error shortening URL:", error);
                setRefLink(website + ergoWalletAddress);
            }
        }

        if (!userData?.partnerOne && ergoWalletAddress) {
            // console.log("nothing")
            const fullRefLink = encodeURIComponent(website + "?r1=" + ergoWalletAddress);
            try {
                const response = await fetch(`https://tinyurl.com/api-create.php?url=${fullRefLink}`);
                const shortUrl = await response.text();
                setRefLink(shortUrl);
            } catch (error) {
                console.error("Error shortening URL:", error);
                setRefLink(website + ergoWalletAddress);
            }
        }
    };

    return (
        <Page>
            <Substrate color="bg-color">
                <div className={s.partnerWrap}>
                    <div className={s.title}>
                        <h2 className={s.header}> {t.become_partner_h}</h2>

                        <div className={s.subHeader}>
                            {t.subheader}
                        </div>

                    </div>

                    <HowItWorks t={t} />
                    <HowToStart t={t} />

                    {/* If ergoWalletAddress does not exist set the button disabled*/}
                    <GenerateRefButton
                        disabled={!ergoWalletAddress}
                        onClick={createRefLink}
                        t={t}
                    />

                    {refLink && (
                        <div className={s.refMeterials}>
                            <ShareQR refLink={refLink} t={t} />
                            <CopyLink refLink={refLink} t={t} />
                        </div>
                    )}
                </div>
            </Substrate>
        </Page>
    )
}

export default BecomePartner;
