import PrivateRoute from '@/components/PrivateRoute';
import UserInfoPage from '@/components/pages/UserInfo';

export default function user_info_page() {
    return (
        <PrivateRoute>
            <UserInfoPage />
        </PrivateRoute>
    );
}
