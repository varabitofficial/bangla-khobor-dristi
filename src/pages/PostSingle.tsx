
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import CommentSection from "@/components/CommentSection";
import RelatedNews from "@/components/RelatedNews";
import { Calendar, Clock, User } from "lucide-react";

const PostSingle = () => {
  const { id } = useParams();

  // Mock post data - this would come from Supabase later
  const post = {
    id: id || "1",
    title: "সংসদে নতুন শিক্ষা বিল নিয়ে বিতর্ক",
    content: `
      <p class="mb-4">একটি নতুন শিক্ষা বিল নিয়ে আজ সংসদে ব্যাপক বিতর্ক হয়েছে। এই বিলটি দেশের শিক্ষা ব্যবস্থায় আমূল পরিবর্তন আনতে পারে।</p>
      
      <p class="mb-4">"শিক্ষা আমাদের ভবিষ্যতের ভিত্তি। এই বিলের মাধ্যমে আমরা একটি আধুনিক এবং যুগোপযোগী শিক্ষা ব্যবস্থা গড়ে তুলতে চাই," বলেছেন শিক্ষামন্ত্রী।</p>

      <h3 class="text-xl font-semibold mb-3 mt-6">বিলের মূল বিষয়সমূহ</h3>
      <p class="mb-4">এই বিলের মধ্যে রয়েছে:</p>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li>প্রাথমিক শিক্ষার মান উন্নয়ন</li>
        <li>উচ্চশিক্ষায় গবেষণার সুবিধা বৃদ্ধি</li>
        <li>প্রযুক্তিগত শিক্ষার আধুনিকীকরণ</li>
        <li>শিক্ষক প্রশিক্ষণ কর্মসূচি সম্প্রসারণ</li>
      </ul>

      <h3 class="text-xl font-semibold mb-3 mt-6">বিরোধী দলের অবস্থান</h3>
      <p class="mb-4">বিরোধী দলের সদস্যরা এই বিলের কিছু ধারা নিয়ে প্রশ্ন তুলেছেন। তারা মনে করেন, এই বিল বাস্তবায়নের জন্য পর্যাপ্ত বাজেট বরাদ্দের প্রয়োজন।</p>

      <p class="mb-4">আগামী সপ্তাহে এই বিল নিয়ে আরও আলোচনা হবে বলে জানানো হয়েছে।</p>
    `,
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&h=400&fit=crop",
    category: "রাজনীতি",
    author: "আহমেদ হাসান",
    date: "২৩ মে, ২০২৪",
    readTime: "৫ মিনিট"
  };

  return (
    <div className="min-h-screen bg-white font-bangla">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-600 mb-6">
            <Link to="/" className="hover:text-black">হোম</Link>
            <span className="mx-2">/</span>
            <span className="text-black">{post.category}</span>
          </nav>

          {/* Article Header */}
          <article className="bg-white">
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-red-600 text-white px-3 py-1 text-sm font-medium">
                  {post.category}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 border-b border-gray-200 pb-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime} পড়ার সময়</span>
                </div>
              </div>
            </header>

            {/* Featured Image */}
            <div className="mb-8">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-[400px] object-cover rounded-lg"
              />
            </div>

            {/* Article Content */}
            <div 
              className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Mid-content Ad */}
            <div className="my-12">
              <AdBanner />
            </div>

            {/* Article Footer */}
            <footer className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">ট্যাগ:</span>
                {['শিক্ষা', 'সংসদ', 'রাজনীতি', 'বিল'].map((tag) => (
                  <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 text-sm rounded hover:bg-gray-200 cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
            </footer>
          </article>

          {/* Comments Section */}
          <CommentSection postId={post.id} />

          {/* Post-comments Ad */}
          <div className="my-12">
            <AdBanner />
          </div>

          {/* Related News */}
          <RelatedNews category={post.category} currentPostId={post.id} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PostSingle;
