import { useState } from "react";
//types
import type { Route } from "./+types"
import type { PostMeta } from "~/types";
//components
import PostCard from "~/components/PostCard";
import Pagination from "~/components/Pagination";


export async function loader({request}: Route.LoaderArgs):Promise<{posts: PostMeta[]}> {
  const url = new URL('/posts-meta.json', request.url);
  const res = await fetch(url.href);

  if (!res.ok) throw new Error('Failed to fetch data');

  const data = await res.json();

  data.sort((a: PostMeta,b: PostMeta) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime(); 
  })

  return {posts: data};
}

const BlogPage = ({loaderData}: Route.ComponentProps) => {

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const {posts} = loaderData;

  const totalPages = Math.ceil(posts.length/postsPerPage);
  const lastIndex = postsPerPage * currentPage;
  const firstIndex = lastIndex - postsPerPage;

  const currentPosts = posts.slice(firstIndex, lastIndex);

  return (
    <div className='mx-auto max-w-3xl mt-10 px-6 py-6 bg-gray-900'>
        <h2 className='text-3xl text-white font-bold mb-8'>📝 Blog</h2>
        {currentPosts.map((post) => (
         <PostCard key={post.slug} post={post} />
        ))}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
    </div>
  )
}

export default BlogPage