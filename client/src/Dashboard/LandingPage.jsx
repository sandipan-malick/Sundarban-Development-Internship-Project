import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaHome,
  FaCompass,
  FaUsers,
  FaListUl,
  FaEnvelope,
  FaMapMarkerAlt,
  FaSignOutAlt,
  FaAddressCard
} from "react-icons/fa";
import api from "../utils/axios";

const texts = {
  en: {
    intro: "Sundarban Eco-tourism is dedicated to preserving nature and empowering local communities through sustainable tourism.",
    modules: [
      "Eco Tourism",
      "Community Stories",
      "Local Wildlife",
      "Conservation Efforts",
      "Visitor Information",
    ],
    heroTitle: "Welcome to Sundarban Eco-tourism",
    heroSubtitle: "Experience nature, humanity, and conservation like never before",
    exploreBtn: "Explore Tours",
    joinBtn: "Join the Community",
    languageSwitch: "EN / BN",
    footerLang: "Language: English / বাংলা",
    addressBtn: "My Addresses",
    logoutBtn: "Logout",
    contactNumber: "7364853753",
    projectTeam: "Sundorbon Development College Project Team",
  },
  bn: {
    intro: "সুন্দরবন ইকো-ট্যুরিজম প্রকৃতি সংরক্ষণ এবং টেকসই পর্যটনের মাধ্যমে স্থানীয় সম্প্রদায়কে ক্ষমতায়িত করার জন্য নিবেদিত।",
    modules: [
      "ইকো-ট্যুরিজম প্যাকেজসমূহ",
      "সম্প্রদায়ের গল্প",
      "স্থানীয় বন্যজীবন",
      "সংরক্ষণ প্রচেষ্টা",
      "ভ্রমণ তথ্য",
    ],
    heroTitle: "সুন্দরবনে ইকো-ট্যুরিজমে স্বাগতম",
    heroSubtitle: "প্রকৃতি, মানবতা এবং সংরক্ষণ উপভোগ করুন",
    exploreBtn: "পর্যটন অনুসন্ধান করুন",
    joinBtn: "সম্প্রদায়ে যোগ দিন",
    languageSwitch: "BN / EN",
    footerLang: "ভাষা: বাংলা / English",
    addressBtn: "আমার ঠিকানাসমূহ",
    logoutBtn: "লগআউট",
    contactNumber: "7364853753",
    projectTeam: "সুন্দরবন ডেভেলপমেন্ট কলেজ প্রকল্প টিম",
  },
};

export default function LandingPage() {
  const [language, setLanguage] = useState("en");
  const [showContact, setShowContact] = useState(false);
  const t = texts[language];
  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      await api.get("/");
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("https://sundarban-development-internship-project.onrender.com/api/user/logout", {}, { withCredentials: true });
      window.location.reload();
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Failed to logout. Try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gradient-to-b from-green-50 to-green-100">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between p-4 shadow-md bg-forest-green text-cream">
        <div className="flex items-center gap-2 font-serif text-2xl font-bold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-earthy-brown"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
          </svg>
          Sundarban Eco-tourism
        </div>

        {/* Mobile Logout (top header, visible only on small devices) */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 px-3 py-1 text-white bg-red-600 rounded-lg hover:bg-red-700 md:hidden"
        >
          <FaSignOutAlt /> {t.logoutBtn}
        </button>

        {/* Desktop Nav */}
        <nav className="items-center hidden space-x-4 text-lg md:flex">
          <Link to="/" className="transition hover:text-earthy-brown">{language === "en" ? "Home" : "হোম"}</Link>
          <Link to="/ecoTourism" className="transition hover:text-earthy-brown">{language === "en" ? "Explore" : "এক্সপ্লোর"}</Link>
          <Link to="/education" className="transition hover:text-earthy-brown">{language === "en" ? "Community" : "সম্প্রদায়"}</Link>
          <Link to="/all-data" className="transition hover:text-earthy-brown">{language === "en" ? "Activities" : "কার্যক্রম"}</Link>

          {/* Contact Button */}
          <button
            onClick={() => setShowContact(!showContact)}
            className="flex items-center gap-1 px-3 py-1 text-white bg-orange-500 rounded-lg hover:bg-orange-600"
          >
            <FaEnvelope /> {language === "en" ? "Contact" : "যোগাযোগ"}
          </button>

          {/* Address Button */}
          <Link to="/address" className="flex items-center gap-1 px-3 py-1 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            <FaMapMarkerAlt /> {t.addressBtn}
          </Link>

          {/* Logout Button (desktop only) */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-3 py-1 text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            <FaSignOutAlt /> {t.logoutBtn}
          </button>

          {/* Language Switch */}
          <button
            onClick={() => setLanguage(language === "en" ? "bn" : "en")}
            className="px-3 py-1 ml-2 transition rounded bg-earthy-brown hover:bg-forest-green"
          >
            {t.languageSwitch}
          </button>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center p-12 text-center text-black sm:p-20">
        <div className="absolute inset-0 bg-black/40 rounded-xl" />
        <img
          src="https://images.unsplash.com/photo-1549300461-11c5b94e8855?q=80&w=1170&auto=format&fit=crop"
          alt="Sundarban"
          className="absolute inset-0 object-cover w-full h-full rounded-xl"
        />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <h1 className="font-serif text-3xl font-bold text-white sm:text-5xl">{t.heroTitle}</h1>
          <p className="max-w-xl text-lg text-white sm:text-xl">{t.heroSubtitle}</p>
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
            <button className="px-6 py-3 font-semibold transition rounded shadow-lg text-cream bg-earthy-brown hover:bg-forest-green hover:scale-105">
              {t.exploreBtn}
            </button>
            <button className="px-6 py-3 font-semibold transition rounded shadow-lg text-cream bg-forest-green hover:bg-earthy-brown hover:scale-105">
              {t.joinBtn}
            </button>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="max-w-4xl p-8 mx-auto text-center text-forest-green sm:p-12">
        <h2 className="mb-6 font-serif text-2xl font-semibold sm:text-3xl">
          {language === "en" ? "About Sundarban Eco-tourism" : "সুন্দরবন ইকো-ট্যুরিজম সম্পর্কে"}
        </h2>
        <p className="mb-4 text-base sm:text-lg">{t.intro}</p>
      </section>

      {/* Modules */}
      <section className="grid max-w-6xl grid-cols-1 gap-8 p-8 mx-auto text-center sm:grid-cols-2 md:grid-cols-3">
        {t.modules.map((module) => (
          <p
            key={module}
            to={"/" + module.toLowerCase().replace(/\s+/g, "-")}
            className="p-6 transition bg-white rounded shadow-lg cursor-pointer hover:shadow-2xl text-forest-green hover:scale-105"
          >
            <h3 className="mb-2 text-xl font-semibold">{module}</h3>
            <p className="text-sm">
              {language === "en"
                ? `Discover more about ${module.toLowerCase()}.`
                : `আরও জানুন ${module.toLowerCase()}.`}
            </p>
          </p>
        ))}
      </section>

      {/* Contact Info Reveal */}
      {showContact && (
        <div className="fixed z-50 p-6 transform -translate-x-1/2 bg-white rounded-lg shadow-2xl top-24 left-1/2 text-forest-green">
          <p className="text-lg font-semibold">{t.contactNumber}</p>
          <p className="mt-1 text-sm">{t.projectTeam}</p>
          <button
            onClick={() => setShowContact(false)}
            className="px-3 py-1 mt-3 text-white bg-red-500 rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="hidden p-6 mt-auto text-center bg-earthy-brown text-cream md:block">
        <div>Contact us: info@sundarbaneco.com | Follow us on social media</div>
        <button
          onClick={() => setLanguage(language === "en" ? "bn" : "en")}
          className="mt-2 underline transition hover:text-forest-green"
        >
          {language === "en" ? "Language: English / বাংলা" : "ভাষা: বাংলা / English"}
        </button>
        <div className="mt-4 text-sm">&copy; 2025 Sundarban Eco-tourism Community</div>
      </footer>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 flex justify-around p-2 shadow-inner bg-forest-green text-cream md:hidden">
        <Link to="/" className="flex flex-col items-center text-sm"><FaHome className="mb-1 text-lg" />{language === "en" ? "Home" : "হোম"}</Link>
        <Link to="/ecoTourism" className="flex flex-col items-center text-sm"><FaCompass className="mb-1 text-lg" />{language === "en" ? "Explore" : "এক্সপ্লোর"}</Link>
        <Link to="/education" className="flex flex-col items-center text-sm"><FaUsers className="mb-1 text-lg" />{language === "en" ? "Community" : "সম্প্রদায়"}</Link>
        <Link to="/all-data" className="flex flex-col items-center text-sm"><FaListUl className="mb-1 text-lg" />{language === "en" ? "Activities" : "কার্যক্রম"}</Link>
        <Link to="/address" className="flex flex-col items-center text-sm"><FaAddressCard className="mb-1 text-lg" />{language === "en" ? "Address" : "ঠিকানা"}</Link>
        <button onClick={() => setShowContact(!showContact)} className="flex flex-col items-center text-sm"><FaEnvelope className="mb-1 text-lg" />{language === "en" ? "Contact" : "যোগাযোগ"}</button>
      </nav>
    </div>
  );
}
