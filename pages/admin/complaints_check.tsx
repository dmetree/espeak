
import { ComplaintsCheck } from "@/components/pages/admin/Complaints"
import PrivateRoute from '@/components/PrivateRoute';

export default function ComplaintsCheck_page() {
    return (
        <PrivateRoute>
            <ComplaintsCheck />
        </PrivateRoute>
    );
}