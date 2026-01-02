import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { GlobalAddToolProvider, useGlobalAddTool } from '../contexts/GlobalAddToolContext';
import GlobalAddToolModal from '../components/GlobalAddToolModal';
import Toast from '../components/Toast';

function AppContent({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  return (
    <>
      <style jsx global>{`
        /* Custom scrollbar styling - same as modal windows */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #fbbf24, #7c3aed);
          border-radius: 4px;
          border: 1px solid rgba(251, 191, 36, 0.3);
        }
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #7c3aed, #fbbf24);
          border: 1px solid rgba(124, 58, 237, 0.3);
        }
        ::-webkit-scrollbar-thumb:active {
          background: linear-gradient(135deg, #f59e0b, #d97706);
        }
      `}</style>
      <Component {...pageProps} router={router} />
    </>
  );
}

function AppWithGlobalModal({ Component, pageProps, router }: AppProps) {
  const { toast, setToast, isAddToolModalOpen, closeAddToolModal, handleSaveTool } = useGlobalAddTool();
  
  return (
    <>
      <AppContent Component={Component} pageProps={pageProps} router={router} />
      {/* Global Add Tool Modal */}
      <GlobalAddToolModal 
        isOpen={isAddToolModalOpen}
        onClose={closeAddToolModal}
        onSaveTool={handleSaveTool}
      />
      {/* Global Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <GlobalAddToolProvider>
      <AppWithGlobalModal Component={Component} pageProps={pageProps} router={router} />
    </GlobalAddToolProvider>
  );
}