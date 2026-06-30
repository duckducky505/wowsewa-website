import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import './Whattsapp.css';

const WhattsappIcon = () => {
  const phoneNumber = "9779762424318"; 
  const message = "Hello WowSewa! I would like to book a package.";
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a 
      href={whatsappUrl} 
      className="whatsapp-sticky" 
      target="_blank" 
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="whatsapp-icon" />
      <span className="tooltip">Chat with us</span>
    </a>
  );
};

export default WhattsappIcon;