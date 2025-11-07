
import { JobApplications } from "@/components/pages/admin/JobApplications"
import PrivateRoute from '@/components/PrivateRoute';

export default function JobApplications_page() {
    return (
        <PrivateRoute>
            <JobApplications />
        </PrivateRoute>
    );
}