import { useState } from 'react';
import './App.css';

import Header from './Header/Header';
import MainMenu from './MainMenu/MainMenu';
import PhotoStack from './PhotoStack/PhotoStack';
import ActivePage from './ActivePage/ActivePage';
import Footer from './Footer/Footer';

function App() {
  const [activeMenuItem, setActiveMenuItem] = useState(1);

  return (
    <>
      <Header />
      <MainMenu menuChanger={setActiveMenuItem} />
      <PhotoStack />
      <ActivePage pageId={activeMenuItem} />
      <Footer menuChanger={setActiveMenuItem} />
    </>
  );
}

export default App;
