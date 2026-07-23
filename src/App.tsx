import { doc, getDoc } from "firebase/firestore";
import { db } from "./lib/firebase";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Landing from "./pages/Landing";
import Admin from "./pages/Admin";
import Training from "./pages/Training";
import TrainingDetail from "./pages/TrainingDetail";
import Shop from "./pages/Shop";
import Blog from "./pages/Blog";
import GalleryPage from "./pages/GalleryPage";
import BlogPostDetail from "./pages/BlogPostDetail";
import { EditModeProvider } from "./context/EditModeContext";
import ScrollToHash from "./components/ScrollToHash";

function LandingWrapper() {
  const [data, setData] = useState({});
  useEffect(() => {
    getDoc(doc(db, "settings", "landing")).then(d => d.exists() ? setData(d.data()) : {}).catch(console.error);
  }, []);
  return <Landing landingData={data} />;
}

export default function App() {
  return (
    <EditModeProvider>
      <Router>
        <ScrollToHash />
        <Routes>
          <Route path="/" element={<LandingWrapper />} />
          <Route path="/szkolenia" element={<Training />} />
          <Route path="/szkolenia/:slug" element={<TrainingDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPostDetail />} />
          <Route path="/sklep" element={<Shop />} />
          <Route path="/galeria" element={<GalleryPage />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </EditModeProvider>
  );
}

