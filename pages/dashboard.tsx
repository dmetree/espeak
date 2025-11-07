import Dashboard from "@/components/pages/Dashboard";
import PrivateRoute from '@/components/PrivateRoute';

export default function Dashboard_page() {
    return (
        <PrivateRoute>
            <Dashboard />
        </PrivateRoute>
    );
}
