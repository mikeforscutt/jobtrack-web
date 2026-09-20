import Layout from "../components/layout/Layout.jsx";

function LoginPage({
  email,
  setEmail,
  password,
  setPassword,
  error,
  handleLogin,
  handleRegisterClick,
  token,
  onLogout,
}) {
  return (
    <Layout token={token} onLogout={onLogout}>
      <div className='w-full max-w-md bg-slate-800 rounded-xl shadow-lg p-8 mt-32'>
        <form onSubmit={handleLogin} className='flex flex-col gap-3'>
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='px-3 py-2 rounded-md bg-slate-900 border border-slate-700 focus:outline-none focus:border-blue-500 transition-colors'
          />
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='px-3 py-2 rounded-md bg-slate-900 border border-slate-700 focus:outline-none focus:border-blue-500 transition-colors'
          />
          {error && <p className='text-red-400 text-sm'>{error}</p>}
          <button
            type='submit'
            className='bg-blue-600 hover:bg-blue-700 rounded-md py-2 font-medium transition-colors'
          >
            Log in
          </button>
        </form>
        <button
          type='button'
          onClick={handleRegisterClick}
          className='w-full mt-3 text-sm text-slate-400 hover:text-slate-200 transition-colors'
        >
          Don't have an account? Register
        </button>
      </div>
    </Layout>
  );
}

export default LoginPage;