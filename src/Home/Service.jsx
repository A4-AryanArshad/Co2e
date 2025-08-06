import React, { useEffect, useRef } from "react";
import {
  IoLeafOutline,
  IoEarthOutline,
  IoFlowerOutline,
  IoBoatOutline,
} from "react-icons/io5";
import { useTranslation } from "react-i18next";

import subtitleImage from "./assets/images/subtitle-img-green.png";
import serviceBg from "./assets/images/service-map.png";
import "./assets/css/style.css";
import { 
  scaleIn, 
  cardHoverAnimation,
  cardLeaveAnimation,
  iconHoverAnimation,
  iconLeaveAnimation,
  continuousCardFloat,
  scrollTriggerAnimation
} from "../utils/gsapAnimations";

const Service = () => {
  const { t, i18n } = useTranslation();
  
  // Refs for animations
  const serviceRef = useRef(null);
  const subtitleRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    const savedLang = localStorage.getItem("selectedLanguage");
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  useEffect(() => {
    // Animate section elements with scroll triggers
    if (serviceRef.current) {
      // Headings are now static - no scroll animations

      // Animate service cards with scroll trigger and stagger
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.service-card');
        
        // Scroll-triggered stagger animation for cards
        cards.forEach((card, index) => {
          // Scroll trigger for each card
          scrollTriggerAnimation(card, scaleIn, "top 85%");
          
          const icon = card.querySelector('.card-icon');
          const title = card.querySelector('.card-title');
          const text = card.querySelector('.card-text');
          const link = card.querySelector('.btn-link');
          
          // Text elements are now static - no scroll animations
          
          // Only keep subtle continuous card float (no disappear/reappear)
          setTimeout(() => {
            continuousCardFloat(card, index * 0.5);
          }, 2000 + index * 300);
          

        });
      }
    }
  }, []);

  const services = [
    {
      icon: <IoLeafOutline />,
      title: t("serviceData.0.title"),
      text: t("serviceData.0.text"),
    },
    {
      icon: <IoEarthOutline />,
      title: t("serviceData.1.title"),
      text: t("serviceData.1.text"),
    },
    {
      icon: <IoFlowerOutline />,
      title: t("serviceData.2.title"),
      text: t("serviceData.2.text"),
    },
    {
      icon: <IoBoatOutline />,
      title: t("serviceData.3.title"),
      text: t("serviceData.3.text"),
    },
  ];

  return (
    <section
      className="section service"
      id="service"
      ref={serviceRef}
      style={{ backgroundImage: `url(${serviceBg})` }}
    >
      <div className="container">
        <p className="section-subtitle" ref={subtitleRef}>
          <img src={subtitleImage} width="32" height="7" alt="Wavy line" />
          <span>{t("service.subtitle")}</span>
        </p>

        <h2 className="h2 section-title" ref={titleRef}>
          {t("service.heading.part1")} <strong>{t("service.heading.part2")}</strong>
        </h2>

        <ul className="service-list" ref={cardsRef}>
          {services.map((service, index) => (
            <li key={index}>
              <div 
                className="service-card continuous-animation"
                onMouseEnter={(e) => {
                  cardHoverAnimation(e.currentTarget);
                  const icon = e.currentTarget.querySelector('.card-icon');
                  if (icon) iconHoverAnimation(icon);
                }}
                onMouseLeave={(e) => {
                  cardLeaveAnimation(e.currentTarget);
                  const icon = e.currentTarget.querySelector('.card-icon');
                  if (icon) iconLeaveAnimation(icon);
                }}
              >
                <div className="card-content">
                  <div className="card-icon">{service.icon}</div>
                  <h3 className="h3 card-title">{service.title}</h3>
                  <p className="card-text">{service.text}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Service;
