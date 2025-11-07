import Image from 'next/image';
import { useRouter } from "next/router";
import { useDispatch, useSelector } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import Page from "@/components/shared/ui/Page/Page";
import Substrate from "@/components/shared/ui/Substrate/Substrate";
import Button from "@/components/shared/ui/Button";

import s from './.module.scss';


const Psychologist = () => {
    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const userUid = useSelector(({ user }) => user.uid);

    const t = loadMessages(currentLocale);

    const router = useRouter();

    const handleClick = () => {
        router.replace('/sign_in')
    };

    const features = [
        { title: t.psychologist_feature_1_title, content: t.psychologist_feature_1 },
        { title: t.psychologist_feature_2_title, content: t.psychologist_feature_2 },
        { title: t.psychologist_feature_3_title, content: t.psychologist_feature_3 },
        { title: t.psychologist_feature_4_title, content: t.psychologist_feature_4 },
        { title: t.psychologist_feature_5_title, content: t.psychologist_feature_5 },
        { title: t.psychologist_feature_6_title, content: t.psychologist_feature_6 },
        { title: t.psychologist_feature_7_title, content: t.psychologist_feature_7 },
        { title: t.psychologist_feature_8_title, content: t.psychologist_feature_8 },
        { title: t.psychologist_feature_9_title, content: t.psychologist_feature_9 },
        { title: t.psychologist_feature_10_title, content: t.psychologist_feature_10 },
        { title: t.psychologist_feature_11_title, content: t.psychologist_feature_11 },
    ];

    return (
        <Page>
            <Substrate color="transparent">
                <div className={s.titleWrapper}>
                    <h1 className={s.header}>{t.psychologist_title}</h1>
                    <div className={s.subHeader}>{t.psychologist_text}</div>
                </div>

                <div className={s.psyItemsWrapper}>
                    {features.map((feature, index) => (
                        <div className={`${s.psyItem} ${index % 2 === 0 ? s.evenMargin : ''}`} key={index}>
                            <div className={s.itemTitle}>{feature.title}</div>
                            <p className="">{feature.content}</p>
                        </div>
                    ))}
                </div>
                {!userUid &&
                    <Button onClick={handleClick}>{t.create_account}</Button>
                }
            </Substrate>
        </Page>
    )
}

export default Psychologist;
