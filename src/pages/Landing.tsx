import Hero from "../components/Hero";
import About from "../components/About";
import Services from "../components/Services";
import Gallery from "../components/Gallery";
import Reviews from "../components/Reviews";
import Booking from "../components/Booking";
import Contact from "../components/Contact";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EditableSection from "../components/EditableSection";

export default function Landing({ landingData = {} }: { landingData?: any }) {
  console.log("Landing render, landingData:", landingData);
  return (
    <div className="bg-brand-bg min-h-screen font-sans selection:bg-brand-accent selection:text-white">
      <Navbar />
      <main>
        <EditableSection id="hero" name="Hero">
          <Hero data={landingData.hero} />
        </EditableSection>
        <EditableSection id="about" name="O nas">
          <About data={landingData.about} />
        </EditableSection>
        <EditableSection id="services" name="Usługi">
          <Services data={landingData.services} />
        </EditableSection>
        <EditableSection id="gallery" name="Galeria">
          <Gallery />
        </EditableSection>
        <Reviews />
        <EditableSection id="booking" name="Rezerwacja">
          <Booking />
        </EditableSection>
        <EditableSection id="contact" name="Kontakt">
          <Contact data={landingData.contact} />
        </EditableSection>
      </main>
      <Footer />
    </div>
  );
}
