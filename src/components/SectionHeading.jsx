import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

export default function SectionHeading({ kicker, heading, linkTo, linkLabel }) {
  return (
    <div className="home-section-heading">
      {kicker && <span className="home-kicker">{kicker}</span>}
      <h2>{heading}</h2>
      {linkTo && (
        <Link to={linkTo} className="home-text-link">
          {linkLabel} <FiArrowRight />
        </Link>
      )}
    </div>
  );
}
