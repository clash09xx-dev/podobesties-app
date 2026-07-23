import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { ArrowLeft, Clock, User } from "lucide-react";
import { motion } from "motion/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { BlogPost } from "./Blog";

export default function BlogPostDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      try {
        // First try to find by slug
        const q = query(collection(db, "blog_posts"), where("slug", "==", slug));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          setPost({ id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as BlogPost);
        } else {
          // Try to find by ID if slug not found
          const docRef = doc(db, "blog_posts", slug);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setPost({ id: docSnap.id, ...docSnap.data() } as BlogPost);
          } else {
            // Not found
            navigate("/blog", { replace: true });
            return;
          }
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="bg-brand-cream min-h-screen font-sans flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="bg-brand-cream min-h-screen font-sans selection:bg-brand-accent selection:text-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24">
        <article className="max-w-[800px] mx-auto px-6">
          <Link 
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-text/60 hover:text-brand-accent transition-colors mb-12"
          >
            <ArrowLeft className="w-4 h-4" />
            Wróć do wszystkich wpisów
          </Link>
          
          <header className="mb-12 text-center">
            <div className="flex items-center justify-center gap-6 text-[13px] text-brand-text/50 mb-8 uppercase tracking-widest font-medium">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.publishDate}
              </span>
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {post.author}
              </span>
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-brand-dark font-light leading-tight mb-12">
              {post.title}
            </h1>
          </header>

          {post.headerImage && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="rounded-[32px] overflow-hidden mb-16 aspect-[21/9] bg-black/5"
            >
              <img 
                src={post.headerImage} 
                alt={post.title} 
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.contentHtml || "" }}
          />
        </article>
      </main>
      
      <Footer />
    </div>
  );
}
