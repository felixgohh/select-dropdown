import React, { createContext, useContext, useEffect, useState } from 'react';

const PortalContext = createContext();

export const PortalProvider = ({ children }) => {
  const [portalElement, setPortalElement] = useState(null);

  useEffect(() => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    setPortalElement(el);

    return () => {
      document.body.removeChild(el);
    };
  }, []);

  return (
    <PortalContext.Provider value={portalElement}>
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = () => {
  return useContext(PortalContext);
};
