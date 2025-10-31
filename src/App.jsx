import { useState } from 'react';
import './App.css';
import Banner from './components/Banner';
import MagazineTitle from './components/MagazineTitle';
import MainMenu from './components/MainMenu';
import HomeStack from './components/HomeStack';
import Footer from './components/Footer';
import HomeContent from './components/HomeContent';
import SubscriptionForm from './components/SubscriptionForm';
import StaffInfo from './components/StaffInfo';
import Thirumaligai from './components/Thirumaligai';
import Trust from './components/Trust';
import Thaniyans from './components/Thaniyans';
import ComingSoon from './components/ComingSoon';
import AskForm from './components/AskForm';
import ReadMagazine from './components/ReadMagazine';
import UpcomingEvents from './components/UpcomingEvents';
import AdForm from './components/AdForm';
import ErrorReport from './components/ErrorReport';

function App() {
  const [activeMenuItem, setActiveMenuItem] = useState(1);

  return (
    <>
      <Banner />
      <MagazineTitle />
      <MainMenu menuChanger={setActiveMenuItem} />
      <HomeStack />
      <div className="textContent">
        {activeMenuItem === 1 && <HomeContent />}
        {activeMenuItem === 2 && <ReadMagazine />}
        {activeMenuItem === 3 && <ComingSoon />}
        {activeMenuItem === 4 && <AskForm />}
        {activeMenuItem === 5 && <SubscriptionForm />}
        {activeMenuItem === 6 && <Thirumaligai />}
        {activeMenuItem === 7 && <Trust />}
        {activeMenuItem === 9 && <StaffInfo />}
        {activeMenuItem === 10 && <Thaniyans />}
        {activeMenuItem === 11 && <UpcomingEvents />}
        {activeMenuItem === 12 && <AdForm />}
        {activeMenuItem === 13 && <ErrorReport />}
      </div>

      <Footer menuChanger={setActiveMenuItem} />
    </>
  );
}

export default App;
