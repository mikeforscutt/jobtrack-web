import Layout from "../components/layout/Layout.jsx";
import RegisterForm from "../components/forms/RegisterForm.jsx";

function RegisterPage({ onSuccess, handleBackToLoginClick, token, onLogout }) {
  return (
    <Layout token={token} onLogout={onLogout}>
      <div className='w-full max-w-md bg-slate-800 rounded-xl shadow-lg p-8 mt-32'>
        <RegisterForm onSuccess={onSuccess} />
        <button
          type='button'
          onClick={handleBackToLoginClick}
          className='w-full mt-3 text-sm text-slate-400 hover:text-slate-200 transition-colors'
        >
          Back to login
        </button>
      </div>
    </Layout>
  );
}

export default RegisterPage;