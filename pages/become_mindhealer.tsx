
import PrivateRoute from '@/components/PrivateRoute';
import BecomeMindHealer from "@/components/pages/role_novice/BecomeMindhealer";


export default function become_mindhealer_page() {
    return (
        <PrivateRoute>
            <BecomeMindHealer />
        </PrivateRoute>
    );
}
