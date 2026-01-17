import React from 'react';

type Props = {
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export const ConfirmModal = ({ title, description, onCancel, onConfirm }: Props) => {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="modal-actions">
          <button className="button ghost" onClick={onCancel}>Cancel</button>
          <button className="button danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
};
