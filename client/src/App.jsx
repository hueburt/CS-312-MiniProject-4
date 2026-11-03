import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import EditPost from './pages/EditPost';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { loading } = useAuth();
  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/"               element={<Home />} />
          <Route path="/signin"         element={<SignIn />} />
          <Route path="/signup"         element={<SignUp />} />
          <Route path="/posts/:id/edit" element={<EditPost />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}