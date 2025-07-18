import React from 'react';
import './HamburgerMenu.css';

function HamburgerMenu({ isOpen, onClick }) {
  return (
    <button
      className={`hamburger-menu ${isOpen ? 'open' : ''}`}
      onClick={onClick}
      aria-label="メニューを開閉する"
      aria-expanded={isOpen}
    >
      <span className="hamburger-menu__line"></span>
      <span className="hamburger-menu__line"></span>
      <span className="hamburger-menu__line"></span>
    </button>
  );
}

export default HamburgerMenu;
