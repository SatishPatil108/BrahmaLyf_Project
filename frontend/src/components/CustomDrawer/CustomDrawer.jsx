import React, { useEffect } from "react";
import { X } from "lucide-react";

const CustomDrawer = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  width = "800px",
  closeOnBackdrop = true,
}) => {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          bg-white dark:bg-gray-900 shadow-2xl`}
        style={{
          width: '90%',
          maxWidth: width,
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 rounded-full bg-gradient-to-b from-indigo-500 to-purple-600" />
            <div>
              <h2 
                id="drawer-title"
                className="text-xl font-bold text-gray-900 dark:text-gray-100"
              >
                {title}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Slide-out panel
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 
              text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300
              transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label="Close drawer"
          >
            <X size={24} className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ height: 'calc(100vh - 140px)' }}>
          <div className="space-y-6">
            {children}
          </div>
        </div>

        {/* Footer */}
        {footer && (
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 dark:border-gray-800 
            bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-4">
              {footer}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CustomDrawer;