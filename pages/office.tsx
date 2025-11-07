import Office from "@/components/pages/role_spec/Office";
import PrivateRoute from '@/components/PrivateRoute';

export default function Office_page() {
    return (
        <PrivateRoute>
            <Office />
        </PrivateRoute>
    );
}
