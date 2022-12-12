import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "web3uikit";
import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <MoralisProvider initializeOnMount={false}>
      <SessionProvider session={session}>
        <NotificationProvider>
          <Component {...pageProps} />
        </NotificationProvider>
      </SessionProvider>
    </MoralisProvider>
  );
}

export default MyApp;
