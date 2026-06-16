import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import Hero from '../../sections/landing/Hero/Hero';
import Features from '../../sections/landing/Features/Features';
import CTA from '../../sections/landing/CTA/CTA';

const Landing = () => {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <CTA />
      </main>
      <Footer />
    </>
  );
};

export default Landing;