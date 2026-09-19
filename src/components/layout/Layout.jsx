import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

function Layout({ token, onLogout, children }) {
  return (
    <div className='min-h-screen bg-slate-900 text-slate-100 flex flex-col'>
      <Navbar token={token} onLogout={onLogout} />
      <main className='flex-1 flex justify-center px-4 items-start'>
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;