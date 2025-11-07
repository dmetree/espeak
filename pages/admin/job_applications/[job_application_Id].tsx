
import { JobApplicationItem } from "@/components/pages/admin/JobApplications/ui/ApplicationItem"
import PrivateRoute from '@/components/PrivateRoute';

export default function JobApplicationItem_page() {
    return (
        <PrivateRoute>
            <JobApplicationItem />
        </PrivateRoute>
    );
}