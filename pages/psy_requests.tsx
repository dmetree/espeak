
import PrivateRoute from '@/components/PrivateRoute';
import PsyRequest from "@/components/pages/role_spec/PsyRequest";


export default function PsyRequest_page() {
    return (
        <PrivateRoute>
            <PsyRequest />
        </PrivateRoute>

    );
}
