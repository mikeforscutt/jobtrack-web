import Layout from "../components/layout/Layout.jsx";
import ApplicationForm from "../components/forms/ApplicationForm.jsx";

function ApplicationsPage({
  token,
  onLogout,
  applications,
  error,
  editingApplication,
  editName,
  setEditName,
  editDescription,
  setEditDescription,
  editStatus,
  setEditStatus,
  handleEditClick,
  handleEditSave,
  handleEditCancel,
  handleDelete,
  handleCreated,
}) {
  return (
    <Layout token={token} onLogout={onLogout}>
      <div className="w-full max-w-md bg-slate-800 rounded-xl shadow-lg p-8">
        {applications.length === 0 ? (
          <p className="text-slate-400 text-sm">No applications yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {applications.map((app) => (
              <li
                key={app.id}
                className="bg-slate-900 border border-slate-700 rounded-md p-3"
              >
                {editingApplication === app.id ? (
                  <form onSubmit={handleEditSave} className="flex flex-col gap-3">
                    <input
                      type="text"
                      placeholder="Company name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="px-3 py-2 rounded-md bg-slate-900 border border-slate-700 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <input
                      type="text"
                      placeholder="Role / description"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="px-3 py-2 rounded-md bg-slate-900 border border-slate-700 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="px-3 py-2 rounded-md bg-slate-900 border border-slate-700 focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      <option value="applied">Applied</option>
                      <option value="interviewing">Interviewing</option>
                      <option value="offered">Offered</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 rounded-md py-2 px-4 font-medium transition-colors"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={handleEditCancel}
                        className="text-sm text-slate-400 hover:text-slate-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <p className="font-medium">{app.name}</p>
                    <p className="text-sm text-slate-400">{app.description}</p>
                    <p className="text-sm text-slate-400">Status: {app.status}</p>
                    <div className="flex gap-3 mt-2">
                      <button
                        onClick={() => handleEditClick(app)}
                        className="text-sm text-blue-400 hover:text-blue-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(app.id)}
                        className="text-sm text-red-400 hover:text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}

        <div>
          <h2 className="text-lg font-medium mb-3 mt-6">Add a New Application</h2>
          <ApplicationForm token={token} onCreated={handleCreated} />
        </div>
      </div>
    </Layout>
  );
}

export default ApplicationsPage;