
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-white font-bangla">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">গোপনীয়তা নীতি</h1>
          
          <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
            <p className="text-lg text-gray-600 mb-8">
              NewsViewBD আপনার গোপনীয়তাকে অত্যন্ত গুরুত্ব দেয়। এই নীতিতে আমরা ব্যাখ্যা করেছি যে আমরা কীভাবে আপনার ব্যক্তিগত তথ্য সংগ্রহ, ব্যবহার এবং সুরক্ষিত রাখি।
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">তথ্য সংগ্রহ</h2>
            <p className="mb-6">
              আমরা নিম্নলিখিত ধরনের তথ্য সংগ্রহ করতে পারি:
            </p>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li>ব্যক্তিগত তথ্য (নাম, ইমেইল ঠিকানা, ফোন নম্বর)</li>
              <li>ওয়েবসাইট ব্যবহারের তথ্য (পৃষ্ঠা ভিজিট, ক্লিক, সময়কাল)</li>
              <li>প্রযুক্তিগত তথ্য (IP ঠিকানা, ব্রাউজার টাইপ, ডিভাইসের তথ্য)</li>
              <li>কুকিজ এবং অনুরূপ প্রযুক্তির মাধ্যমে প্রাপ্ত তথ্য</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">তথ্য ব্যবহার</h2>
            <p className="mb-6">
              আমরা আপনার তথ্য নিম্নলিখিত উদ্দেশ্যে ব্যবহার করি:
            </p>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li>আমাদের সেবা প্রদান এবং উন্নত করার জন্য</li>
              <li>আপনার সাথে যোগাযোগ স্থাপনের জন্য</li>
              <li>নিউজলেটার এবং আপডেট পাঠানোর জন্য</li>
              <li>ওয়েবসাইটের নিরাপত্তা বজায় রাখার জন্য</li>
              <li>আইনগত বাধ্যবাধকতা পূরণের জন্য</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">তথ্য শেয়ারিং</h2>
            <p className="mb-6">
              আমরা আপনার ব্যক্তিগত তথ্য তৃতীয় পক্ষের সাথে শেয়ার করি না, তবে নিম্নলিখিত ক্ষেত্রে ব্যতিক্রম:
            </p>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li>আপনার স্পষ্ট সম্মতি থাকলে</li>
              <li>আইনগত প্রয়োজনে</li>
              <li>আমাদের সেবা প্রদানকারী অংশীদারদের সাথে (শুধুমাত্র প্রয়োজনীয় তথ্য)</li>
              <li>আমাদের অধিকার এবং সম্পত্তি রক্ষার জন্য</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">কুকিজ</h2>
            <p className="mb-6">
              আমাদের ওয়েবসাইট কুকিজ ব্যবহার করে আপনার ব্রাউজিং অভিজ্ঞতা উন্নত করতে। আপনি চাইলে আপনার ব্রাউজার সেটিংস থেকে কুকিজ নিষ্ক্রিয় করতে পারেন, তবে এটি ওয়েবসাইটের কিছু ফিচার প্রভাবিত করতে পারে।
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">তথ্য নিরাপত্তা</h2>
            <p className="mb-6">
              আমরা আপনার ব্যক্তিগত তথ্যের নিরাপত্তার জন্য যথাযথ প্রযুক্তিগত এবং সাংগঠনিক ব্যবস্থা গ্রহণ করেছি। তবে, ইন্টারনেটে কোনো তথ্য আদান-প্রদান ১০০% নিরাপদ নয় বলে আমরা নিশ্চয়তা দিতে পারি না।
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">আপনার অধিকার</h2>
            <p className="mb-6">
              আপনার নিম্নলিখিত অধিকার রয়েছে:
            </p>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li>আপনার ব্যক্তিগত তথ্য দেখার অধিকার</li>
              <li>ভুল তথ্য সংশোধনের অধিকার</li>
              <li>আপনার তথ্য মুছে ফেলার অধিকার</li>
              <li>তথ্য প্রক্রিয়াকরণে আপত্তি জানানোর অধিকার</li>
              <li>আপনার তথ্য অন্যত্র স্থানান্তরের অধিকার</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">শিশুদের গোপনীয়তা</h2>
            <p className="mb-6">
              আমাদের সেবা ১৩ বছরের কম বয়সী শিশুদের জন্য নয়। আমরা জানতে পারলে যে ১৩ বছরের কম বয়সী কোনো শিশুর তথ্য সংগ্রহ করেছি, আমরা তা অবিলম্বে মুছে ফেলব।
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">নীতি পরিবর্তন</h2>
            <p className="mb-6">
              আমরা সময়ে সময়ে এই গোপনীয়তা নীতি আপডেট করতে পারি। গুরুত্বপূর্ণ কোনো পরিবর্তন হলে আমরা আপনাকে ইমেইলের মাধ্যমে বা ওয়েবসাইটে নোটিশের মাধ্যমে জানাব।
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">যোগাযোগ</h2>
            <p>
              এই গোপনীয়তা নীতি সম্পর্কে কোনো প্রশ্ন থাকলে আমাদের সাথে যোগাযোগ করুন:
              <br />
              ইমেইল: privacy@newsviewbd.com
              <br />
              ফোন: +৮৮০ ১২৩ৄ ৫৬৭৮৯০
            </p>

            <p className="text-sm text-gray-500 mt-8">
              সর্বশেষ আপডেট: ২৭ মে, ২০২৪
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
