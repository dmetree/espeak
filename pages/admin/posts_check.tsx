
import { PostCheck } from "@/components/pages/admin/PostsCheck"
import PrivateRoute from '@/components/PrivateRoute';

export default function PostsCheck_page() {
    return (
        <PrivateRoute>
            <PostCheck />
        </PrivateRoute>
    );
}