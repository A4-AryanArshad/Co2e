import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import "./assets/css/style.css";
import { 
  scrollTriggerAnimation, 
  slideInUp, 
  staggerAnimation,
  continuousCardFloat,
  continuousCardPulse,
  scaleIn,
  floatingAnimation,
  slideInLeft,
  slideInRight
} from "../utils/gsapAnimations";

const TestimonialsPartnerEventInsta = () => {
  const { t } = useTranslation();
  const events = t("testimonials.events", { returnObjects: true });
  
  // Refs for animations
  const testimonialsRef = useRef(null);
  const eventsRef = useRef(null);

  useEffect(() => {
    // Animate testimonials section
    if (testimonialsRef.current) {
      const subtitle = testimonialsRef.current.querySelector('.section-subtitle');
      const title = testimonialsRef.current.querySelector('.section-title');
      const testimonialCard = testimonialsRef.current.querySelector('.testi-card');
      const banner = testimonialsRef.current.querySelector('.testi-banner');
      
      // Scroll-triggered animations
      if (subtitle) scrollTriggerAnimation(subtitle, slideInUp, "top 80%");
      if (title) scrollTriggerAnimation(title, slideInUp, "top 80%");
      if (testimonialCard) scrollTriggerAnimation(testimonialCard, scaleIn, "top 85%");
      if (banner) scrollTriggerAnimation(banner, slideInRight, "top 85%");
      
      // Continuous animations
      setTimeout(() => {
        if (testimonialCard) continuousCardFloat(testimonialCard, 0.5);
        if (banner) floatingAnimation(banner, 4);
      }, 2000);
    }
    
    // Animate events section
    if (eventsRef.current) {
      const eventCards = eventsRef.current.querySelectorAll('.event-card');
      
      // Scroll-triggered animations for event cards
      eventCards.forEach((card, index) => {
        scrollTriggerAnimation(card, scaleIn, "top 85%");
        
        const timeElement = card.querySelector('.card-time');
        const content = card.querySelector('.card-content');
        const button = card.querySelector('.btn');
        
        // Animate time elements
        if (timeElement) {
          setTimeout(() => {
            continuousCardPulse(timeElement, index * 0.3);
          }, 1500 + index * 300);
        }
        
        // Animate content
        if (content) {
          scrollTriggerAnimation(content, slideInUp, "top 90%");
        }
        
        // Animate buttons
        if (button) {
          setTimeout(() => {
            continuousCardFloat(button, index * 0.4);
          }, 2000 + index * 400);
        }
      });
    }
  }, []);

  return (
    <>
      {/* Testimonials Section */}
      <section className="testi" ref={testimonialsRef}>
        <div className="testi-content">
          <p className="section-subtitle">
            <img src="./assets/images/subtitle-img-green.png" width="32" height="7" alt="Wavy line" />
            <span>{t("testimonials.subtitle")}</span>
          </p>
          <h2 className="h2 section-title">
            {t("testimonials.title")} <strong>{t("testimonials.strong")}</strong>
          </h2>
          <div className="testi-card">
            <div>
              <blockquote className="testi-text">
                {t("testimonials.paragraph")}
              </blockquote>
            </div>
          </div>
        </div>
        <figure className="testi-banner">
          <img
            src="https://www.haguefasteners.co.uk/wp-content/uploads/2021/10/freenaturestock-1725-1024x683.jpg"
            width="960"
            height="846"
            loading="lazy"
            alt="Nature"
            className="img-cover"
          />
        </figure>
      </section>

      {/* Event Section */}
      <section className="section event" id="event" ref={eventsRef}>
        <div className="container">
          <p className="section-subtitle">
            <img src="./assets/images/subtitle-img-green.png" width="32" height="7" alt="Wavy line" />
            <span>{t("testimonials.services")}</span>
            <img src="./assets/images/subtitle-img-green.png" width="32" height="7" alt="Wavy line" />
          </p>
          <h2 className="h2 section-title">
            {t("testimonials.our")} <strong>{t("testimonials.servicesStrong")}</strong>
          </h2>

          <ul className="event-list">
            {events.map((event, i) => (
              <li key={i}>
                <div className="event-card">
                  <time className="card-time" dateTime={event.date}>
                    <span className="month">{event.month || ""}</span>
                    <span className="date">{event.day}</span>
                  </time>
                  <div className="wrapper">
                    <div className="card-content">
                      <p className="card-subtitle">{event.title}</p>
                      <h3 className="card-title">{event.heading}</h3>
                      <p className="card-text">{event.paragraph}</p>
                    </div>
                    <button className="btn btn-white">
                      <span>{t("testimonials.join")}</span>
                      <ion-icon name="arrow-forward" aria-hidden="true"></ion-icon>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>


        </div>
      </section>
    </>
  );
};

export default TestimonialsPartnerEventInsta;
