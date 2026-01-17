import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteHeroImage, getSuperhero, resolveImageUrl, updateSuperhero, uploadHeroImage } from '../api/superheroes.api';
import { HeroForm } from '../components/HeroForm';
import type { SuperheroImage } from '../types/superhero';

export const HeroEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const next = files.map((file) => URL.createObjectURL(file));
    setPreviews(next);
    return () => {
      next.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const { data, isLoading } = useQuery({
    queryKey: ['superhero', id],
    queryFn: () => getSuperhero(id as string),
    enabled: Boolean(id)
  });

  const updateMutation = useMutation({
    mutationFn: (payload: { id: string; data: Parameters<typeof updateSuperhero>[1] }) =>
      updateSuperhero(payload.id, payload.data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['superheroes'] });
      await queryClient.invalidateQueries({ queryKey: ['superhero', id] });
      navigate(`/heroes/${id}`);
    }
  });

  const uploadMutation = useMutation({
    mutationFn: (payload: { id: string; file: File }) => uploadHeroImage(payload.id, payload.file),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['superhero', id] });
    }
  });

  const deleteImageMutation = useMutation({
    mutationFn: (payload: { id: string; imageId: string }) => deleteHeroImage(payload.id, payload.imageId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['superhero', id] });
    }
  });

  if (isLoading || !data || !id) {
    return (
      <div className="page-card loading-card">
        <div className="spinner" />
        <p>Loading hero...</p>
      </div>
    );
  }

  const handleUpload = async () => {
    for (const file of files) {
      await uploadMutation.mutateAsync({ id, file });
    }
    setFiles([]);
  };

  return (
    <div className="hero-editor">
      <div className="hero-editor__header">
        <div>
          <h2 className="hero-editor__title">Edit Hero</h2>
          <p className="hero-editor__subtitle">Refine the profile and manage the gallery.</p>
        </div>
      </div>

      <div className="hero-editor__grid">
        <section className="hero-editor__panel">
          <h3 className="hero-editor__panel-title">Hero Profile</h3>
          <HeroForm
            initial={data}
            onSubmit={(payload) => updateMutation.mutate({ id, data: payload })}
            submitLabel="Save changes"
          />
        </section>

        <section className="hero-editor__panel hero-editor__panel--media">
          <div className="hero-editor__panel-header">
            <h3 className="hero-editor__panel-title">Hero Images</h3>
            <p className="helper">Reorder by re-uploading. First image stays primary.</p>
          </div>

          {data.images && data.images.length > 0 ? (
            <div className="hero-editor__gallery">
            {data.images.map((image: SuperheroImage, index) => {
              const imageId = image._id;
              return (
                <div className="hero-editor__gallery-item" key={image.filename}>
                  <img src={resolveImageUrl(image.url)} alt={data.nickname} />
                  {imageId ? (
                    <button
                      className="hero-editor__gallery-action"
                      onClick={() => deleteImageMutation.mutate({ id, imageId })}
                      type="button"
                    >
                      Remove
                    </button>
                  ) : null}
                  {index === 0 && <span className="badge">Primary</span>}
                </div>
              );
            })}
            </div>
          ) : (
            <p className="helper">No images uploaded yet.</p>
          )}

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
              <strong>Drag and drop more images here</strong>
              <span className="helper">or click to upload new gallery shots</span>
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

          <div className="hero-editor__actions">
            <button className="button" type="button" onClick={handleUpload} disabled={files.length === 0}>
              Upload selected images
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
