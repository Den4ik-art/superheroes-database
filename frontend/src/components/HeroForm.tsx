import React, { useState } from 'react';
import type { Superhero } from '../types/superhero';

type Props = {
  initial?: Partial<Superhero>;
  onSubmit: (data: Omit<Superhero, '_id'>) => void;
  submitLabel?: string;
};

export const HeroForm = ({ initial, onSubmit, submitLabel = 'Save hero' }: Props) => {
  const [nickname, setNickname] = useState(initial?.nickname || '');
  const [realName, setRealName] = useState(initial?.real_name || '');
  const [originDescription, setOriginDescription] = useState(initial?.origin_description || '');
  const [superpowers, setSuperpowers] = useState((initial?.superpowers || []).join(', '));
  const [catchPhrase, setCatchPhrase] = useState(initial?.catch_phrase || '');
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!nickname.trim() || !realName.trim()) {
      setError('Nickname and real name are required.');
      return;
    }
    setError('');
    onSubmit({
      nickname: nickname.trim(),
      real_name: realName.trim(),
      origin_description: originDescription.trim(),
      superpowers: superpowers
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean),
      catch_phrase: catchPhrase.trim()
    });
  };

  return (
    <form className="form-grid hero-form" onSubmit={handleSubmit}>
      <div>
        <label>Nickname</label>
        <input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Stormbreaker" />
      </div>
      <div>
        <label>Real name</label>
        <input value={realName} onChange={(e) => setRealName(e.target.value)} placeholder="Jane Rook" />
      </div>
      <div>
        <label>Origin story</label>
        <textarea value={originDescription} onChange={(e) => setOriginDescription(e.target.value)} />
      </div>
      <div>
        <label>Superpowers (comma separated)</label>
        <input value={superpowers} onChange={(e) => setSuperpowers(e.target.value)} />
      </div>
      <div>
        <label>Catch phrase</label>
        <input value={catchPhrase} onChange={(e) => setCatchPhrase(e.target.value)} />
      </div>
      {error && <div className="helper">{error}</div>}
      <button className="button" type="submit">{submitLabel}</button>
    </form>
  );
};
