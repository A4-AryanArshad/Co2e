// src/pages/Home.jsx
import React from "react";
import Hero from "./Hero";
import Features from "./Features";
import About from "./About";
import CTA from "./CTA";
import PartnerSection from "./PartnerSection";
import Service from "./Service";
import DonateSection from "./Donate";
import TestimonialsPartnerEventInsta from "./TestimonialsPartnerEventInsta";
import Header from "./Header";
import Footer2 from "./Footer2";
import CursorEyes from "../components/CursorEyes";

const Home = () => {
  return (
    <>
    <div id="ffgq">
    <Header/>
    </div>
      <Hero />
      <Features />
      <About />
      <PartnerSection />
      <Service />
      <DonateSection />
      <CursorEyes />
      <TestimonialsPartnerEventInsta />
      <Footer2/>
    </>
  );
};

export default Home;
