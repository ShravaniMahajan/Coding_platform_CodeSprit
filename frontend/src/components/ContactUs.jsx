import React, { useState } from "react";
import { Mail, MessageSquare, Send, Clock, CheckCircle2 } from "lucide-react";

function ContactUs() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setFormData({ name: "", email: "", message: "" });
        }, 3000);
      } else {
        const errText = await res.text();
        alert("Failed to send message: " + (errText || res.status));
      }
    } catch (err) {
      console.error(err);
      alert("Network error: " + err.message);
    }
  };

  const contactInfo = [
    { icon: Mail, title: "Email Support", value: "support@codesphere.com", color: "bg-blue-50 text-blue-600 border-blue-100" },
    { icon: MessageSquare, title: "Developer Discord", value: "Join community channel", color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
    { icon: Clock, title: "Response Window", value: "Within 24 hours guaranteed", color: "bg-sky-50 text-sky-600 border-sky-100" },
  ];

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-slate-100/90 via-slate-50/70 to-slate-100/90 border-t border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 space-y-3">
          <span className="inline-block px-3.5 py-1 text-xs font-extrabold tracking-widest uppercase text-blue-700 bg-blue-50 border border-blue-100 rounded-full shadow-xs">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Contact <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">Us</span>
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto text-base sm:text-lg font-medium leading-relaxed">
            Have questions, feature requests, or feedback? Reach out to our engineering team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Info cards */}
          <div className="lg:col-span-2 space-y-4">
            {contactInfo.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-center gap-4 p-5 rounded-2xl border border-slate-200 bg-white shadow-md hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5">
                  <div className={`w-12 h-12 rounded-2xl ${item.color} border flex items-center justify-center flex-shrink-0 shadow-xs`}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                    <p className="text-slate-600 text-xs sm:text-sm mt-0.5 font-medium">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-300/40 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder=""
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-100/70 text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all shadow-inner"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder=""
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-100/70 text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all shadow-inner"
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">Your Message</label>
              <textarea
                id="message"
                name="message"
                rows="4"
                placeholder=""
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-100/70 text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all shadow-inner resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 hover:-translate-y-0.5 transition-all duration-300"
            >
              {submitted ? (
                <span className="flex items-center gap-2 text-white">
                  <CheckCircle2 size={18} />
                  Message Sent Successfully!
                </span>
              ) : (
                <>
                  <span>Send Message</span>
                  <Send size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ContactUs;
