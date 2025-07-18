// app/(admin)/admin/layout.tsx
import ProtectedAdmin from '@/components/ProtectedAdmin';

export default function Layout({ children }: { children: React.ReactNode }) {
    return <ProtectedAdmin>{children}</ProtectedAdmin>;
}