import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getSuperheroes } from '../api/superheroes.api';
import { HeroCard } from '../components/HeroCard';
import { Pagination } from '../components/Pagination';

const PAGE_LIMIT = 5;

export const HeroList = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const navigate = useNavigate();
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['superheroes', page, debouncedSearch],
    queryFn: () => getSuperheroes(page, PAGE_LIMIT, debouncedSearch)
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="page-card loading-card">
        <div className="spinner" />
        <p>Loading heroes...</p>
      </div>
    );
  }

  const heroes = data?.data ?? [];

  return (
    <div className="details-layout">
      <div className="roster-toolbar">
        <div className="roster-header">
          <h2>Hero Roster <span>(Page {data?.page})</span></h2>
        </div>
        <div className="roster-search">
          <input
            type="search"
            placeholder="Search by nickname or real name"
            value={search}
            onChange={(event) => handleSearchChange(event.target.value)}
          />
          {isFetching && <span className="spinner spinner--sm" aria-hidden="true" />}
          {search && (
            <button className="button ghost" type="button" onClick={() => handleSearchChange('')}>
              Clear
            </button>
          )}
        </div>
      </div>
      {heroes.length === 0 ? (
        <div className="page-card empty-state">
          <h3>No heroes found</h3>
          <p>{search ? 'Try a different search term.' : 'Start by adding your first superhero profile.'}</p>
        </div>
      ) : (
        <>
          <div className="hero-grid">
            {heroes.map((hero) => (
              <HeroCard key={hero._id} hero={hero} onView={(id) => navigate(`/heroes/${id}`)} />
            ))}
          </div>
          {data && (
            <Pagination page={data.page} total={data.total} limit={data.limit} onChange={setPage} />
          )}
        </>
      )}
    </div>
  );
};
