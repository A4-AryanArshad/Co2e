import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./assets/css/style.css";
import {
  IoMenuOutline,
  IoCloseOutline,
  IoChevronForwardOutline,
  IoSearchOutline,
  IoHeartOutline
} from "react-icons/io5";
import Hero from "./Hero";
import Features from "./Features";
import About from "./About";
import CTA from "./CTA";
import Service from "./Service";
import PartnerSection from "./PartnerSection";
import DonateSection from "./Donate";
import TestimonialsPartnerEventInsta from "./TestimonialsPartnerEventInsta";

const Header = () => {
  const [navOpen, setNavOpen] = useState(false);
  const { i18n, t } = useTranslation();

  // Load language from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem("selectedLanguage");
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    i18n.changeLanguage(selectedLang);
    localStorage.setItem("selectedLanguage", selectedLang);
    
    // Dispatch custom event for language change
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: selectedLang }));
  };

  return (
    <>

    <div >
      <header id="wqeq" className="header">
        <div id="uuuy22" className="container">
          <h1>
    
          </h1>

          <select 
            name="language" 
            className="lang-switch"
            onChange={handleLanguageChange}
            value={i18n.language}
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="es">Español</option>
          </select>

          {/* Open Button */}
          <button
            className="nav-open-btn"
            aria-label="Open Menu"
            onClick={() => setNavOpen(true)}
          >
            <IoMenuOutline />
          </button>

          {/* Navbar */}
          <nav className={`navbar ${navOpen ? "active" : ""}`}>
            <button
              className="nav-close-btn"
              aria-label="Close Menu"
              onClick={() => setNavOpen(false)}
            >
              <IoCloseOutline />
            </button>

            <a href="#" className="logo">{t("navbar.logo")}</a>

            <ul className="navbar-list">
              <li>
                <Link  to="/" className="navbar-link" onClick={() => setNavOpen(false)}>
                  <span id="hos" >{t("navbar.home")}</span>
                  <IoChevronForwardOutline />
                </Link>
              </li>
              <li>
                <Link to="/service" className="navbar-link" onClick={() => setNavOpen(false)}>
                  <span id="hos" >{t("navbar.service")}</span>
                  <IoChevronForwardOutline />
                </Link>
              </li>
              <li>
                <Link to="/trade" className="navbar-link" onClick={() => setNavOpen(false)}>
                  <span id="hos" >{t("navbar.trade")}</span>
                  <IoChevronForwardOutline />
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="navbar-link" onClick={() => setNavOpen(false)}>
                  <span id="hos" >{t("navbar.pricing")}</span>
                  <IoChevronForwardOutline />
                </Link>
              </li>
              <li>
                <Link to="/news" className="navbar-link" onClick={() => setNavOpen(false)}>
                  <span id="hos" >{t("navbar.news")}</span>
                  <IoChevronForwardOutline />
                </Link>
              </li>
              <li>
                <Link to="/login" className="navbar-link" onClick={() => setNavOpen(false)}>
                  <span id="hos" >{t("navbar.login")}</span>
                  <IoChevronForwardOutline />
                </Link>
              </li>
            </ul>
          </nav>

          <div className="header-action">
         

          <Link to="/signup">  <button className="btn btn-primary">
              <span id="hos" >{t("join_now")}</span>
              <IoHeartOutline aria-hidden="true" />
            </button></Link>
          </div>
        </div>
      </header>

      {/* Other Sections */}
      </div>

    </>
  );
};

export default Header;
