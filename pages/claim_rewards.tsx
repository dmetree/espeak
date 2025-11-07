import ClaimRewards from "@/components/pages/role_spec/ClaimRewards";
import PrivateRoute from '@/components/PrivateRoute';

export default function ClaimRewards_page() {
    return (
        <PrivateRoute>
            <ClaimRewards />
        </PrivateRoute>
    );
}
