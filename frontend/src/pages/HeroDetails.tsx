import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteSuperhero, getSuperhero, resolveImageUrl } from '../api/superheroes.api';
import { ConfirmModal } from '../components/ConfirmModal';

export const HeroDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showDelete, setShowDelete] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['superhero', id],
    queryFn: () => getSuperhero(id as string),
    enabled: Boolean(id)
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteSuperhero(id as string),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['superheroes'] });
      navigate('/');
    }
  });

  useEffect(() => {
    setActiveIndex(0);
  }, [data?.images?.length]);

  useEffect(() => {
    if (!data?.images || data.images.length <= 1) {
      return;
    }
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % data.images!.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [data?.images]);

  if (isLoading || !data) {
    return (
      <div className="page-card loading-card">
        <div className="spinner" />
        <p>Loading profile...</p>
      </div>
    );
  }

  const images = data.images || [];
  const currentImage = images[activeIndex]?.url ? resolveImageUrl(images[activeIndex].url) : '';

  return (
    <div className="details-layout">
      <Link className="back-link" to="/">Back to roster</Link>

      <div className="detail-main">
        <div className="detail-media">
          {currentImage ? (
            <img className="detail-media__image" src={currentImage} alt={data.nickname} />
          ) : (
            <div className="detail-media__placeholder">No image</div>
          )}
          {images.length > 1 && (
            <div className="detail-dots">
              {images.map((image, index) => (
                <button
                  key={image.filename}
                  className={index == activeIndex ? 'is-active' : ''}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Show image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="detail-info">
          <div className="detail-card">
            <p className="detail-label">Nickname</p>
            <h2>{data.nickname}</h2>
            <p className="detail-label">Real name</p>
            <p>{data.real_name}</p>
            <p className="detail-label">Origin</p>
            <p>{data.origin_description || 'No origin description yet.'}</p>
          </div>

          <div className="detail-card">
            <p className="detail-label">Abilities</p>
            <div className="tag-list">
              {(data.superpowers || []).length > 0 ? (
                (data.superpowers || []).map((power) => (
                  <span className="tag" key={power}>{power}</span>
                ))
              ) : (
                <span className="tag">No powers listed</span>
              )}
            </div>
            <p className="detail-label">Catch phrase</p>
            <p className="detail-quote">{data.catch_phrase || 'No catch phrase yet.'}</p>
          </div>
        </div>
      </div>

      <div className="detail-actions">
        <Link className="button secondary" to={`/edit/${data._id}`}>Edit hero</Link>
        <button className="button danger" onClick={() => setShowDelete(true)}>Delete hero</button>
      </div>

      {showDelete && (
        <ConfirmModal
          title="Delete hero"
          description="This action will remove the hero and all images. This cannot be undone."
          onCancel={() => setShowDelete(false)}
          onConfirm={() => deleteMutation.mutate()}
        />
      )}
    </div>
  );
};
