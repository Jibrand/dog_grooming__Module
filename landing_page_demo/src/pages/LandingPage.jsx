import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import TrustIndicators from '../components/TrustIndicators';
import AboutClinic from '../components/AboutClinic';
import FoundersStory from '../components/FoundersStory';
import WhyChooseUs from '../components/WhyChooseUs';
import OurPromise from '../components/OurPromise';
import Services from '../components/Services';
import PetPortalPreview from '../components/PetPortalPreview';
import Gallery from '../components/Gallery';
import Testimonials from '../components/Testimonials';
import QuickAppointment from '../components/QuickAppointment';
import Footer from '../components/Footer';
import Stats from '../components/Stats';
import Marquee from '../components/Marquee';

export default function LandingPage() {
  const [clinicData, setClinicData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClinicData() {
      try {
        let subdomain = window.location.hostname.split('.')[0];
        if (subdomain === 'localhost' || subdomain === '127') {
          subdomain = 'cliniclocal';
        }
        
        const API = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://veterinary-clinics-futureframe-back.vercel.app' : 'http://localhost:3000');
        const res = await fetch(`${API}/api/clinic/public/${subdomain}`);
        const json = await res.json();
        
        if (json.success) {
          const data = json.data;
          setClinicData(data);
          localStorage.setItem('clinicContext', JSON.stringify(data));

          // Update SEO / Meta tags dynamically
          if (data.name) {
            document.title = `${data.name} | Luxury Dog Grooming Salon`;
            const ogTitle = document.querySelector('meta[property="og:title"]');
            if (ogTitle) ogTitle.content = `${data.name} | Luxury Dog Grooming Salon`;
          }
          if (data.logoUrl) {
            let link = document.querySelector("link[rel~='icon']");
            if (!link) {
              link = document.createElement('link');
              link.rel = 'icon';
              document.head.appendChild(link);
            }
            link.href = data.logoUrl;
            
            const ogImage = document.querySelector('meta[property="og:image"]');
            if (ogImage) ogImage.content = data.logoUrl;
          }
        }
      } catch (error) {
        console.error('Failed to fetch clinic data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchClinicData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Navbar clinic={clinicData} />
      <main>
        <Hero clinic={clinicData} />
        <Marquee clinic={clinicData} />
        <TrustIndicators clinic={clinicData} />
        <AboutClinic clinic={clinicData} />
        <FoundersStory clinic={clinicData} />
        <WhyChooseUs clinic={clinicData} />
        <OurPromise clinic={clinicData} />
        <Stats clinic={clinicData} />
        <Services clinic={clinicData} />
        <PetPortalPreview clinic={clinicData} />
        <Gallery clinic={clinicData} />
        <Testimonials clinic={clinicData} />
        
        <div id="contact" className="bg-slate-50 pt-20 pb-10">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-slate-900">Ready to see the difference?</h2>
            <p className="text-slate-600 mt-4">Book your pet's appointment today.</p>
          </div>
          <QuickAppointment clinic={clinicData} />
        </div>
      </main>
      <Footer clinic={clinicData} />
    </>
  );
}
