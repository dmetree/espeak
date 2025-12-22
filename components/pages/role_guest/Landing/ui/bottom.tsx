import Image from 'next/image';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { useRouter } from 'next/router';
import Button from '@/components/shared/ui/Button';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import earthIcon from '@/components/shared/assets/image_icons/earth.svg';
import s from './../landing.module.scss';
import { showModal } from '@/store/actions/modal';
import { EModalKind } from '@/components/shared/types/types';

const BottomCta = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const userUid = useSelector(({ user }) => user.uid);
  const currentLocale = useSelector(({ locale }) => locale.currentLocale);
  const router = useRouter();

  const t = loadMessages(currentLocale);

  const handleGetStarted = () => {
    if (userUid) router.push('/dashboard');
    else {
      dispatch(showModal(EModalKind.SignUp));
    }
  }

  return (
    <section className={s.bottomCta}>
      <div className={s.illustrationWrapper}>
        <Image
          src={earthIcon}
          alt="earth"
          className={s.illustration}
          width={400}
          height={250}
        />
      </div>

      <div className={s.content}>
        <h3>{t.landing_bottom.title}</h3>
        <p>{t.landing_bottom.text}</p>
        <Button variant="main" onClick={handleGetStarted}>
          {t.common.get_started}
        </Button>
      </div>
    </section>
  );
};

export default BottomCta;
