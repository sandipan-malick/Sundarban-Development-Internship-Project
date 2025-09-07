import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5080/api/education";
axios.defaults.withCredentials = true;

export default function AdminEducation() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("articles");
    useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        await axios.get("http://localhost:5080/admin-education", {
          withCredentials: true,
        });
      } catch (err) {
        navigate("/admin-login");
      }
    };
    checkAdminAuth();
  }, [navigate]);
  return (
    <div className="max-w-6xl px-6 py-10 mx-auto">
      <h1 className="mb-8 text-3xl font-bold text-green-700">Admin • Education</h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {["articles", "faqs", "quiz", "attempts", "news"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg border ${
              tab === t
                ? "bg-green-600 text-white"
                : "border-green-600 text-green-700 hover:bg-green-50"
            }`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "articles" && <ArticlesAdmin />}
      {tab === "faqs" && <FAQsAdmin />}
      {tab === "quiz" && <QuizAdmin />}
      {tab === "attempts" && <AttemptsAdmin />}
      {tab === "news" && <NewsAdmin />}
    </div>
  );
}

/* ---------- Common Field Components ---------- */
function Field({ label, ...props }) {
  return (
    <label className="block mb-3">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input {...props} className="w-full p-2 mt-1 border rounded-md" />
    </label>
  );
}

function Textarea({ label, ...props }) {
  return (
    <label className="block mb-3">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <textarea {...props} className="w-full p-2 mt-1 border rounded-md" rows={4} />
    </label>
  );
}

/* ------------------ Articles ------------------ */
function ArticlesAdmin() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    title: "",
    content: "",
    lang: "en",
    topic: "general",
    coverImage: "",
    isPublished: true,
  });

  const load = async () => {
    const { data } = await axios.get(`${API}/articles?lang=${form.lang}`);
    setList(data);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  const create = async () => {
    await axios.post(`${API}/admin/articles`, form);
    setForm({
      title: "",
      content: "",
      lang: "en",
      topic: "general",
      coverImage: "",
      isPublished: true,
    });
    load();
  };

  const update = async (id, patch) => {
    await axios.put(`${API}/admin/articles/${id}`, patch);
    load();
  };

  const remove = async (id) => {
    await axios.delete(`${API}/admin/articles/${id}`);
    load();
  };

  return (
    <div className="grid gap-6 outline-none md:grid-cols-2">
      {/* Create Article */}
      <div className="p-4 bg-white shadow rounded-xl">
        <h2 className="mb-4 text-xl font-semibold text-green-700">
          Create Article
        </h2>
        <Field
          label="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <Textarea
          label="Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
        <div className="grid grid-cols-3 gap-3">
          <select
            className="p-2 border rounded"
            value={form.lang}
            onChange={(e) => setForm({ ...form, lang: e.target.value })}
          >
            <option value="en">English</option>
            <option value="bn">বাংলা</option>
          </select>
          <select
            className="p-2 border rounded"
            value={form.topic}
            onChange={(e) => setForm({ ...form, topic: e.target.value })}
          >
            <option>general</option>
            <option>wildlife</option>
            <option>mangrove</option>
            <option>eco-tourism</option>
          </select>
          <select
            className="p-2 border rounded"
            value={form.isPublished}
            onChange={(e) =>
              setForm({ ...form, isPublished: e.target.value === "true" })
            }
          >
            <option value="true">Published</option>
            <option value="false">Draft</option>
          </select>
        </div>
        <Field
          label="Cover Image URL (optional)"
          value={form.coverImage}
          onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
        />
        <button
          onClick={create}
          className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
        >
          Save
        </button>
      </div>

      {/* Articles List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-green-700">Articles</h2>
          <button onClick={load} className="px-3 py-1 border rounded">
            Refresh
          </button>
        </div>
        {list.map((a) => (
          <div key={a._id} className="p-4 bg-white shadow rounded-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{a.title}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => update(a._id, { isPublished: !a.isPublished })}
                  className="px-3 py-1 border rounded"
                >
                  {a.isPublished ? "Unpublish" : "Publish"}
                </button>
                <button
                  onClick={() => remove(a._id)}
                  className="px-3 py-1 text-white bg-red-600 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              {a.lang} • {a.topic}
            </p>
            <p className="mt-2 text-gray-700 line-clamp-3">{a.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------ FAQs ------------------ */
function FAQsAdmin() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    question: "",
    answer: "",
    lang: "en",
    isPublished: true,
  });

  const load = async () => {
    const { data } = await axios.get(`${API}/faqs?lang=${form.lang}`);
    setList(data);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  const create = async () => {
    await axios.post(`${API}/admin/faqs`, form);
    setForm({ question: "", answer: "", lang: "en", isPublished: true });
    load();
  };

  const update = async (id, patch) => {
    await axios.put(`${API}/admin/faqs/${id}`, patch);
    load();
  };

  const remove = async (id) => {
    await axios.delete(`${API}/admin/faqs/${id}`);
    load();
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Create FAQ */}
      <div className="p-4 bg-white shadow rounded-xl">
        <h2 className="mb-4 text-xl font-semibold text-green-700">Create FAQ</h2>
        <Field
          label="Question"
          value={form.question}
          onChange={(e) => setForm({ ...form, question: e.target.value })}
        />
        <Textarea
          label="Answer"
          value={form.answer}
          onChange={(e) => setForm({ ...form, answer: e.target.value })}
        />
        <div className="grid grid-cols-2 gap-3">
          <select
            className="p-2 border rounded"
            value={form.lang}
            onChange={(e) => setForm({ ...form, lang: e.target.value })}
          >
            <option value="en">English</option>
            <option value="bn">বাংলা</option>
          </select>
          <select
            className="p-2 border rounded"
            value={form.isPublished}
            onChange={(e) =>
              setForm({ ...form, isPublished: e.target.value === "true" })
            }
          >
            <option value="true">Published</option>
            <option value="false">Draft</option>
          </select>
        </div>
        <button
          onClick={create}
          className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
        >
          Save
        </button>
      </div>

      {/* FAQs List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-green-700">FAQs</h2>
          <button onClick={load} className="px-3 py-1 border rounded">
            Refresh
          </button>
        </div>
        {list.map((f) => (
          <div key={f._id} className="p-4 bg-white shadow rounded-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{f.question}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => update(f._id, { isPublished: !f.isPublished })}
                  className="px-3 py-1 border rounded"
                >
                  {f.isPublished ? "Unpublish" : "Publish"}
                </button>
                <button
                  onClick={() => remove(f._id)}
                  className="px-3 py-1 text-white bg-red-600 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="mt-1 text-gray-700">{f.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------ Quiz ------------------ */
function QuizAdmin() {
  const blank = {
    question: "",
    options: ["", ""],
    correctIndex: 0,
    lang: "en",
    topic: "general",
    difficulty: "easy",
    isActive: true,
  };
  const [list, setList] = useState([]);
  const [form, setForm] = useState(blank);

  const load = async () => {
    const { data } = await axios.get(`${API}/quiz?lang=${form.lang}`);
    setList(data);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  const addOption = () =>
    setForm({ ...form, options: [...form.options, ""] });

  const updateOption = (i, val) => {
    const options = [...form.options];
    options[i] = val;
    setForm({ ...form, options });
  };

  const create = async () => {
    await axios.post(`${API}/admin/quiz`, form);
    setForm(blank);
    load();
  };

  const update = async (id, patch) => {
    await axios.put(`${API}/admin/quiz/${id}`, patch);
    load();
  };

  const remove = async (id) => {
    await axios.delete(`${API}/admin/quiz/${id}`);
    load();
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Create Question */}
      <div className="p-4 bg-white shadow rounded-xl">
        <h2 className="mb-4 text-xl font-semibold text-green-700">
          Create Question
        </h2>
        <Textarea
          label="Question"
          value={form.question}
          onChange={(e) => setForm({ ...form, question: e.target.value })}
        />
        <div className="space-y-2">
          {form.options.map((opt, i) => (
            <Field
              key={i}
              label={`Option ${i + 1}`}
              value={opt}
              onChange={(e) => updateOption(i, e.target.value)}
            />
          ))}
          <button onClick={addOption} className="px-3 py-1 border rounded">
            Add Option
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-3">
          <Field
            label="Correct Index"
            type="number"
            min={0}
            value={form.correctIndex}
            onChange={(e) =>
              setForm({ ...form, correctIndex: Number(e.target.value) })
            }
          />
          <select
            className="self-end p-2 border rounded"
            value={form.lang}
            onChange={(e) => setForm({ ...form, lang: e.target.value })}
          >
            <option value="en">English</option>
            <option value="bn">বাংলা</option>
          </select>
          <select
            className="self-end p-2 border rounded"
            value={form.topic}
            onChange={(e) => setForm({ ...form, topic: e.target.value })}
          >
            <option>general</option>
            <option>wildlife</option>
            <option>mangrove</option>
            <option>eco-tourism</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <select
            className="p-2 border rounded"
            value={form.difficulty}
            onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
          >
            <option>easy</option>
            <option>medium</option>
            <option>hard</option>
          </select>
          <select
            className="p-2 border rounded"
            value={form.isActive}
            onChange={(e) =>
              setForm({ ...form, isActive: e.target.value === "true" })
            }
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
        <button
          onClick={create}
          className="px-4 py-2 mt-3 text-white bg-green-600 rounded hover:bg-green-700"
        >
          Save
        </button>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-green-700">Questions</h2>
          <button onClick={load} className="px-3 py-1 border rounded">
            Refresh
          </button>
        </div>
        {list.map((q) => (
          <div key={q._id} className="p-4 bg-white shadow rounded-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold line-clamp-1">{q.question}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => update(q._id, { isActive: !q.isActive })}
                  className="px-3 py-1 border rounded"
                >
                  {q.isActive ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => remove(q._id)}
                  className="px-3 py-1 text-white bg-red-600 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              {q.lang} • {q.topic} • {q.difficulty}
            </p>
            <ul className="mt-2 text-sm text-gray-700 list-disc list-inside">
              {(q.options || []).map((o, i) => (
                <li key={i}>
                  {i}. {o}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------ Attempts ------------------ */
function AttemptsAdmin() {
  const [list, setList] = useState([]);

  const load = async () => {
    const { data } = await axios.get(`${API}/admin/quiz/attempts`);
    setList(data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-green-700">Quiz Attempts</h2>
        <button onClick={load} className="px-3 py-1 border rounded">
          Refresh
        </button>
      </div>
      {list.map((a) => (
        <div key={a._id} className="p-4 bg-white shadow rounded-xl">
          <div className="flex items-center justify-between">
            <p className="font-semibold">
              User: {a.userId?.name || a.userId?.email || a.userId}
            </p>
            <p className="text-sm">
              Score: {a.score}/{a.total}
            </p>
          </div>
          <p className="text-sm text-gray-500">
            {a.lang} • {a.topic} •{" "}
            {new Date(a.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ------------------ News ------------------ */
function NewsAdmin() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    title: "",
    content: "",
    isEmergency: false,
    lang: "en",
    topic: "general",
    isPublished: true,
    source: "",
  });

  const load = async () => {
    const { data } = await axios.get(`${API}/news?lang=${form.lang}`);
    setList(data);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  const create = async () => {
    await axios.post(`${API}/news`, form);
    setForm({
      title: "",
      content: "",
      isEmergency: false,
      lang: "en",
      topic: "general",
      isPublished: true,
      source: "",
    });
    load();
  };

  const update = async (id, patch) => {
    await axios.put(`${API}/news/${id}`, patch);
    load();
  };

  const remove = async (id) => {
    await axios.delete(`${API}/news/${id}`);
    load();
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Create News */}
      <div className="p-4 bg-white shadow rounded-xl">
        <h2 className="mb-4 text-xl font-semibold text-green-700">
          Create News
        </h2>
        <Field
          label="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <Textarea
          label="Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
        <div className="grid grid-cols-3 gap-3">
          <select
            className="p-2 border rounded"
            value={form.lang}
            onChange={(e) => setForm({ ...form, lang: e.target.value })}
          >
            <option value="en">English</option>
            <option value="bn">বাংলা</option>
          </select>
          <select
            className="p-2 border rounded"
            value={form.topic}
            onChange={(e) => setForm({ ...form, topic: e.target.value })}
          >
            <option>general</option>
            <option>wildlife</option>
            <option>mangrove</option>
            <option>eco-tourism</option>
          </select>
          <select
            className="p-2 border rounded"
            value={form.isPublished}
            onChange={(e) =>
              setForm({ ...form, isPublished: e.target.value === "true" })
            }
          >
            <option value="true">Published</option>
            <option value="false">Draft</option>
          </select>
        </div>

        {/* Emergency toggle */}
        <select
          className="w-full p-2 mt-2 border rounded"
          value={form.isEmergency}
          onChange={(e) =>
            setForm({ ...form, isEmergency: e.target.value === "true" })
          }
        >
          <option value="false">Normal</option>
          <option value="true">Emergency</option>
        </select>

        <Field
          label="Source URL (optional)"
          value={form.source}
          onChange={(e) => setForm({ ...form, source: e.target.value })}
        />

        <button
          onClick={create}
          className="px-4 py-2 mt-2 text-white bg-green-600 rounded hover:bg-green-700"
        >
          Save
        </button>
      </div>

      {/* News List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-green-700">News</h2>
          <button onClick={load} className="px-3 py-1 border rounded">
            Refresh
          </button>
        </div>
        {list.map((n) => (
          <div
            key={n._id}
            className={`p-4 bg-white shadow rounded-xl ${
              n.isEmergency ? "border-l-4 border-red-600" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">
                {n.isEmergency ? "🚨 " : ""}
                {n.title}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => update(n._id, { isPublished: !n.isPublished })}
                  className="px-3 py-1 border rounded"
                >
                  {n.isPublished ? "Unpublish" : "Publish"}
                </button>
                <button
                  onClick={() => remove(n._id)}
                  className="px-3 py-1 text-white bg-red-600 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              {n.lang} • {n.topic}
            </p>
            <p className="mt-2 text-gray-700">{n.content}</p>
            {n.source && (
              <a
                href={n.source}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                Read more
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
