

import Footer from "./components/footer";
import { BaseHeroSection } from "./components/home/sections/hero-section";
import PromoBanner from "./components/home/sections/promo-banner";
import { AboutScrollSection } from "./components/about/about-scroll-section";
import { TeamsSection } from "./components/teams/teams-section";
import EventsSection from "./components/home/sections/EventsSection";
import { SocietyLeadSection } from "./components/home/sections/LeadSection";

export default function Home() {

  return (
    <div className="flex flex-col min-h-screen max-w-full overflow-x-hidden relative">
      <section id="home">
        <BaseHeroSection description="Empowering Developers, Elevating Innovation at GDG NITH Chapter." />
      </section>
      
      <section id="about">
        <AboutScrollSection />
      </section>
      <section id="events">
        <EventsSection />
      </section>
      
      <section id="team">
        <TeamsSection />
      </section>
      <section id="contact">
        <Footer />
      </section>


    </div>
  );
}
