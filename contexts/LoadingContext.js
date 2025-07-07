import { createContext, useContext, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';

const Mosaic = dynamic(
  () => import('react-loading-indicators').then((mod) => mod.Mosaic),
  { ssr: false }
);

const LoadingContext = createContext({});

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [loadingKey, setLoadingKey] = useState(0);

  const showLoading = useCallback((text = '') => {
    setLoading(true);
    setLoadingText(text);
    setLoadingKey(prev => prev + 1);
  }, []);

  const hideLoading = useCallback(() => {
    setLoading(false);
    setLoadingText('');
  }, []);

  const LoadingOverlay = () => (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-busy={loading}
    >
      <div className="text-center">
        <Mosaic 
          color="#32cd32" 
          size="medium" 
          text={loadingText} 
          textColor="#ffffff" 
        />
      </div>
    </div>
  );

  return (
    <LoadingContext.Provider value={{ loading, showLoading, hideLoading }}>
      {children}
      {loading && <LoadingOverlay key={loadingKey} />}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};
