import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const Portal = ({
  children,
  disablePortal = false,
  triggerRef,
  onClickOutside,
}) => {
  const [portalElement, setPortalElement] = useState(null);

  useEffect(() => {
    if (disablePortal) return;

    const el = document.createElement('div');
    document.body.appendChild(el);
    setPortalElement(el);

    return () => {
      if (el) {
        document.body.removeChild(el);
      }
    };
  }, [disablePortal, triggerRef]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target) &&
        (!portalElement || !portalElement.contains(event.target))
      ) {
        onClickOutside && onClickOutside();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClickOutside, portalElement, triggerRef]);

  const childrenComponent = () => {
    const parentRect = triggerRef.current?.getBoundingClientRect();
    const style = disablePortal
      ? { position: 'absolute', top: '50px', left: 0, width: '100%' }
      : {
          position: 'absolute',
          top: parentRect?.bottom + 5,
          left: parentRect?.left,
          width: parentRect?.width,
        };
    return <div style={style}>{children}</div>;
  };

  if (disablePortal) {
    return childrenComponent();
  }

  return portalElement
    ? ReactDOM.createPortal(childrenComponent(), portalElement)
    : null;
};

export default Portal;
