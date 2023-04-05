import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { type RouterOutputs } from "~/utils/api";

type PostViewPropsType = RouterOutputs["posts"]["getAll"][number];
export const PostView = ({ post, author }: PostViewPropsType) => {
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