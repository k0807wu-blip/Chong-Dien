import Header from '@/components/Header';
import StickySocial from '@/components/StickySocial';
import { getSessionUser } from '@/lib/auth';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();

  return (
    <>
      <Header user={user} />
      {children}
      <StickySocial />
    </>
  );
}
