import Link from "next/link";
import s from "@/styles/general.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { loadMessages } from "@/components/shared/i18n/translationLoader";

export default function Error() {
    const dispatch: AppDispatch = useDispatch<AppDispatch>();
    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const t = loadMessages(currentLocale);

    return (
        <section className={s.customError}>
            <div className={s.container}>
                <div className={s.row}>
                    <div className={s.small}>
                        <div className={`${s.md} ${s.offset} ${s.textCenter}`}>
                            <div className={s.four_zero_four_bg}>
                                <h1 className={s.textCenter}>404</h1>
                            </div>

                            <div className={s.textBox}>
                                <h3 className={s.h2}>{t.lost}</h3>
                                <p>{t.not_available}</p>
                                <Link href="/" className={s.link_404}>{t.go_home}</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
