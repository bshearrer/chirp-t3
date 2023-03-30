import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { type AppType } from "next/app";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";
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
            <Toaster position="bottom-center" />
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
