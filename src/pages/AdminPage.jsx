import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout.jsx";

function isUserAdmin(token) {
  if (!token) return false;
  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.role === "admin";
}

function AdminPage({ token, onLogout }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isUserAdmin(token)) {
      navigate("/applications");
      return;
    }

    async function fetchStats() {
      const response = await fetch(
        import.meta.env.VITE_API_URL + "/admin/stats",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        return;
      }

      setStats(data);
    }

    fetchStats();
  }, [token, navigate]);

  return (
    <Layout token={token} onLogout={onLogout}>
      <div className="w-full max-w-md bg-slate-800 rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-semibold mb-6">Admin overview</h1>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        {stats && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-900 rounded-md p-4">
                <p className="text-sm text-slate-400">Total users</p>
                <p className="text-2xl font-semibold">{stats.totalUsers}</p>
              </div>
              <div className="bg-slate-900 rounded-md p-4">
                <p className="text-sm text-slate-400">Total applications</p>
                <p className="text-2xl font-semibold">{stats.totalApplications}</p>
              </div>
            </div>

            <div>
              <h2 className="text-sm text-slate-400 mb-2">By status</h2>
              <div className="flex flex-col gap-2">
                {stats.statusCounts.map((row) => (
                  <div
                    key={row.status}
                    className="flex justify-between bg-slate-900 rounded-md px-3 py-2"
                  >
                    <span className="text-sm">{row.status}</span>
                    <span className="text-sm font-medium">{row.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default AdminPage;