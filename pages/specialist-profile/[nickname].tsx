import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import SpecialistProfile from '@/components/pages/SpecialistProfile';

export default function SpecialistProfilePage() {
    const router = useRouter();

    // Show a loading state for fallback pages
    if (router.isFallback) {
        return <div>Loading...</div>;
    }

    return <SpecialistProfile />;
}

export const getStaticPaths: GetStaticPaths = async () => {
    // Use placeholder nicknames as provided
    const nicknames = ['anastasia_astro', 'therapist777', 'baskakov54', 'Demyan'];

    const paths = nicknames.map((nickname) => ({
        params: { nickname },
    }));

    return {
        paths,
        fallback: true, // Enable client-side rendering for unknown nicknames
    };
};

export const getStaticProps: GetStaticProps = async () => {
    // Return empty props since SpecialistProfile handles data client-side
    return {
        props: {},
    };
};