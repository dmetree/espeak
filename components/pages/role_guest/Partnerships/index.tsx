import React from 'react'
import Image from 'next/image';

import { useDispatch, useSelector } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import Page from "@/components/shared/ui/Page/Page";
import Substrate from "@/components/shared/ui/Substrate/Substrate";
import s from './.module.scss';

import Diagram from '@/components/shared/assets/img/diagram.webp';
import FaceImg from '@/components/shared/assets/img/image_2023-04-20_17-05-28.webp';

const Partnerships = () => {
    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const t = loadMessages(currentLocale);
    return (
        <Page data-testid="PartnershipPage">
            <div className={s.container}>
                <Substrate className={s.s1}>
                    <div className={s.main_text_wrap}>
                        <h1 className="h1">
                            <span className={s.title}>{t.partnership}</span>
                        </h1>
                        <h3 className={s.h3}>{t.partnership_text}</h3>
                    </div>
                    <Image className={s.vision_img} src={FaceImg} alt="faceImg" loading="lazy"/>
                </Substrate>

                <Substrate className={s.utility_block}>
                    <h2 className={s.utility_title + ` `}>{t.partnership_utility}</h2>
                    <div className={s.u_items}>
                        <div className={s.u_item + ` ` + s.u_row1}>
                            <div className={s.u_item_w}>
                                <h3 className={s.u_inner_title}>{t.partnership_utility_title}</h3>
                                <p className={s.utility_text}>{t.partnership_utility_text_1}</p>
                                <p className={s.utility_text}>{t.partnership_utility_text_2}</p>
                                <p className={s.utility_text}>{t.partnership_utility_text_3}</p>
                                <p className={s.utility_text}>{t.partnership_utility_text_4}</p>
                                <p className={s.utility_text}>{t.partnership_utility_text_5}</p>

                                <p className={s.utility_text}>{t.recommended_collection}</p>
                                <p className={s.utility_text}>{t.recommended_price}</p>
                                <a
                                    className={s.btn_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        window.open('https://twitter.com/psyWORKshop', '_blank');
                                    }}
                                >
                                    <button className={s.main_button}>{t.dm_for_details}</button>
                                </a>
                            </div>
                        </div>

                        <div className={s.diagram_wrapper}>
                            <h2 className={s.utility_title + ` ` + s.u_h}>{t.infinite_life_cycle}</h2>
                            <h4 className={s.d_inner_title}>{t.circulation_diagram}</h4>
                            <Image className={s.diagram} src={Diagram} alt="Diagram" loading="lazy"/>
                        </div>
                    </div>
                </Substrate>
            </div>
        </Page>
    )
}

export default Partnerships
