import React from 'react';
import { useTranslations } from 'next-intl';

export default function HelpPage() {
  const t = useTranslations('Help');

  const faqs = [
    {
      question: "What is Eventeev?",
      answer: "Eventeev is a comprehensive event management platform designed to streamline the planning, organization, and execution of events."
    },
    {
      question: "How do I create an event?",
      answer: "You can create an event by navigating to the dashboard and clicking on the 'Create Event' button. Fill out the required details and publish."
    },
    {
      question: "Can I manage attendees?",
      answer: "Yes, Eventeev provides powerful tools to manage guest lists, send invitations, and track RSVPs in real-time."
    },
    {
      question: "Is there a mobile app?",
      answer: "We offer a fully responsive web experience, and a dedicated mobile app for on-the-go event management."
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Hero Section */}
      <section className="relative w-full h-[40vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
            How can we help?
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Find answers to common questions and learn more about how Eventeev can make your next event a success.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-12 gap-12">
        
        {/* About Eventeev Section */}
        <div className="md:col-span-5 space-y-6">
          <div className="sticky top-24">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-6">About Eventeev</h2>
            <div className="bg-white dark:bg-neutral-800 p-8 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-700">
              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6">
                Eventeev was born out of a simple idea: bringing people together should be seamless and stress-free. Whether you're organizing a small corporate meetup or a massive multi-day conference, our tools empower you to focus on what truly matters—the experience.
              </p>
              <ul className="space-y-4">
                {[
                  "End-to-end event management",
                  "Real-time analytics and reporting",
                  "Seamless ticketing and registration",
                  "Interactive attendee engagement"
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center text-neutral-700 dark:text-neutral-200">
                    <svg className="w-5 h-5 text-indigo-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Contact Information Section */}
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mt-10 mb-6">Contact Us</h2>
            <div className="bg-white dark:bg-neutral-800 p-8 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-700">
              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6">
                Still have questions? Feel free to reach out to our team directly. We are always happy to help!
              </p>
              <ul className="space-y-4">
                <li className="flex items-center text-neutral-700 dark:text-neutral-200">
                  <svg className="w-5 h-5 text-indigo-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <span><strong>WhatsApp:</strong> +2347032951044</span>
                </li>
                <li className="flex items-center text-neutral-700 dark:text-neutral-200">
                  <svg className="w-5 h-5 text-indigo-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span><strong>Email:</strong> weareeventeev@gmail.com</span>
                </li>
                <li className="flex items-center text-neutral-700 dark:text-neutral-200">
                  <svg className="w-5 h-5 text-indigo-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                  <span><strong>Social Media:</strong> @weareeventeev</span>
                </li>
              </ul>
            </div>
            
            {/* Download the App Section */}
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mt-10 mb-6">Get the App</h2>
            <div className="bg-white dark:bg-neutral-800 p-8 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-700">
              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6">
                Take Eventeev wherever you go. Manage your events and attendees right from your phone.
              </p>
              <div className="flex flex-col xl:flex-row gap-3">
                <a href="#" className="flex-1 flex items-center justify-center bg-black dark:bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-white rounded-xl px-4 py-3 transition-colors">
                  <svg className="w-7 h-7 mr-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.19 2.31-.88 3.5-.8 1.56.09 2.76.65 3.5 1.76-3.05 1.76-2.52 5.56.46 6.78-.75 1.95-1.74 3.65-2.54 4.43zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.36-1.87 4.39-3.74 4.25z"/>
                  </svg>
                  <div className="text-left flex-1">
                    <div className="text-[10px] leading-tight text-neutral-300">Download on the</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </a>
                <a href="#" className="flex-1 flex items-center justify-center bg-black dark:bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-white rounded-xl px-4 py-3 transition-colors">
                  <svg className="w-7 h-7 mr-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4.3 2.5C4 2.8 3.9 3.2 3.9 3.8v16.4c0 .6.1 1 .4 1.3l.1.1 9.2-9.2v-.2L4.4 2.4l-.1.1zm9.9 9.5l3.1 3.1-12.8 7.3c-.6.3-1.2 0-1.4-.4l11.1-10zm.1-.2L4.1 2.2c.2-.4.8-.7 1.4-.4l12.8 7.3-4 2.7zm4.3 2.5l-4-2.7v.4l4 2.7c.6.4.6 1 0 1.4l-4 2.7v-.4l4-2.7c.6-.4.6-1 0-1.4z"/>
                  </svg>
                  <div className="text-left flex-1">
                    <div className="text-[10px] leading-tight text-neutral-300">GET IT ON</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="md:col-span-7">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-6">Frequently Asked Questions</h2>
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-6 space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="group border-b border-neutral-100 dark:border-neutral-700 pb-4 last:border-0 last:pb-0">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-lg text-neutral-900 dark:text-neutral-50 py-2">
                  {faq.question}
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <p className="text-neutral-600 dark:text-neutral-400 mt-3 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
