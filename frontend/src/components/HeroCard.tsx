import React, { useMemo, useState } from 'react';
import type { Superhero } from '../types/superhero';
import { resolveImageUrl } from '../api/superheroes.api';

type Props = {
  hero: Superhero;
  onView: (id: string) => void;
};

export const HeroCard = ({ hero, onView }: Props) => {
  const [flipped, setFlipped] = useState(false);
  const imageUrl = hero.images?.[0]?.url;
  const previewPowers = useMemo(() => hero.superpowers?.slice(0, 3) || [], [hero.superpowers]);

  const toggleFlip = () => setFlipped((prev) => !prev);
  const heroImage = imageUrl ? resolveImageUrl(imageUrl) : '';

  return (
    <div
      className={`hero-card ${flipped ? 'is-flipped' : ''}`}
      role="button"
      tabIndex={0}
      onClick={toggleFlip}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggleFlip();
        }
      }}
    >
      <div className="hero-card__inner">
        <div className="hero-card__face hero-card__front">
          <div className="hero-card__media">
            {heroImage ? (
              <img className="hero-card__image" src={heroImage} alt={hero.nickname} />
            ) : (
              <div className="hero-card__image hero-card__placeholder">
                <span>No image</span>
              </div>
            )}
            <div className="hero-card__overlay">
              <h3 className="hero-card__title">{hero.nickname}</h3>
              <p className="hero-card__subtitle">{hero.real_name}</p>
            </div>
          </div>
          <p className="hero-card__hint">Tap to flip</p>
        </div>
        <div className="hero-card__face hero-card__back">
          <div className="hero-card__back-header">
            <h3 className="hero-card__title">Profile</h3>
            <span className="hero-card__label">{hero.nickname}</span>
          </div>
          <p className="hero-card__summary">
            {hero.origin_description || 'No origin summary yet.'}
          </p>
          <div className="tag-list">
            {previewPowers.length > 0 ? (
              previewPowers.map((power) => (
                <span className="tag" key={power}>{power}</span>
              ))
            ) : (
              <span className="tag">No powers listed</span>
            )}
          </div>
          <p className="hero-card__quote">{hero.catch_phrase || 'No catch phrase yet.'}</p>
          <button
            className="button ghost"
            onClick={(event) => {
              event.stopPropagation();
              onView(hero._id);
            }}
          >
            Open dossier
          </button>
          <p className="hero-card__hint">Tap again to return</p>
        </div>
      </div>
    </div>
  );
};
