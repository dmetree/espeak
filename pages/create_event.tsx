import CreateEvent from "@/components/pages/role_spec/CreateEvent";
import PrivateRoute from '@/components/PrivateRoute';

export default function CreateEvent_page() {
    return (
        <PrivateRoute>
            <CreateEvent />
        </PrivateRoute>
    );
}
