
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Target, Users, TrendingUp, Globe } from "lucide-react";

const Advertise = () => {
  const adPackages = [
    {
      name: "ব্যানার বিজ্ঞাপন",
      price: "৫০,০০০ টাকা/মাস",
      features: [
        "হোমপেজে প্রিমিয়াম স্থান",
        "৭২৮x৯০ পিক্সেল ব্যানার",
        "মাসিক ১০ লক্ষ+ ভিউ",
        "টার্গেটেড অডিয়েন্স"
      ]
    },
    {
      name: "স্পন্সরড কন্টেন্ট",
      price: "১,০০,০০০ টাকা/পোস্ট",
      features: [
        "নেটিভ বিজ্ঞাপন ফরম্যাট",
        "সোশ্যাল মিডিয়া প্রমোশন",
        "SEO অপটিমাইজেশন",
        "ব্র্যান্ড মেনশন"
      ]
    },
    {
      name: "ভিডিও বিজ্ঞাপন",
      price: "২,০০,০০০ টাকা/মাস",
      features: [
        "প্রি-রোল ভিডিও বিজ্ঞাপন",
        "৩০ সেকেন্ড পর্যন্ত",
        "হাই কোয়ালিটি প্লেসমেন্ট",
        "ডিটেইলড অ্যানালিটিক্স"
      ]
    }
  ];

  const stats = [
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      number: "৫০ লক্ষ+",
      label: "মাসিক ভিজিটর"
    },
    {
      icon: <Globe className="w-8 h-8 text-blue-600" />,
      number: "২০০+",
      label: "দেশ থেকে ভিজিটর"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-blue-600" />,
      number: "৯৫%",
      label: "বাংলাদেশি ভিজিটর"
    },
    {
      icon: <Target className="w-8 h-8 text-blue-600" />,
      number: "৭৫%",
      label: "রিটার্নিং ভিজিটর"
    }
  ];

  return (
    <div className="min-h-screen bg-white font-bangla">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">বিজ্ঞাপন দিন</h1>
          
          <div className="text-center mb-12">
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              NewsViewBD-তে বিজ্ঞাপন দিয়ে লক্ষ লক্ষ পাঠকের কাছে পৌঁছান। 
              আমাদের প্ল্যাটফর্মে আপনার ব্র্যান্ডের জন্য সঠিক অডিয়েন্স খুঁজে পাবেন।
            </p>
          </div>

          {/* Statistics */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">আমাদের পরিসংখ্যান</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Ad Packages */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">বিজ্ঞাপন প্যাকেজ</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {adPackages.map((pkg, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{pkg.name}</h3>
                  <div className="text-2xl font-bold text-blue-600 mb-6">{pkg.price}</div>
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    বুক করুন
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Why Advertise With Us */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">কেন আমাদের সাথে বিজ্ঞাপন দেবেন?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">বিশ্বস্ত প্ল্যাটফর্ম</h3>
                <p className="text-gray-700 mb-6">
                  NewsViewBD একটি নির্ভরযোগ্য এবং বিশ্বস্ত সংবাদ প্ল্যাটফর্ম। আমাদের পাঠকরা আমাদের উপর আস্থা রাখেন এবং নিয়মিত আমাদের ওয়েবসাইট ভিজিট করেন।
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">টার্গেটেড অডিয়েন্স</h3>
                <p className="text-gray-700 mb-6">
                  আমাদের পাঠকরা শিক্ষিত, সচেতন এবং ক্রয়ক্ষমতা সম্পন্ন। আপনার পণ্য বা সেবার জন্য সঠিক ক্রেতা আমাদের প্ল্যাটফর্মে পাবেন।
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">পেশাদার সেবা</h3>
                <p className="text-gray-700 mb-6">
                  আমাদের অভিজ্ঞ টিম আপনার বিজ্ঞাপনের জন্য সর্বোত্তম ফলাফল নিশ্চিত করতে কাজ করে। ক্রিয়েটিভ ডিজাইন থেকে শুরু করে ক্যাম্পেইন ম্যানেজমেন্ট - সব কিছুই আমরা করি।
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">প্রতিযোগিতামূলক মূল্য</h3>
                <p className="text-gray-700 mb-6">
                  আমাদের বিজ্ঞাপনের মূল্য অত্যন্ত প্রতিযোগিতামূলক এবং আপনার বাজেটের মধ্যে। সর্বোচ্চ ROI নিশ্চিত করতে আমরা প্রতিশ্রুতিবদ্ধ।
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">যোগাযোগ করুন</h2>
            <div className="max-w-2xl mx-auto">
              <p className="text-center text-gray-600 mb-8">
                আপনার বিজ্ঞাপনের প্রয়োজন নিয়ে আমাদের সাথে যোগাযোগ করুন। আমাদের টিম আপনাকে সর্বোত্তম সমাধান প্রদান করবে।
              </p>
              <div className="text-center space-y-4">
                <div>
                  <strong>ইমেইল:</strong> ads@newsviewbd.com
                </div>
                <div>
                  <strong>ফোন:</strong> +৮৮০ ১২৩৪ ৫৬১২৩৪
                </div>
                <div>
                  <strong>অফিস সময়:</strong> সোমবার - শুক্রবার, ৯:০০ - ১৮:০০
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Advertise;
