import React, { useEffect } from "react";
import { IoHeartOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import "./assets/css/style.css";
import subtitleImage from "./assets/images/subtitle-img-white.png";
import CarbonCounter from "./CarbonCounter";

const Hero = () => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const savedLang = localStorage.getItem("selectedLanguage");
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  return (
    <article id="countercar">
      {/* HERO SECTION */}
      <section className="hero" id="home">
        <div className="container">
          <p className="section-subtitle">
            <img
              src={subtitleImage}
              width="32"
              height="7"
              alt="Wavy line"
            />
            <span>{t("hero.subtitle")}</span>
          </p>

          <h2 className="h1 hero-title">
            {t("hero.title.part1")}
            <strong>{t("hero.title.part2")}</strong>
          </h2>

          <p className="hero-text">
            {t("hero.description")}
          </p>

          <button className="btn btn-primary">
            <span>{t("join_now")}</span>
            <IoHeartOutline aria-hidden="true" />
          </button>
        </div>
      </section>
      <div id="counter">
      <CarbonCounter/>

      </div>

    </article>
  );
};

export default Hero;
