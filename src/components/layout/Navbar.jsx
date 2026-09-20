import { Link } from "react-router-dom";

function Navbar({ token, onLogout }) {
  return (
    <nav className='bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center'>
      <span className='text-lg font-semibold'>Job Track</span>
      <div className='flex items-center gap-4'>
        <Link
          to='/jobs'
          className='text-sm text-slate-300 hover:text-white transition-colors'
        >
          Jobs
        </Link>
        {token && (
          <>
            <Link to='/profile'>
              <div className='w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center hover:bg-blue-500/20 transition-colors'>
                <span className='text-blue-400 font-semibold text-xs'>
                  {JSON.parse(atob(token.split(".")[1]))
                    .email.charAt(0)
                    .toUpperCase()}
                </span>
              </div>
            </Link>
            <button
              onClick={onLogout}
              className='text-sm border border-slate-600 rounded-md px-3 py-1.5 hover:bg-slate-700 transition-colors'
            >
              Log out
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;