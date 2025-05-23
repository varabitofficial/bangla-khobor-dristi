
import { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Here we would typically submit to an API
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => {
        setIsSubscribed(false);
      }, 5000);
    }
  };

  return (
    <section className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">আপডেট থাকুন</h2>
          <p className="text-gray-300 mb-8">
            আমাদের নিউজলেটারে সাবস্ক্রাইব করে দৈনিক সংবাদ আপডেট ও ব্রেকিং নিউজ সরাসরি আপনার ইনবক্সে পান।
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="আপনার ইমেইল"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-300"
            >
              সাবস্ক্রাইব করুন
            </button>
          </form>

          {isSubscribed && (
            <div className="mt-4 text-green-400 animate-fade-in">
              ধন্যবাদ! আপনি সফলভাবে সাবস্ক্রাইব করেছেন।
            </div>
          )}

          <p className="mt-4 text-xs text-gray-400">
            সাবস্ক্রাইব করে আপনি আমাদের <a href="/privacy" className="underline">গোপনীয়তা নীতি</a> এবং <a href="/terms" className="underline">সেবার শর্তাবলী</a> মেনে নিচ্ছেন।
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
