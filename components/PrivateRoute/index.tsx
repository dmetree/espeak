import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const PrivateRoute = ({ children }) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Retrieve uid and email from localStorage
        const uid = localStorage.getItem("userUid");
        const email = localStorage.getItem("userEmail");

        // Update isAuthenticated state based on localStorage data
        if (uid && email) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }

        // Redirect to login if not authenticated
        if (!uid || !email) {
            router.replace('/login');
        }
    }, [router]);

    if (!isAuthenticated) return null; // or a loading spinner

    return children;
};

export default PrivateRoute;
