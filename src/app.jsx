import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ToastContainer } from 'react-toastify';
import { GoogleOAuthProvider } from '@react-oauth/google';

import ErrorBoundary from 'components/error-boundry';
import HighLevelHotKeys from 'components/high-level-hot-keys';

import Router from './routes';
import { AuthContextProvider } from './context/auth-context';
import { AppContextProvider } from './context/app-context';
import { ModeProvider } from './context/dark-mode';
import 'react-toastify/dist/ReactToastify.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { envObject } from './constants/environmental';
import { CaptureContextProvider } from './context/capture-context';
import { SessionProvider, useSession } from './context/modal-context';
import SessionModal from './components/session-modal';

const queryClient = new QueryClient();

const AppContent = () => {
  const { isSessionExpired } = useSession();

  return (
    <>
      <ToastContainer
        position="top-center"
        className="toast-container"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <HighLevelHotKeys>
        <Router />
      </HighLevelHotKeys>
      <SessionModal open={isSessionExpired} />
    </>
  );
};

const App = () => {
  return (
    <>
      <ErrorBoundary>
        <GoogleOAuthProvider clientId={envObject.GOOGLE_LOGIN_CLIENT_ID}>
          <BrowserRouter>
            <QueryClientProvider client={queryClient}>
              <AuthContextProvider>
                <AppContextProvider>
                  <ModeProvider>
                    <CaptureContextProvider>
                      <SessionProvider>
                        <AppContent />
                      </SessionProvider>
                    </CaptureContextProvider>
                  </ModeProvider>
                </AppContextProvider>
              </AuthContextProvider>
              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
          </BrowserRouter>
        </GoogleOAuthProvider>
      </ErrorBoundary>
    </>
  );
};

export default App;
