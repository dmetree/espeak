
import CreateSpec from "@/components/pages/admin/CreateSpec"
import PrivateRoute from '@/components/PrivateRoute';

export default function CreateSpec_page() {
    return (
        <PrivateRoute>
            <CreateSpec />
        </PrivateRoute>
    );
}