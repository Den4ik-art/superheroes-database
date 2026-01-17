import React from 'react';

type Props = {
  page: number;
  total: number;
  limit: number;
  onChange: (page: number) => void;
};

export const Pagination = ({ page, total, limit, onChange }: Props) => {
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="pagination">
      <button className="button secondary" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        Prev
      </button>
      <span>{page} / {totalPages || 1}</span>
      <button className="button secondary" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        Next
      </button>
    </div>
  );
};
