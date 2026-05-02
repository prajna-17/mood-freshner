import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, Send } from "lucide-react";

export const metadata = {
  title: "Contact Us | MoodFresh",
  description: "Get in touch with MoodFresh for any queries, feedback, or business opportunities.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-10 font-['DM_Sans',sans-serif]">
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
            Get in <span className="text-orange-400">Touch</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-2xl mx-auto">
            We'd love to hear from you. Whether you have a question about our products, delivery, or just want to say hi!
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
        
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="flex flex-col lg:flex-row">
            
            {/* Contact Information */}
            <div className="lg:w-2/5 bg-gradient-to-br from-[#1a3a8a] to-[#0e2260] text-white p-10 lg:p-12">
              <h2 className="text-3xl font-bold mb-4">Contact Information</h2>
              <p className="text-blue-200 mb-10 leading-relaxed">
                Fill up the form and our team will get back to you within 24 hours.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0 border border-white/20">
                    <Phone size={20} className="text-orange-400" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold mb-1">Phone</h4>
                    <p className="text-blue-100">+91 98765 43210</p>
                    <p className="text-blue-100">+91 91234 56789</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0 border border-white/20">
                    <Mail size={20} className="text-orange-400" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold mb-1">Email</h4>
                    <p className="text-blue-100">hello@moodfresh.com</p>
                    <p className="text-blue-100">support@moodfresh.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0 border border-white/20">
                    <MapPin size={20} className="text-orange-400" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold mb-1">Our Farm</h4>
                    <p className="text-blue-100 leading-relaxed">
                      MoodFresh Dairy Farms,<br />
                      Green Valley Road, Near Hills,<br />
                      Punjab, India 144001
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Decorative circles */}
              <div className="mt-16 relative">
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
                <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-orange-400/20 rounded-full" />
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="lg:w-3/5 p-10 lg:p-12 bg-white">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Send us a Message</h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white text-gray-700">
                    <option value="">Select a subject...</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Order Support</option>
                    <option value="feedback">Feedback</option>
                    <option value="business">Business Opportunity</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea 
                    rows="4" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white resize-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                
                <button 
                  type="button" 
                  className="w-full sm:w-auto px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-0.5 flex items-center justify-center"
                >
                  <Send size={18} className="mr-2" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
