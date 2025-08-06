import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { IoHeartOutline } from "react-icons/io5";
import "./assets/css/style.css";
import { slideInLeft, slideInRight, floatingAnimation, pulseAnimation } from "../utils/gsapAnimations";

const PartnerSection = () => {
  const { t, i18n } = useTranslation();
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const bannerRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const savedLang = localStorage.getItem("selectedLanguage");
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  useEffect(() => {
    // Slide in animations
    if (contentRef.current) {
      slideInLeft(contentRef.current, 1, 0.3);
    }
    
    if (bannerRef.current) {
      slideInRight(bannerRef.current, 1, 0.5);
    }

    // Floating animation for banner
    if (bannerRef.current) {
      setTimeout(() => {
        floatingAnimation(bannerRef.current, 3);
      }, 1000);
    }

    // Pulse animation for button
    if (buttonRef.current) {
      setTimeout(() => {
        pulseAnimation(buttonRef.current, 2);
      }, 1500);
    }
  }, []);

  return (
    <section className="section cta" ref={sectionRef}>
      <div className="container">
        <div className="cta-content" ref={contentRef}>
          <h2 className="h2 section-title">{t("cta.title")}</h2>
          <button className="btn btn-outline" ref={buttonRef}>
            <span>{t("cta.button")}</span>
            <IoHeartOutline aria-hidden="true" />
          </button>
        </div>

        <figure className="cta-banner" ref={bannerRef}>
          <img
            src="https://25025637.fs1.hubspotusercontent-eu1.net/hubfs/25025637/RSE.png"
            width="520"
            height="228"
            loading="lazy"
            alt="Fox"
            className="img-cover"
          />
        </figure>
      </div>
    </section>
  );
};

export default PartnerSection;
