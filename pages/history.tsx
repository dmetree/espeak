import TransactionHistory from "@/components/pages/TransactionHistory";
import PrivateRoute from '@/components/PrivateRoute';

export default function HistoryPage() {
    return (
        <PrivateRoute>
            <TransactionHistory />
        </PrivateRoute>
    );
}

