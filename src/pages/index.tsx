import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { api, type RouterOutputs } from "~/utils/api";

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

type PostViewPropsType = RouterOutputs["posts"]["getAll"][number];
const PostView = ({ post, author }: PostViewPropsType) => {
  return (
    <div key={post.id} className="flex gap-3 border-b border-slate-400 p-4">
      <Image
        src={author.profileImageUrl}
        alt="Profile image"
        className="h-14 w-14 rounded-full"
        width={56}
        height={56}
      />
      <div className="flex flex-col">
        <div className="flex gap-1 text-slate-300">
          <Link href={`/@${author.username}`}>
            <span>{`@${author.username}`}</span>
          </Link>
          <span>·</span>
          <Link href={`/post/${post.id}`}>
            <span>
              {formatDistanceToNow(post.createdAt, { addSuffix: true })}
            </span>
          </Link>
        </div>
        <span className="text-2xl">{post.content}</span>
      </div>
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
      <main className="flex h-screen justify-center">
        <div className="w-full border-x border-slate-400 md:max-w-2xl">
          <div className="border-b border-slate-400 p-4 ">
            <div className="flex justify-center">
              {!isSignedIn && <SignInButton />}
            </div>
            {isSignedIn && <CreatePostWizard />}
          </div>
          <Feed />
          {isSignedIn && <SignOutButton />}
        </div>
      </main>
    </>
  );
};

export default Home;
