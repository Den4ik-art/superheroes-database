import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { App } from '../App';
import { HeroList } from '../pages/HeroList';
import { HeroDetails } from '../pages/HeroDetails';
import { HeroCreate } from '../pages/HeroCreate';
import { HeroEdit } from '../pages/HeroEdit';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HeroList /> },
      { path: 'heroes/:id', element: <HeroDetails /> },
      { path: 'create', element: <HeroCreate /> },
      { path: 'edit/:id', element: <HeroEdit /> }
    ]
  }
]);
