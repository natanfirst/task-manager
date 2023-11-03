
import Loading from '@/components/ui/loading';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';

const AuthCheck = ({ children }: {children: ReactNode}) => {
  const { data: session, status } = useSession();
  const pathname = usePathname()
  const router = useRouter();

  if (!session && pathname !== '/' && status !== 'loading') {
    router.push('/');
    return null;
  }

  if(status === 'loading') {
    return <Loading />
  }

  return children;
};

export default AuthCheck;