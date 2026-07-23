import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import Navbar from "../components/Navbar";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import Markdown from "react-markdown";

export default function TrainingDetail() {
  const { slug } = useParams();
  const [training, setTraining] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const fetchTraining = async () => {
      try {
        const q = query(collection(db, "trainings"), where("slug", "==", slug));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setTraining({ id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTraining();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-brand-bg min-h-screen text-brand-text flex items-center justify-center font-sans">
        Wczytywanie...
      </div>
    );
  }

  if (!training) {
    return (
      <div className="bg-brand-bg min-h-screen text-brand-text flex flex-col items-center justify-center font-sans">
        <h1 className="text-3xl mb-4 font-serif">Nie znaleziono szkolenia</h1>
        <Link to="/szkolenia" className="text-brand-accent hover:underline">
          Wróć do listy szkoleń
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-brand-bg min-h-screen text-brand-text selection:bg-brand-accent/20">
      <Navbar />
      <main className="pt-32 pb-24 px-6 lg:px-16 max-w-[1000px] mx-auto">
        <Link to="/szkolenia" className="inline-flex items-center gap-2 text-brand-text/60 hover:text-brand-text transition-colors mb-12 font-sans">
          <ArrowLeft className="w-4 h-4" />
          <span>Wróć do szkoleń</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {training.image && (
            <div className="w-full h-[400px] bg-brand-cream rounded-[32px] overflow-hidden mb-12 border border-black/5">
              <img src={training.image} alt={training.title} className="w-full h-full object-cover" />
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-serif mb-8 text-brand-text">{training.title}</h1>
          
          <div className="prose prose-lg prose-neutral max-w-none font-sans mb-16 text-brand-text/80 leading-relaxed">
            <div className="whitespace-pre-line mb-10">
               <Markdown>{training.description}</Markdown>
            </div>
            
            <h2 className="text-3xl font-serif mb-6 text-brand-text">Program szkolenia</h2>
            <div className="bg-brand-cream border border-black/5 p-8 md:p-12 rounded-[32px]">
              <div className="markdown-body">
                 <Markdown>{training.program}</Markdown>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Link 
              to="/szkolenia#training-form" 
              className="inline-block bg-brand-text text-brand-bg px-10 py-5 rounded-full font-sans font-medium text-lg hover:bg-brand-text/90 transition-colors"
            >
              Zapytaj o to szkolenie
            </Link>
          </div>
        </motion.div>
      </main>
      <Contact />
      <Footer />
    </div>
  );
}
