"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useSelector } from 'react-redux';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const isAuth = useSelector((state: any) => state.brandUser.isAuthenticated);
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();
    useEffect(() => {
        if (!isAuth) {
            router.push('/login');
        }
    }, [router, isAuth]);



    return isAuth ? <>{children}</> : null;
}