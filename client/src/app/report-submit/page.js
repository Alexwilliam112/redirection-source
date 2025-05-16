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
        `https://api-oos.jojonomic.com/27407/greenpeace/rnd/get-report-submissions${query}`
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
          fullname: row.fullname,
          phone_no: row.phone_no,
          email: row.email,
          source: row.source,
          submitted_at: new Date(row.created_at).toLocaleString("id-ID", {
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
                <th className="border px-4 py-2 bg-gray-100 text-center">
                  Nama Lengkap
                </th>
                <th className="border px-4 py-2 bg-gray-100 text-center">
                  Nomor Handphone
                </th>
                <th className="border px-4 py-2 bg-gray-100 text-center">
                  Email
                </th>
                <th className="border px-4 py-2 bg-gray-100 text-center">
                  Source
                </th>
                <th className="border px-4 py-2 bg-gray-100 text-center">
                  Submission Time
                </th>
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
                    <td className="border px-4 py-2 text-center">
                      {row.fullname}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {row.phone_no}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {row.email}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {row.source}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {new Date(row.created_at).toLocaleString("id-ID", {
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
