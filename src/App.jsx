import './App.css';

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Header from './Header/Header';
import MainMenu from './MainMenu/MainMenu';
import PhotoStack from './PhotoStack/PhotoStack';
import ActivePage from './ActivePage/ActivePage';
import Footer from './Footer/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import { topMenuItems } from './MainMenu/MenuData';
import { footerMenuList } from './Footer/FooterMenuData';

function App() {
  const isAuthenticated = false;  // Later on we will bring back the logic to have the admin login
  // Right now the focus is on unauthenticated users submitting forms

  // admin/public split applies to top menu items only
  // exclude items with show === 'never' (admin microsite) from regular routing
  const visibleTopMenu = topMenuItems.filter(i => i.show !== 'never');
  const adminRoutes = visibleTopMenu.filter(i => String(i.show).includes('admin'));
  const publicRoutes = visibleTopMenu.filter(i => !String(i.show).includes('admin'));
  const routesToRender = isAuthenticated ? adminRoutes : publicRoutes;

  // footer routes are independent of admin rules; register only internal footer items
  const footerRoutes = footerMenuList.filter(i => i.type === 'internal');

  // default redirect depending on auth state
  const defaultPath = isAuthenticated ? '/admin' : '/';

  return (
    <BrowserRouter>
      <Header />
      <MainMenu />
      <PhotoStack />
      <Routes>
        {routesToRender.map((item) => (
          <Route
            key={item.code ?? item.href}
            path={item.href}
            element={
              String(item.show).includes('admin')
                ? (
                  <ProtectedRoute>
                    <ActivePage pageId={item.code} />
                  </ProtectedRoute>
                )
                : <ActivePage pageId={item.code} />
            }
          />
        ))}

        {footerRoutes.map((item) => (
          <Route
            key={item.code ?? item.href}
            path={item.href}
            element={<ActivePage pageId={item.code} />}
          />
        ))}

        {/* admin login (microsite) is intentionally unlisted in the top menu (show === 'never')
            but must be registered so ProtectedRoute can redirect to it */}
        <Route path="/admin" element={<ActivePage pageId={0} />} />

        {/* catch-all: redirect to appropriate default */}
        <Route path="*" element={<Navigate to={defaultPath} replace />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
