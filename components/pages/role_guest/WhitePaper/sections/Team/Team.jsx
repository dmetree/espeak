import { useTranslation } from 'react-i18next';

import Team1 from '@/shared/assets/img/team/team_1.webp';
import Team2 from '@/shared/assets/img/team/team_2.webp';

import s from './Team.module.css';

const socialIconsMap = {
  linkedin: (
    <svg
      className={s.socialIcon}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="33"
      height="33"
    >
      <path
        id="Path_2525"
        d="M23.002,21.584h0.227l-0.435-0.658l0,0c0.266,0,0.407-0.169,0.409-0.376c0-0.008,0-0.017-0.001-0.025   c0-0.282-0.17-0.417-0.519-0.417h-0.564v1.476h0.212v-0.643h0.261L23.002,21.584z M22.577,20.774h-0.246v-0.499h0.312   c0.161,0,0.345,0.026,0.345,0.237c0,0.242-0.186,0.262-0.412,0.262"
      />
      <path
        id="Path_2520"
        d="M17.291,19.073h-3.007v-4.709c0-1.123-0.02-2.568-1.564-2.568c-1.566,0-1.806,1.223-1.806,2.487v4.79H7.908   V9.389h2.887v1.323h0.04c0.589-1.006,1.683-1.607,2.848-1.564c3.048,0,3.609,2.005,3.609,4.612L17.291,19.073z M4.515,8.065   c-0.964,0-1.745-0.781-1.745-1.745c0-0.964,0.781-1.745,1.745-1.745c0.964,0,1.745,0.781,1.745,1.745   C6.26,7.284,5.479,8.065,4.515,8.065L4.515,8.065 M6.018,19.073h-3.01V9.389h3.01V19.073z M18.79,1.783H1.497   C0.68,1.774,0.01,2.429,0,3.246V20.61c0.01,0.818,0.68,1.473,1.497,1.464H18.79c0.819,0.01,1.492-0.645,1.503-1.464V3.245   c-0.012-0.819-0.685-1.474-1.503-1.463"
      />
      <path
        id="Path_2526"
        d="M22.603,19.451c-0.764,0.007-1.378,0.633-1.37,1.397c0.007,0.764,0.633,1.378,1.397,1.37   c0.764-0.007,1.378-0.633,1.37-1.397c-0.007-0.754-0.617-1.363-1.37-1.37H22.603 M22.635,22.059   c-0.67,0.011-1.254-0.522-1.265-1.192c-0.011-0.67,0.523-1.222,1.193-1.233c0.67-0.011,1.222,0.523,1.233,1.193   c0,0.007,0,0.013,0,0.02C23.81,21.502,23.29,22.045,22.635,22.059h-0.031"
      />
    </svg>
  ),
  twitter: (
    <svg
      className={s.socialIcon}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="28"
      height="28"
    >
      <polygon points="6.861 6.159 15.737 17.764 17.097 17.764 8.322 6.159 6.861 6.159" />
      <path d="m0,0v24h24V0H0Zm15.063,19.232l-3.87-5.055-4.422,5.055h-2.458l5.733-6.554-6.046-7.91h5.062l3.494,4.621,4.043-4.621h2.455l-5.361,6.126,6.307,8.337h-4.937Z" />
    </svg>
  ),
};

const Team = () => {
  const { t } = useTranslation();

  const teamMap = [
    {
      name: `${t('team1')}`,
      image: Team1,
      role: `${t('role1')}`,
      linkedin: 'link',
      twitter: 'link',
      text: `${t('teamtext1')}`,
    },
    {
      name: `${t('team2')}`,
      image: Team2,
      role: `${t('role2')}`,
      linkedin: 'link',
      twitter: 'link',
      text: `${t('teamtext2')}`,
    },
  ];
  return (
    <div className={s.section}>
      <h1 className={s.title}>{t('team')}</h1>
      <div className={s.teamWrap}>
        {teamMap.map((member) => (
          <div key={member.name} className={s.wrap}>
            <hr className={s.hr} />
            <div className={s.infoWrap}>
              <h2 className={s.name}>{member.name}</h2>
              <h3 className={s.role}>{member.role}</h3>
            </div>
            <img className={s.img} src={member.image} alt={member.name} />
            <p className={s.text}>{member.text}</p>
            <div className={s.socialWrap}>
              {member.linkedin ? (
                <a className={s.social} href={member.linkedin}>
                  {socialIconsMap.linkedin}
                  <span className="visuallyHidden">Linkedin link</span>
                </a>
              ) : null}
              {member.twitter ? (
                <a className={s.social} href={member.twitter}>
                  {socialIconsMap.twitter}
                  <span className="visuallyHidden">Twitter link</span>
                </a>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
