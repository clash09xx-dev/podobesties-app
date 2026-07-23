import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ArrowLeft, Clock, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { collection, onSnapshot, query, where, doc } from "firebase/firestore";
import { db } from "../lib/firebase";
import EditableSection from "../components/EditableSection";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  shortDesc: string;
  contentHtml?: string;
  author: string;
  publishDate: string;
  thumbnail: string;
  headerImage: string;
  status: "draft" | "published";
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    // Load blog settings
    const unsubSettings = onSnapshot(doc(db, "settings", "blog"), (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      }
    }, (err) => console.error(err));

    const q = query(collection(db, "blog_posts"), where("status", "==", "published"));
    const unsub = onSnapshot(q, (snapshot) => {
      const loadedPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BlogPost[];
      setPosts(loadedPosts.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()));
      setLoading(false);
    }, (err) => { console.error(err); setLoading(false); });
    
    return () => {
      unsub();
      unsubSettings();
    };
  }, []);

  return (
    <div className="bg-brand-cream min-h-screen font-sans selection:bg-brand-accent selection:text-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24 px-6 lg:px-16 max-w-[1400px] mx-auto w-full">
        <EditableSection id="blog_page" name="Nagłówek Bloga">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-20"
          >
            <h1 className="font-serif text-5xl md:text-7xl text-brand-dark font-light mb-8">
              {settings.headline || "Blog PODOBESTIES"}
            </h1>
            <p className="font-sans text-brand-text/70 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto whitespace-pre-line">
              {settings.description || "Wkrótce pojawią się tutaj edukacyjne wpisy dotyczące zdrowia stóp, podologii, profilaktyki i profesjonalnej pielęgnacji."}
            </p>
          </motion.div>
        </EditableSection>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center py-20"
          >
            <div className="inline-block border border-black/10 rounded-2xl p-10 bg-white/50 backdrop-blur-sm max-w-lg mx-auto">
              <p className="font-sans text-lg text-brand-text/60 mb-8">
                Brak opublikowanych wpisów.
              </p>
              <Link 
                to="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-brand-text hover:text-brand-accent transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Wróć na stronę główną
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group flex flex-col bg-white border border-black/5 rounded-[32px] overflow-hidden hover:shadow-xl transition-all duration-500"
              >
                <Link to={`/blog/${post.slug || post.id}`} className="block overflow-hidden relative aspect-[4/3] bg-black/5">
                  {post.thumbnail ? (
                    <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-brand-cream text-brand-text/30">
                      Brak zdjęcia
                    </div>
                  )}
                </Link>
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-[13px] text-brand-text/50 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {post.publishDate}
                    </div>
                  </div>
                  <h3 className="font-serif text-2xl mb-4 group-hover:text-brand-accent transition-colors line-clamp-2">
                    <Link to={`/blog/${post.slug || post.id}`}>{post.title}</Link>
                  </h3>
                  <p className="font-sans text-brand-text/60 text-sm leading-relaxed mb-8 line-clamp-3 flex-1">
                    {post.shortDesc}
                  </p>
                  
                  <Link 
                    to={`/blog/${post.slug || post.id}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-brand-dark group-hover:text-brand-accent transition-colors mt-auto"
                  >
                    Czytaj więcej
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
