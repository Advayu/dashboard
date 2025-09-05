"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, loading, router]);

    // if (loading) {
    //     return <div>Loading...</div>;
    // }

    return isAuthenticated ? <>{children}</> : null;
}