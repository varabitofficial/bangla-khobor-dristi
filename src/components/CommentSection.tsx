
import { useState } from "react";
import { User } from "lucide-react";

const CommentSection = ({ postId }: { postId: string }) => {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Mock comments data - would come from Supabase later
  const comments = [
    {
      id: "c1",
      user: "আরিফ হাসান",
      avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=40&h=40&fit=crop",
      date: "২৩ মে, ২০২৪",
      time: "১০:৩০ পূর্বাহ্ন",
      text: "এই বিলটি সম্পর্কে আমার মনে হয় আরও আলোচনার প্রয়োজন। বিশেষ করে শিক্ষার মানোন্নয়ন সম্পর্কিত অংশটি বেশ গুরুত্বপূর্ণ।"
    },
    {
      id: "c2",
      user: "মিজান ওমর",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
      date: "২২ মে, ২০২৪",
      time: "৪:১৫ অপরাহ্ন",
      text: "আমি মনে করি এই বিলটি যদিও অনেক ভালো দিক আছে, কিন্তু এটি বাস্তবায়নের জন্য পর্যাপ্ত বাজেট প্রয়োজন হবে।"
    },
    {
      id: "c3",
      user: "বিনা পাটেল",
      avatar: "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?w=40&h=40&fit=crop",
      date: "২১ মে, ২০২৪",
      time: "৬:২৫ অপরাহ্ন",
      text: "খুব ভালো আলোচনা হয়েছে। আমি আশা করি এই বিলের মাধ্যমে শিক্ষার মান উন্নত হবে।"
    }
  ];

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        setComment("");
        setIsSubmitting(false);
        // Would save to Supabase in a real implementation
        console.log("Comment submitted:", comment);
      }, 1000);
    }
  };

  return (
    <section className="mt-12 pt-8 border-t border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-6">মন্তব্য ({comments.length})</h3>

      {/* Comment Form */}
      <div className="mb-8">
        <form onSubmit={handleSubmitComment}>
          <div className="mb-4">
            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="আপনার মন্তব্য লিখুন..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 bg-blue-600 text-white rounded-lg transition-colors ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "পাঠানো হচ্ছে..." : "মন্তব্য করুন"}
            </button>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img 
                  src={comment.avatar} 
                  alt={comment.user}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex-grow">
              <div className="flex gap-2 items-center mb-1">
                <h4 className="font-medium text-gray-900">{comment.user}</h4>
                <span className="text-xs text-gray-500">
                  {comment.date}, {comment.time}
                </span>
              </div>

              <div className="text-gray-800">
                <p>{comment.text}</p>
              </div>

              <div className="mt-2">
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  উত্তর দিন
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CommentSection;
