import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const scrollToElement = () => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          return true;
        }
        return false;
      };

      // Try immediately
      if (!scrollToElement()) {
        // Try multiple times if element is not yet rendered
        let attempts = 0;
        const interval = setInterval(() => {
          if (scrollToElement() || attempts > 10) {
            clearInterval(interval);
          }
          attempts++;
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}
