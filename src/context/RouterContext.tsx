import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface RouterContextType {
  currentPath: string;
  path: string;
  navigate: (to: string) => void;
  params: Record<string, string>;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Read current pathname, or fallback to hash if hosted in environments that prefer hash
  const getInitialPath = () => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash && hash.startsWith('/')) {
        return hash;
      }
      return window.location.pathname || '/';
    }
    return '/';
  };

  const [currentPath, setCurrentPath] = useState<string>(getInitialPath);

  const navigate = useCallback((to: string) => {
    if (typeof window !== 'undefined') {
      // We push state and also update hash for foolproof iframe sandbox compatibility
      try {
        window.history.pushState({}, '', to);
      } catch (e) {
        // Fallback for strict iframe origin sandbox
        window.location.hash = to;
      }
      setCurrentPath(to);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && hash.startsWith('/')) {
        setCurrentPath(hash);
      } else {
        setCurrentPath(window.location.pathname || '/');
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Simple parameter extractor
  const params: Record<string, string> = {};
  const segments = currentPath.split('/').filter(Boolean);

  // e.g. /dashboard/products/:id
  if (segments[0] === 'dashboard' && segments[1] === 'products' && segments[2] && segments[2] !== 'new') {
    params.productId = segments[2];
  }
  // e.g. /dashboard/orders/:id
  if (segments[0] === 'dashboard' && segments[1] === 'orders' && segments[2]) {
    params.orderId = segments[2];
  }
  // e.g. /dashboard/catalogues/:id
  if (segments[0] === 'dashboard' && segments[1] === 'catalogues' && segments[2] && segments[2] !== 'new') {
    params.catalogueId = segments[2];
  }
  // e.g. /dashboard/customers/:id
  if (segments[0] === 'dashboard' && segments[1] === 'customers' && segments[2]) {
    params.customerId = segments[2];
  }
  // e.g. /store/:storeSlug/...
  if (segments[0] === 'store' && segments[1]) {
    params.storeSlug = segments[1];
    params.tenantSlug = segments[1];
    if (segments[2] === 'product' && segments[3]) {
      params.productSlug = segments[3];
    }
    if (segments[2] === 'category' && segments[3]) {
      params.categorySlug = segments[3];
    }
    if (segments[2] === 'catalogue' && segments[3]) {
      params.catalogueSlug = segments[3];
    }
  }

  const normalizedPath = currentPath || '/';

  return (
    <RouterContext.Provider value={{ currentPath: normalizedPath, path: normalizedPath, navigate, params }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};

export const Link: React.FC<{
  to: string;
  className?: string;
  children: React.ReactNode;
  id?: string;
  onClick?: () => void;
}> = ({ to, className, children, id, onClick }) => {
  const { navigate } = useRouter();
  return (
    <a
      id={id}
      href={to}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        if (onClick) onClick();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
};
