import { useState, useEffect } from "react";
import "./About.css";
import { NavLink } from "react-router-dom";
import image1 from "../assets/image.png";
import {
  FaStore,
  FaChartLine,
  FaShoppingBag,
  FaMoneyBillAlt,
  FaTruck,
  FaHeadset,
  FaUndoAlt,
} from "react-icons/fa";
import CountUp from "react-countup";
import sagar from "../assets/sagar.jpg";
import "intersection-observer"; // Polyfill for IntersectionObserver
import React from 'react';


const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 } // Adjusted for better mobile triggering
    );

    const section = document.querySelector(".details");
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  return (
    <div>
      <div className="corner">
        <p className="Home">
          <NavLink to="/">Home </NavLink>&gt; About
        </p>
      </div>
      <div className="story">
        <div className="head">
          <h1 className="story-head">Our Story</h1>
        </div>
        <div className="content1">
          <p className="para">
            In the year 2025, India witnessed the grand launch of <b>Shopers</b>,
            an innovative e-commerce platform built to cater to the dynamic needs
            of Indian consumers. Managed by <b>Tehelka Developers</b>, a company
            renowned for its technological expertise and commitment to quality,
            <b> Shopers</b> emerged as a formidable competitor to global giants
            like Amazon. Born out of a vision to create an inclusive and
            localized shopping experience, <b>Shopers</b> offered a diverse range
            of products—from everyday essentials and groceries to cutting-edge
            electronics, fashion, and home decor.
          </p>
          <img className="picture1" src={image1} alt="picture"></img>
        </div>
      </div>
      <div className="details">
        <div className="card">
          <FaStore className="card-icon" />
          <h3>
            {isVisible && (
              <CountUp start={0} end={10000} duration={2} separator="," />
            )}
            +
          </h3>
          <p>Shops to Discover the best shopping experience.</p>
        </div>
        <div className="card">
          <FaChartLine className="card-icon" />
          <h3>
            {isVisible && (
              <CountUp start={0} end={33000} duration={2} separator="," />
            )}
            +
          </h3>
          <p>Daily buying and active Customer.</p>
        </div>
        <div className="card">
          <FaShoppingBag className="card-icon" />
          <h3>
            {isVisible && (
              <CountUp start={0} end={1000000} duration={2} separator="," />
            )}
            +
          </h3>
          <p>Explore a wide variety of products.</p>
        </div>
        <div className="card">
          <FaMoneyBillAlt className="card-icon" />
          <h3>
            Starting from{" "}
            {isVisible && <CountUp start={0} end={99} duration={2} />}
          </h3>
          <p>Quality products at the best prices.</p>
        </div>
        <div className="developer">
          <div className="dev-img">
            <img className="dev-pic" src={sagar} alt="dev-pic"></img>
          </div>
          <div className="dev-details">
            <p>
              Sagar Gupta, a visionary developer and entrepreneur, is the founder
              of <b>Shopers</b>, an innovative e-commerce platform, and{" "}
              <b>Tehelka Developers</b>, a tech-driven company renowned for its
              excellence. With a passion for creating transformative digital
              experiences, Sagar has invested <b>over a million dollars</b> into
              his ventures, establishing them as industry leaders.
            </p>
          </div>
        </div>
        <div className="policy">
          <div className="policy-card">
            <FaTruck className="policy-icon" />
            <h3>Fast Delivery</h3>
            <p>Get your orders delivered quickly and safely.</p>
          </div>
          <div className="policy-card">
            <FaHeadset className="policy-icon" />
            <h3>24/7 Customer Support</h3>
            <p>We are here to assist you at any time, day or night.</p>
          </div>
          <div className="policy-card">
            <FaUndoAlt className="policy-icon" />
            <h3>Money-Back Guarantee</h3>
            <p>Shop with confidence with our hassle-free refunds.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
