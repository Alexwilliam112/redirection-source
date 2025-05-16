"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = [];
      if (start) params.push(`start=${encodeURIComponent(start)}`);
      if (end) params.push(`end=${encodeURIComponent(end)}`);
      const query = params.length ? `?${params.join("&")}` : "";
      const res = await fetch(
        `https://api-oos.jojonomic.com/27407/greenpeace/rnd/report-traffic-history${query}`
      );
      const json = await res.json();
      setData(json.data || []);
    } catch (e) {
      setData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchData();
  };

  // Download as Excel
  const downloadExcel = () => {
    import("xlsx").then((XLSX) => {
      const ws = XLSX.utils.json_to_sheet(
        data.map((row) => ({
          source: row.source,
          time: new Date(row.date).toLocaleString("id-ID", {
            timeZone: "Asia/Jakarta",
          }),
        }))
      );
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, "traffic.xlsx");
    });
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <form className="flex gap-4 mb-4" onSubmit={handleFilter}>
        <label>
          Start:
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="ml-2 border rounded px-2 py-1"
          />
        </label>
        <label>
          End:
          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="ml-2 border rounded px-2 py-1"
          />
        </label>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          Filter
        </button>
        <button
          type="button"
          className="bg-green-500 text-white px-4 py-1 rounded"
          onClick={downloadExcel}
          disabled={!data.length}
        >
          Download Excel
        </button>
      </form>
      <div className="w-full overflow-x-auto">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr>
                <th className="border px-4 py-2 bg-gray-100">Source</th>
                <th className="border px-4 py-2 bg-gray-100">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4">
                    No data
                  </td>
                </tr>
              ) : (
                data.map((row, idx) => (
                  <tr key={row.id || idx}>
                    <td className="border px-4 py-2">{row.source}</td>
                    <td className="border px-4 py-2">
                      {new Date(row.date).toLocaleString("id-ID", {
                        timeZone: "Asia/Jakarta",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
