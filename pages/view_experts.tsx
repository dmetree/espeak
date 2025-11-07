import ViewExperts from "@/components/pages/ViewExperts";
import PrivateRoute from '@/components/PrivateRoute';

export default function Dashboard_page() {
    return (
        <PrivateRoute>
            <ViewExperts />
        </PrivateRoute>
    );
}
