import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import MDSpinner from 'react-md-spinner';
import styles from '~/styles/index.module.scss';
import { fetcher } from '~/utils/fetcher';

export default function Page() {
  const session = useSession();
  const router = useRouter();
  const [isLoadingApi, setIsLoading] = useState(false);
  const { data, mutate, isLoading } = useSWR<{ code?: string }>(
    session.status === 'authenticated' ? '/api/web/invite' : undefined,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false
    }
  );

  const handleCreate = useCallback(() => {
    void (async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/web/invite', {
          method: 'POST'
        });
        if (!res.ok) {
          throw new Error(await res.text());
        }

        await mutate();
      } catch (e) {
        console.error(e);
        alert('エラーが発生しました: ' + (e as Error).message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [mutate]);

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      void router.push('/api/auth/signin');
    }
  }, [session, router]);

  if (session.status !== 'authenticated' || isLoading || isLoadingApi) {
    return (
      <div className={styles.container}>
        <MDSpinner size={48} singleColor="#e33636" />
      </div>
    );
  }

  if (data?.code) {
    return (
      <div className={styles.container}>
        <h4>あなたの招待コード:</h4>
        <pre>{data.code}</pre>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button
        className={styles.button}
        onClick={handleCreate}
        disabled={isLoadingApi}
      >
        招待コードを作成
      </button>
    </div>
  );
}
