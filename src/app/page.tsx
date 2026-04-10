import {
  Benefits,
  CTA,
  Demo,
  Features,
  Footer,
  Hero,
  HowItWorks,
  Navbar,
  Testimonials,
} from "@/components/landing";

export default function Home() {
  return (
    <main className="relative overflow-x-hidden">
      <Navbar />
      <Hero />
      <Features />
      <Demo />
      <HowItWorks />
      <Benefits />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
