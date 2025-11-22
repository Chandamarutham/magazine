import { useCredentials } from '../lib/Credentials';
import styles from './ActivePage.module.css';


/* Main Menu Components */
import HomePage from './HomePage/HomePage';
import ReadPage from './ReadPage/ReadPage';
import PhotosPage from './PhotosPage/PhotosPage';
import QueryPage from './QueryPage/QueryForm';
import SubscribeForm from './SubscribePage/SubscribeForm';
import ListenPage from './ListenPage/ListenPage';
import ContributePage from './ContributePage/ContributePage';

/* Footer First Column Components */
import Thirumaligai from './ThirumaligaiPage/Thirumaligai';
import TrustPage from './TrustPage/TrustPage';
import StaffPage from './StaffPage/StaffPage';

/* Footer Second Column Components */
import ThaniyanPage from './ThaniyanPage/ThaniyanPage';
import EventsPage from './EventsPage/EventsPage';

/* Footer Third Column Components */
/*
import AdForm from './AdForm/AdForm';*/
import AdvertiserForm from './AdvertisePage/AdvertiseForm';
import FeedbackForm from './FeedbackPage/FeedbackForm';

/* Admin Page Components */
import LoginPage from './LoginPage/LoginPage';

export default function ActivePage({ pageId }) {
    const credentialsData = useCredentials();
    if (credentialsData.error) {
        return <div className={styles.error}>Error loading credentials: {credentialsData.error.message}</div>;
    }
    return (
        <div className={styles.container}>
            {pageId === 1 && <HomePage />}
            {pageId === 2 && <ReadPage />}
            {pageId === 3 && <ListenPage />}
            {pageId === 4 && <SubscribeForm getValidCredentials={credentialsData.getValidCredentials} />}
            {pageId === 5 && <QueryPage getValidCredentials={credentialsData.getValidCredentials} />}
            {pageId === 6 && <PhotosPage />}
            {pageId === 7 && <ContributePage />}

            {pageId === 8 && <Thirumaligai />}
            {pageId === 9 && <TrustPage />}
            {pageId === 10 && <StaffPage />}

            {pageId === 11 && <ThaniyanPage />}
            {pageId === 12 && <EventsPage />}

            {pageId === 13 && <AdvertiserForm getValidCredentials={credentialsData.getValidCredentials} />}
            {pageId === 14 && <FeedbackForm getValidCredentials={credentialsData.getValidCredentials} />}

            {pageId === 0 && <LoginPage />}
        </div>
    );
}
