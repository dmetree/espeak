import NewsFeed from "@/components/pages/NewsFeed";
import PrivateRoute from "@/components/PrivateRoute";

export default function NewsFeed_page() {
  return (
    <PrivateRoute>
      <NewsFeed />
    </PrivateRoute>
  );
}
