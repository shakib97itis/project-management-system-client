import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import {RouterProvider} from 'react-router-dom';
import {router} from './app/router';

import {QueryClientProvider} from '@tanstack/react-query';
import {queryClient} from './app/queryClient';

import {AuthProvider} from './auth/AuthProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
