import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut
} from "@clerk/nextjs";
import { type AppType } from "next/app";
import { useRouter } from "next/router";
import "~/styles/globals.css";
import { api } from "~/utils/api";

const publicPages: string[] = [];

const MyApp: AppType = ({ Component, pageProps }) => {
  const { pathname } = useRouter();

  const isPublicPage = publicPages.includes(pathname);

  return (
    <ClerkProvider {...pageProps}>
      {isPublicPage ? (
        <Component {...pageProps} />
      ) : (
        <>
          <SignedIn>
            <Component {...pageProps} />
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </>
      )}
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
