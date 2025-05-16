"use client";
import { useState } from "react";

export default function Home() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Get source from URL query param
  let source = "";
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    source = params.get("source") || "";
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !phone || !email) {
      setError("Form harus diisi!");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("https://api-oos.jojonomic.com/27407/greenpeace/rnd/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          full_name: fullName,
          phone,
          email,
          source
        })
      });
      if (!res.ok) {
        throw new Error("Gagal submit form");
      }
      alert("Terima kasih sudah bergabung!");
      setFullName("");
      setPhone("");
      setEmail("");
    } catch (err) {
      setError("Gagal submit form. Silakan coba lagi.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl px-10 pt-8 pb-10 w-full max-w-lg border border-green-200"
      >
        <h2 className="text-3xl font-extrabold mb-4 text-center text-green-700">
          Mari Jadi Bagian dari Greenpeace Indonesia
        </h2>
        <p className="mb-8 text-gray-600 text-center leading-relaxed">
          Melalui kanal WhatsApp, kamu akan mendapatkan konten eksklusif yang lebih cepat. Selain itu, akan ada undangan eksklusif untuk mengikuti kegiatan-kegiatan bersama Greenpeace. Cari tahu juga informasi bergabung menjadi relawan / donor / program magang / kerja sama dengan Greenpeace. Jika kamu punya pertanyaan atau laporan seputar isu lingkungan, kamu juga bisa langsung chat MinPis di WhatsApp.
        </p>
        <hr className="mb-8 border-t border-green-200" />
        <div className="mb-5">
          <label className="block text-green-700 text-sm font-semibold mb-2">
            Nama Lengkap
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            placeholder="Nama Lengkap"
            disabled={loading}
          />
        </div>
        <div className="mb-5">
          <label className="block text-green-700 text-sm font-semibold mb-2">
            Nomor Handphone
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            placeholder="Nomor Handphone"
            disabled={loading}
          />
        </div>
        <div className="mb-6">
          <label className="block text-green-700 text-sm font-semibold mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            placeholder="Email"
            disabled={loading}
          />
        </div>
        {error && (
          <div className="mb-4 text-red-600 text-center font-medium">{error}</div>
        )}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 transition text-white font-bold py-3 px-4 rounded-lg shadow-md disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Mengirim..." : "Jadi bagian Greenpeace"}
        </button>
      </form>
    </div>
  );
}