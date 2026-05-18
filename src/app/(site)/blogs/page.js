import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, User } from "lucide-react";
import { API } from "@/utils/api";

export const metadata = {
  title: "Blogs | MoodFresh",
  description: "Read our latest articles on dairy, health, and sustainable farming.",
};

async function getBlogs() {
  try {
    const res = await fetch(`${API}/blogs?status=PUBLISHED`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.statusCode === 200 ? json.data : [];
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    return [];
  }
}

export default async function BlogsPage() {
  const blogs = await getBlogs();

  // Pick the first blog as the featured post (if exists)
  const featuredBlog = blogs.length > 0 ? blogs[0] : null;
  const regularBlogs = blogs.length > 1 ? blogs.slice(1) : [];

  return (
    <div className="min-h-screen bg-gray-50 pb-4 font-['DM_Sans',sans-serif]">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0c1a4c] via-[#1a3a8a] to-[#0e2260] text-white pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute top-20 -right-20 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center z-10">
          <Link href="/" className="inline-flex items-center text-blue-200 hover:text-white transition-colors mb-6 text-sm font-medium">
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            The MoodFresh <span className="text-orange-400">Journal</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-2xl mx-auto">
            Insights, health tips, and stories from our farm. Discover the world of pure dairy.
          </p>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto text-gray-50 fill-current">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,42.7C1120,32,1280,32,1360,32L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" />
          </svg>
        </div>
      </section>

      {/* ── Main Content ── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        
        {blogs.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center text-gray-500 border border-gray-100">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">No Articles Yet</h2>
            <p>Check back soon for insights and updates from MoodFresh!</p>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featuredBlog && (
              <div className="bg-white rounded-3xl shadow-xl p-4 md:p-6 mb-16 flex flex-col md:flex-row gap-8 group cursor-pointer hover:shadow-2xl transition-shadow border border-gray-100">
                <div className="md:w-1/2 relative h-64 md:h-[400px] rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center">
                  {featuredBlog.images && featuredBlog.images.length > 0 ? (
                    <Image 
                      src={featuredBlog.images[0]} 
                      alt={featuredBlog.title} 
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <Image 
                      src="https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80" 
                      alt="Featured Post Placeholder" 
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                    Featured
                  </div>
                </div>
                <div className="md:w-1/2 flex flex-col justify-center px-4 md:px-8 pb-4 md:pb-0">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center"><Calendar size={14} className="mr-1" /> {new Date(featuredBlog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    <span className="flex items-center"><User size={14} className="mr-1" /> {featuredBlog.author || "Admin"}</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 group-hover:text-blue-700 transition-colors line-clamp-2">
                    {featuredBlog.title}
                  </h2>
                  <p className="text-gray-600 mb-8 leading-relaxed text-lg line-clamp-3">
                    {featuredBlog.content}
                  </p>
                  <div className="inline-flex items-center text-blue-600 font-semibold text-lg group-hover:text-blue-800 transition-colors mt-auto">
                    Read Article <ArrowRight size={20} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            )}

            {/* Blog Grid */}
            {regularBlogs.length > 0 && (
              <>
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Articles</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularBlogs.map((blog) => (
                    <div key={blog._id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100 group flex flex-col">
                      <div className="relative h-56 w-full overflow-hidden bg-gray-100 flex items-center justify-center">
                        {blog.images && blog.images.length > 0 ? (
                          <Image 
                            src={blog.images[0]} 
                            alt={blog.title} 
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <Image 
                            src="https://images.unsplash.com/photo-1596733430284-f7437764b1a9?auto=format&fit=crop&q=80" 
                            alt="Placeholder" 
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        )}
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <span className="flex items-center"><Calendar size={12} className="mr-1" /> {new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                          <span className="flex items-center"><User size={12} className="mr-1" /> {blog.author || "Admin"}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors line-clamp-2">
                          {blog.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-6 flex-grow line-clamp-3">
                          {blog.content}
                        </p>
                        <div className="inline-flex items-center text-orange-600 font-medium text-sm group-hover:text-orange-700 transition-colors mt-auto">
                          Read More <ArrowRight size={16} className="ml-1 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

      </main>
    </div>
  );
}
