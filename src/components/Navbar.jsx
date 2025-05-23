import React, { useLayoutEffect, useState, useEffect } from "react";
import "../styles/navbar.css";

const Navbar = () => {
  const [activeSection, setActiveSection] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Use useLayoutEffect for accurate mobile detection before paint
  useLayoutEffect(() => {
    const handleResize = () => {                                                                                                                                                                    
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Run once on mount
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Track which section is active
  useEffect(() => {
    const contentWrapper = document.querySelector(".content-wrapper");
    let observer = null;
    let sectionObserverInitialized = false;
  
    const setupSectionObserver = () => {
      const sections = document.querySelectorAll("section");
      if (!sections.length || !contentWrapper) return;
  
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
            }
          });
        },
        {
          root: contentWrapper,
          threshold: 0.6,
        }
      );
  
      sections.forEach((section) => observer.observe(section));
      sectionObserverInitialized = true;
    };
  
    // Watch for DOM mutations until all sections appear
    const mutationObserver = new MutationObserver(() => {
      if (!sectionObserverInitialized && document.querySelectorAll("section").length >= 5) {
        setupSectionObserver();
      }
    });
  
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  
    return () => {
      observer?.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
  
  // Scroll to the specified section
  const scrollToSection = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // Conditionally render the navbar and progress bar for mobile
  if (isMobile) return null;

  return (
    <>
      <nav className="navbar shared-padding">
        <ul>
          {["about", "projects", "experience", "education", "contact"].map((section) => (
            <li key={section} className="nav-item">
              <a
                href={`#${section}`}
                onClick={(e) => scrollToSection(e, section)}
                className={`font-audiowide ${activeSection === section ? "active" : ""}`}
              >
                <span className="nav-indicator"></span>
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
