function Navbar({ token, onLogout }) {
  return (
    <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center">
      <span className="text-lg font-semibold">Job Track</span>
      {token && (
        <button
          onClick={onLogout}
          className="text-sm border border-slate-600 rounded-md px-3 py-1.5 hover:bg-slate-700 transition-colors"
        >
          Log out
        </button>
      )}
    </nav>
  );
}

export default Navbar;