import styles from './ActivePage.module.css';


/* Main Menu Components */
import HomePage from './HomePage/HomePage';
import ReadPage from './ReadPage/ReadPage';
import ComingSoonPage from './ComingSoonPage/ComingSoonPage';
import PhotosPage from './PhotosPage/PhotosPage';
import AskForm from './AskForm/AskForm';
import SubscriptionForm from './SubscriptionForm/SubscriptionForm';
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
import AdForm from './AdForm/AdForm';
import ErrorReportForm from './ErrorReportForm/ErrorReportForm';

import LoginPage from './LoginPage/LoginPage';

export default function ActivePage({ pageId }) {
    return (
        <div className={styles.container}>
            {pageId === 1 && <HomePage />}
            {pageId === 2 && <ReadPage />}
            {pageId === 3 && <ListenPage />}
            {pageId === 4 && <SubscriptionForm />}
            {pageId === 5 && <AskForm />}
            {pageId === 6 && <PhotosPage />}
            {pageId === 7 && <ContributePage />}

            {pageId === 8 && <Thirumaligai />}
            {pageId === 9 && <TrustPage />}
            {pageId === 10 && <StaffPage />}

            {pageId === 11 && <ThaniyanPage />}
            {pageId === 12 && <EventsPage />}

            {pageId === 13 && <AdForm />}
            {pageId === 14 && <ErrorReportForm />}

            {pageId === 0 && <LoginPage />}
        </div>
    );
}
