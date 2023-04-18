import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import '~/styles/global.scss';
import 'ress/dist/ress.min.css';

export default function App({
  Component,
  pageProps: { session, ...pageProps }
}: AppProps) {
  return (
    <SessionProvider session={session as Session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
