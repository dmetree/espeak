
import PrivateRoute from '@/components/PrivateRoute';
import NoviceAppointments from "@/components/pages/role_novice/MyAppointmentsList";


export default function novice_appointments() {
    return (
        <PrivateRoute>
            <NoviceAppointments />
        </PrivateRoute>
    );
}
