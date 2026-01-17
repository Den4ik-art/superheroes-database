import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createSuperhero, uploadHeroImage } from '../api/superheroes.api';
import { HeroForm } from '../components/HeroForm';

export const HeroCreate = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const next = files.map((file) => URL.createObjectURL(file));
    setPreviews(next);
    return () => {
      next.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const mutation = useMutation({
    mutationFn: createSuperhero,
    onSuccess: async (hero) => {
      for (const file of files) {
        await uploadHeroImage(hero._id, file);
      }
      await queryClient.invalidateQueries({ queryKey: ['superheroes'] });
      navigate(`/heroes/${hero._id}`);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Unable to create hero.';
      setErrorMessage(message);
    }
  });

  return (
    <div className="hero-editor">
      <div className="hero-editor__header">
        <div>
          <h2 className="hero-editor__title">Add New Hero</h2>
          <p className="hero-editor__subtitle">Expand the legend. Upload details and images.</p>
        </div>
      </div>

      <div className="hero-editor__grid">
        <section className="hero-editor__panel">
          <h3 className="hero-editor__panel-title">Hero Profile</h3>
          <HeroForm onSubmit={(data) => { setErrorMessage(''); mutation.mutate(data); }} submitLabel="Create hero" />
          {errorMessage && <p className="helper">{errorMessage}</p>}
        </section>

        <section className="hero-editor__panel hero-editor__panel--media">
          <div className="hero-editor__panel-header">
            <h3 className="hero-editor__panel-title">Hero Images</h3>
            <p className="helper">The first image becomes the primary one.</p>
          </div>
          <div className="upload-drop">
            <input
              className="upload-drop__input"
              type="file"
              multiple
              accept="image/*"
              aria-label="Upload hero images"
              onChange={(event) => setFiles(Array.from(event.target.files || []))}
            />
            <div className="upload-drop__content">
              <strong>Drag and drop main image here</strong>
              <span className="helper">or click to upload (landscape preferred)</span>
            </div>
          </div>
          {previews.length > 0 && (
            <div className="hero-editor__gallery">
              {previews.map((src, index) => (
                <div className="hero-editor__gallery-item" key={`${src}-${index}`}>
                  <img src={src} alt="Selected upload" />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
