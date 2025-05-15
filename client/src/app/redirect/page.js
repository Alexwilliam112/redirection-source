"use client";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Get query params as an object
    const params = Object.fromEntries(
      new URLSearchParams(window.location.search)
    );

    // Send to API
    fetch(
      "https://webhook-oos.jojonomic.com/27407/greenpeace/rnd/redirection",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: params.source,
        }),
      }
    );

    // Redirect instantly
    window.location.href = "https://www.greenpeace.org/indonesia/";
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* Optionally, you can add a message like "Redirecting..." */}
    </div>
  );
}
