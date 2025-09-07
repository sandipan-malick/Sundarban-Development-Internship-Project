// React component: EducationAwareness.jsx (React + TailwindCSS + Protected Route)
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { BookOpen, Newspaper, HelpCircle, ClipboardList } from "lucide-react";
import { FaHome } from "react-icons/fa";

// Main Page with Tabs
export default function EducationAwareness() {
  const [activeTab, setActiveTab] = useState("knowledge");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const tabs = [
    { id: "knowledge", label: "Knowledge Base", icon: BookOpen },
    { id: "news", label: "Community News", icon: Newspaper },
    { id: "quiz", label: "Quiz", icon: ClipboardList },
    { id: "faq", label: "FAQ", icon: HelpCircle },
  ];

  // 🔹 Protected route: check if user is logged in
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await axios.get("http://localhost:5080/education", {
          withCredentials: true,
        });
        setLoading(false);
      } catch (err) {
        console.error("Auth check failed:", err);
        navigate("/login");
      }
    };
    verifyAuth();
  }, [navigate]);

  if (loading) {
    return (
      <p className="mt-20 text-center text-gray-600 animate-pulse">
        Checking authentication...
      </p>
    );
  }

  if (error) {
    return <p className="mt-20 text-center text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-6xl px-6 py-10 mx-auto">
      {/* Header Navbar (Large devices only) */}
      <header className="items-center justify-between hidden px-6 py-4 mb-8 text-white bg-green-700 shadow-md md:flex rounded-2xl">
        <h1 className="text-2xl font-bold">Sundarbans EcoTourism</h1>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link
                to="/"
                className="flex items-center gap-2 hover:text-yellow-300"
              >
                <FaHome /> Home
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <h1 className="mb-10 text-4xl font-bold text-center text-green-700">
        📖 Education & Awareness
      </h1>

      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2 rounded-2xl text-lg font-medium transition ${
              activeTab === tab.id
                ? "bg-green-600 text-white shadow-md"
                : "border border-green-600 text-green-700 hover:bg-green-50"
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid gap-6 md:grid-cols-2"
      >
        {activeTab === "knowledge" && <KnowledgeBase />}
        {activeTab === "news" && <CommunityNews />}
        {activeTab === "quiz" && <Quiz />}
        {activeTab === "faq" && <FAQ />}
      </motion.div>

      {/* Footer Navbar (Small devices only) */}
      <footer className="fixed bottom-0 left-0 right-0 flex items-center justify-around py-2 text-white bg-green-700 shadow-md md:hidden">
        <Link to="/" className="flex flex-col items-center text-sm">
          <FaHome size={20} />
          <span>Home</span>
        </Link>
      </footer>
    </div>
  );
}

// 🔹 Card Component
function Card({ children, className = "" }) {
  return (
    <div
      className={`p-6 transition bg-white shadow-md rounded-2xl hover:shadow-xl ${className}`}
    >
      {children}
    </div>
  );
}

// 🔹 Knowledge Base
function KnowledgeBase() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    axios
      .get("/api/education/articles", { withCredentials: true })
      .then((res) => setArticles(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      {articles.map((a, i) => (
        <Card key={i}>
          {a.coverImage && (
            <img
              src={a.coverImage}
              alt={a.title}
              className="object-cover w-full mb-3 rounded-lg max-h-48"
            />
          )}
          <h2 className="mb-2 text-xl font-semibold text-green-700">
            {a.title} <span className="text-sm text-gray-500">({a.lang})</span>
          </h2>
          <p className="text-gray-600">{a.content}</p>
        </Card>
      ))}
    </>
  );
}

// 🔹 Community News (Emergency Updates)
function CommunityNews() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    axios
      .get("/api/education/news", { withCredentials: true })
      .then((res) => setNews(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (news.length === 0) {
    return (
      <Card>
        <p className="text-center text-gray-500">
          🚨 No emergency alerts right now.
        </p>
      </Card>
    );
  }

  return (
    <>
      {news.map((n, i) => (
        <Card
          key={i}
          className={`${
            n.isEmergency ? "border-l-8 border-red-600 bg-red-50" : ""
          }`}
        >
          <h2
            className={`mb-2 text-xl font-semibold ${
              n.isEmergency ? "text-red-700" : "text-green-700"
            }`}
          >
            {n.isEmergency ? "🚨 Emergency: " : ""}
            {n.title}
          </h2>
          <p className="text-gray-700">{n.content}</p>
          {n.source && (
            <a
              href={n.source}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-sm text-blue-600 underline"
            >
              Read more
            </a>
          )}
        </Card>
      ))}
    </>
  );
}

// 🔹 FAQ
function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    axios
      .get("/api/education/faqs", { withCredentials: true })
      .then((res) => setFaqs(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      {faqs.map((f, i) => (
        <Card key={i}>
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="flex justify-between w-full text-left"
          >
            <span className="font-semibold text-green-700">{f.question}</span>
            <span>{openIndex === i ? "−" : "+"}</span>
          </button>
          {openIndex === i && (
            <p className="mt-2 text-gray-600">{f.answer}</p>
          )}
        </Card>
      ))}
    </>
  );
}

// 🔹 Quiz
function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [selected, setSelected] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    axios
      .get("/api/education/quiz", { withCredentials: true })
      .then((res) => setQuestions(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSelect = (qId, optionIndex) => {
    if (submitted) return;
    setSelected({ ...selected, [qId]: optionIndex });
  };

  const handleSubmit = async () => {
    const answers = questions.map((q) => ({
      questionId: q._id,
      selectedIndex: selected[q._id] ?? -1,
    }));

    try {
      const res = await axios.post(
        "/api/education/quiz/attempt",
        { answers },
        { withCredentials: true }
      );

      setScore(res.data.score);
      setSubmitted(true);

      const updatedQuestions = questions.map((q) => {
        const checked = res.data.attempt.answers.find(
          (a) => a.questionId === q._id
        );
        return {
          ...q,
          correctIndex: checked?.correctIndex,
          selectedIndex: checked?.selectedIndex,
        };
      });

      setQuestions(updatedQuestions);
    } catch (err) {
      console.error(err);
      alert("Failed to submit quiz.");
    }
  };

  return (
    <div className="col-span-2 space-y-4">
      {questions.map((q) => (
        <Card key={q._id}>
          <h2 className="mb-2 font-semibold text-green-700">{q.question}</h2>
          <div className="grid grid-cols-2 gap-2">
            {q.options.map((opt, i) => {
              const isSelected = q.selectedIndex === i;
              const isCorrect = submitted && q.correctIndex === i;
              const isWrong = submitted && isSelected && q.correctIndex !== i;

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(q._id, i)}
                  disabled={submitted}
                  className={`px-3 py-2 text-sm rounded-lg ${
                    isCorrect
                      ? "bg-green-700 text-white"
                      : isWrong
                      ? "bg-red-500 text-white"
                      : isSelected
                      ? "bg-green-200"
                      : "bg-green-400 hover:bg-green-200"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </Card>
      ))}

      <button
        onClick={handleSubmit}
        disabled={submitted}
        className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
      >
        Submit Quiz
      </button>

      {submitted && (
        <p className="text-lg font-medium text-green-700">
          🎉 Your Score: {score} / {questions.length}
        </p>
      )}
    </div>
  );
}
