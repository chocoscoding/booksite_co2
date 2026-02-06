import AnnouncementBanner from "@/components/AnnouncementBanner";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TrustBadges from "@/components/TrustBadges";
import HowItWorks from "@/components/HowItWorks";
import CoupleBooks from "@/components/CoupleBooks";
import TestimonialsMarquee from "@/components/TestimonialsMarquee";
import CorporateSection from "@/components/CorporateSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import UpcomingEvents from "@/components/UpcomingEvents";
import CustomerReviews from "@/components/CustomerReviews";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBanner />
      <Header />
      <main>
        <HeroSection />
        <TrustBadges />
        <HowItWorks />
        <CoupleBooks />
        <TestimonialsMarquee />
        <CorporateSection />
        <WhyChooseUs />
        <UpcomingEvents />
        <CustomerReviews />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
