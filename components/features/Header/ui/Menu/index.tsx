import s from './.module.scss';
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { EUserRole } from '@/components/shared/types/types';
import { MenuItem } from '@/components/shared/types/types';
import { loadMessages } from '@/components/shared/i18n/translationLoader';


const Menu = ({ menuItems, userRole }: { menuItems: MenuItem[]; userRole: string }) => {
    const router = useRouter();
    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const t = loadMessages(currentLocale);

    const specProfilePage = router.pathname.startsWith('/specialist-profile');


    const filteredMenuItems = menuItems.filter(item => {
        if (userRole === EUserRole.Novice) {
            return item?.userRole === EUserRole.Novice || item?.userRole === 'none';
        }
        if (userRole === EUserRole.Specialist) {
            return item?.userRole === EUserRole.Specialist || item?.userRole === 'none';
        }
        return true;
    }).filter(item => {
        // If on the specialist profile page and the menu item title is "Book Session", exclude it.
        return !(specProfilePage && item.title === t.book_session);
    });

    return (
        <div className={s.wrapper}>
            {filteredMenuItems.map((item, index) => {
                const shouldHide = (userRole === EUserRole.Specialist && item?.userRole === EUserRole.Novice) ||
                    (userRole === EUserRole.Novice && item?.userRole === EUserRole.Specialist);

                return (
                    <div
                        key={index}
                        className={`${s.item} ${shouldHide ? s.hidden : ''}`}
                        onClick={item.clickEvent}
                    >

                        <div>{item.title}</div>
                        {item?.icon && <div className={s.icon}>{item.icon}</div>}
                    </div>
                );
            })}
        </div>
    );
};

export default Menu;
