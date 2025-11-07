
import PrivateRoute from '@/components/PrivateRoute';
import Profile from "@/components/pages/role_novice/EditProfile/index";


export default function profile_page() {
    return (
        <PrivateRoute>
            <Profile />
        </PrivateRoute>
    );
}
