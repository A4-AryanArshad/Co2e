import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
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

const Header2= () => {
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <header id="wqeq" className="header">
        <div className="container">
          <h1>
            <a href="#" className="logo"><img id="logoo" src="./Logo.png"></img></a>
          </h1>


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

            <a href="#" className="logo">C02e PORTAL</a>

            <ul className="navbar-list">
              {[
                "Articles",
                "AddNews",
                "AddBlog",
                "Add Instructor",
                "Upload Courses",
                "Featured Listing"
              ].map((item, idx) => {
                let to =
                  item === "Featured Listing"
                    ? "/admin/featured-listing"
                    : item === "Add Instructor"
                    ? "/admin/add-instructor"
                    : `/${item.toLowerCase().replace(/ /g, '-')}`;
                const isActive = location.pathname === to;
                return (
                  <li key={idx}>
                    <Link
                      to={to}
                      className="navbar-link"
                      onClick={() => setNavOpen(false)}
                    >
                      <span id="hos" style={isActive ? { borderBottom: '2px solid #90be55', display: 'inline-block' } : {}}>{item}</span>
                      <IoChevronForwardOutline aria-hidden="true" />
                    </Link>
                  </li>
                );
              })}

            </ul>
          </nav>

          <div className="header-action">
         

          </div>
        </div>
      </header>

      {/* Other Sections */}

    </>
  );
};

export default Header2;
