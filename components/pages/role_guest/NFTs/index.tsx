import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import Page from "@/components/shared/ui/Page/Page";
import Substrate from "@/components/shared/ui/Substrate/Substrate";

import s from './.module.scss';

import Head01 from '@/components/shared/assets/img/heads/003.webp';
import Head02 from '@/components/shared/assets/img/heads/004.webp';
import NFTFace from '@/components/shared/assets/img/image_2023-04-20_17-05-28.webp';


const NFTPage = () => {
    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const t = loadMessages(currentLocale);

    return (
        <Page data-testid="NFTPage">
            <div className={s.container}>
                <Substrate className={s.s1}>
                    <div className={s.main_text_wrap}>
                        <h1 className="h1">
                            <span className={s.title}>{t.types}</span>
                        </h1>
                        <h3 className={s.h3}>{t.types_title}</h3>
                        <a
                            className={s.jpgstore}
                            target="_blank"
                            href="https://www.jpg.store/collection/psytypes"
                            rel="noreferrer"
                        >
                            {t.jpg_store}
                        </a>
                    </div>
                    <Image className={s.vision_img} src={NFTFace} alt="img" loading="lazy"/>
                </Substrate>
                <Substrate className={s.utility_block}>
                    <h2 className={s.utility_title + ` ` + s.u_h}>{t.utility}</h2>
                    <div className={s.u_items}>
                        <div className={s.u_item + ` ` + s.u_row1}>
                            <span className={s.u_number}>1</span>
                            <div className={s.u_item_w}>
                                <h4 className={s.u_inner_title}>{t.utility_title_1}</h4>
                                <p className={s.utility_text}>{t.utility_text_1}</p>
                            </div>
                        </div>

                        <Image className={s.man_01} src={Head01} alt="img" loading="lazy"/>

                        <div className={s.u_item + ` ` + s.u_row2}>
                            <span className={s.u_number}>2</span>
                            <div className={s.u_item_w}>
                                <h4 className={s.u_inner_title}>{t.utility_title_2}</h4>
                                <div>
                                    <p className={s.utility_text}>{t.utility_text_2}</p>
                                    <a
                                        className={s.psy_session}
                                        target="_blank"
                                        href=""
                                        rel="noreferrer"
                                    >
                                        {t.utility_link}
                                    </a>
                                </div>
                            </div>
                        </div>

                        <Image className={s.man_02} src={Head02} alt="img" loading="lazy"/>
                    </div>
                </Substrate>
            </div>
        </Page>
    );
};

export default NFTPage;
