import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { PostView } from "~/components/PostView";
import { PageLayout } from "~/components/layout";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { api } from "~/utils/api";

const CreatePostWizard = () => {
  const [input, setInput] = useState("");
  const { user } = useUser();
  const ctx = api.useContext();
  const { mutate, isLoading: isPostMutationLoading } =
    api.posts.create.useMutation({
      onSuccess: () => {
        setInput("");
        void ctx.posts.getAll.invalidate();
      },
      onError: (err) => {
        const errorMessage = err.data?.zodError?.fieldErrors.content;
        if (errorMessage && errorMessage[0]) toast.error(errorMessage[0]);
        else toast.error("Something went wrong");
      },
    });

  if (!user) return null;

  return (
    <div className="flex w-full gap-3">
      <Image
        src={user.profileImageUrl}
        alt="Profile image"
        className="h-14 w-14 rounded-full"
        width={56}
        height={56}
      />
      <input
        placeholder="Type some emojis"
        className="grow bg-transparent outline-none"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (!input) return;
            mutate({ content: input });
          }
        }}
        type="text"
        disabled={isPostMutationLoading}
      />
      {input && (
        <button onClick={() => mutate({ content: input })}>Post</button>
      )}

      {isPostMutationLoading && (
        <div className="flex items-center justify-center">
          <LoadingSpinner size={20} />
        </div>
      )}
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: isLoadingPosts } = api.posts.getAll.useQuery();

  if (isLoadingPosts) return <LoadingPage />;
  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="flex flex-col">
      {data?.map(({ post, author }) => (
        <PostView post={post} author={author} key={post.id} />
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  const { isLoaded: userIsLoaded, isSignedIn } = useUser();

  //Start fetching ASAP so that react query cache's the data
  api.posts.getAll.useQuery();

  //return empty div if user isnt loaded
  if (!userIsLoaded) return <div />;

  return (
    <>
      <PageLayout>
        <div className="flex border-b border-slate-400 p-4 ">
          {!isSignedIn && (
            <div className="flex justify-center">
              <SignInButton />
            </div>
          )}

          {isSignedIn && <CreatePostWizard />}
        </div>
        <Feed />
        {isSignedIn && <SignOutButton />}
      </PageLayout>
    </>
  );
};

export default Home;
