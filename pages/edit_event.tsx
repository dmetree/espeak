import EditEvent from "@/components/pages/role_spec/EditEvent";
import PrivateRoute from '@/components/PrivateRoute';

export default function CreateEvent_page() {
    return (
        <PrivateRoute>
            <EditEvent />
        </PrivateRoute>
    );
}
