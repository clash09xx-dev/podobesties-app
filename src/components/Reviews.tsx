import { motion } from "motion/react";
import { Star } from "lucide-react";
import { useState, useEffect } from "react";

const staticReviews = [
  {
    id: "1",
    rating: 5,
    text: "Usługa na najwyższym poziomie, a przy tym atmosfera jak u BESTIE – szczerze polecam!",
    author: "Zweryfikowana opinia z Booksy"
  },
  {
    id: "2",
    rating: 5,
    text: "Bardzo miła atmosfera i profesjonalny ratunek dla popękanych pięt.",
    author: "Zweryfikowana opinia z Booksy"
  },
  {
    id: "3",
    rating: 5,
    text: "Pełny profesjonalizm! Dzięki pomocy pani Kasi moje stopy są w świetnej kondycji.",
    author: "Zweryfikowana opinia z Booksy"
  },
  {
    id: "4",
    rating: 5,
    text: "Wspaniała, profesjonalna usługa. Bardzo dokładna, delikatna i empatyczna.",
    author: "Zweryfikowana opinia z Booksy"
  }
];

export default function Reviews() {
  const [reviews] = useState<any[]>(staticReviews);

  return (
    <section id="reviews" className="relative w-full py-32 lg:py-48 px-6 lg:px-16 bg-brand-cream overflow-hidden">
      <div className="max-w-[1400px] mx-auto text-center">
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-50px" }}
           transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
           className="mb-24 flex flex-col items-center"
        >
          <div className="flex gap-2 mb-6 text-brand-accent">
            {[...Array(5)].map((_, i) => <Star key={i} className="fill-current w-5 h-5" />)}
          </div>
          <h2 className="font-serif text-4xl lg:text-6xl text-brand-text font-light mb-4">Opinie</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id || i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-brand-bg border border-black/5 p-10 lg:p-12 rounded-[32px] flex flex-col text-left"
            >
              <div className="flex gap-1 mb-6 text-brand-accent">
                {[...Array(review.rating || 5)].map((_, idx) => <Star key={idx} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="font-serif text-2xl leading-relaxed text-brand-text mb-12 grow">&quot;{review.text}&quot;</p>
              <div className="flex justify-between items-center">
                <p className="font-sans font-medium text-brand-text/50">{review.author}</p>
                {review.source && (
                  <span className="text-xs font-sans text-brand-text/40 px-2 py-1 rounded-full border border-black/10">
                    {review.source}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
