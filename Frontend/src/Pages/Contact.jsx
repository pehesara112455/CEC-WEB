import React from 'react';
import Header from '../Components/Navbar';
import Footer from '../Components/Footer';

const Contact = () => {
  const handlePaymentReceipt = () => {
    window.location.href = "mailto:cecntc13@gmail.com?subject=Payment Receipt Inquiry";
  };

  const handleDonationReceipt = () => {
    window.location.href = "mailto:cecntc13@gmail.com?subject=Donation Receipt Inquiry";
  };

  const handleCallNow = () => {
    window.location.href = "tel:+940112789459";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow pt-0 pb-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-[#8B0000] via-[#A52A2A] to-[#D4A017] text-white py-16 px-6 mt-0">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4">GET IN TOUCH</h1>
            <p className="text-xl mb-6">
              Ready to discuss your event? We are here to help you plan the perfect occasion
            </p>
            <button 
              onClick={handleCallNow}
              className="bg-white text-[#8B0000] font-bold py-3 px-10 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              CALL NOW
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column - Receipt Boxes & Contact Info */}
            <div className="space-y-8">
              
              {/* Payment Receipts Box */}
              <div 
                onClick={handlePaymentReceipt}
                className="bg-gradient-to-r from-[#F4D03F] to-[#F9E79F] rounded-xl p-6 shadow-lg border-l-4 border-[#8B0000] cursor-pointer hover:shadow-xl hover:scale-105 transition-all"
              >
                <h3 className="text-2xl font-bold text-[#8B0000] mb-3 flex items-center gap-2">
                  Payment Receipts Sending ➤
                </h3>
                <p className="text-gray-800 text-sm leading-relaxed">
                  Please find attached the receipt for the advance payment made. 
                  This confirms that we have received the amount as agreed.
                </p>
              </div>

              {/* Donation Receipts Box */}
              <div 
                onClick={handleDonationReceipt}
                className="bg-gradient-to-r from-[#F4D03F] to-[#F9E79F] rounded-xl p-6 shadow-lg border-l-4 border-[#8B0000] cursor-pointer hover:shadow-xl hover:scale-105 transition-all"
              >
                <h3 className="text-2xl font-bold text-[#8B0000] mb-3 flex items-center gap-2">
                  Donation Receipts Sending ➤
                </h3>
                <p className="text-gray-800 text-sm leading-relaxed">
                  Support us by donating for our upcoming projects
                </p>
              </div>

              {/* Contact Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Location */}
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow text-center">
                  <div className="w-16 h-16 bg-[#8B0000] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    No.117, Thalahena,<br/>Malabe, Sri Lanka
                  </p>
                </div>

                {/* Email */}
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow text-center">
                  <div className="w-16 h-16 bg-[#8B0000] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    cec@sitnet.lk<br/>cecntc13@gmail.com
                  </p>
                </div>

                {/* Phone */}
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow text-center">
                  <div className="w-16 h-16 bg-[#8B0000] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    0112 789 459<br/>0777 666 272
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Map & Business Hours */}
            <div className="space-y-8">
              
              {/* Google Map */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.898736355891!2d79.9726!3d6.9147!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNTQnNTMuMCJOIDc5wrA1OCcyMS40IkU!5e0!3m2!1sen!2slk!4v1620000000000!5m2!1sen!2slk"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="CEC Location"
                ></iframe>
              </div>

              {/* Business Hours */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-[#8B0000] rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Business Hours</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-700 font-semibold">Monday - Saturday</span>
                    <span className="text-[#8B0000] font-bold">8:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">Sunday</span>
                    <span className="text-gray-500 font-bold">Holiday</span>
                  </div>
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

export default Contact;