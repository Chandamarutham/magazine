import { faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

/* Footer First Column Items */
export const footerMenu1Items = [
    { name: 'திருமாளிகை', code: 8, type: 'internal', icon: null, href: '/thirumaligai' },
    { name: 'அறக்கட்டளை', code: 9, type: 'internal', icon: null, href: '/trust' },
    { name: 'நிர்வாகக் குழு', code: 10, type: 'internal', icon: null, href: '/team' },
];

/* Footer Second Column Items */
export const footerMenu2Items = [
    { name: 'குருபரம்பரா தனியன்கள்', code: 11, type: 'internal', icon: null, href: '/thaniyans' },
    { name: 'திருக்கடிகை உற்சவங்கள்', code: 12, type: 'internal', icon: null, href: '/events' },
];

/* Footer Third Column Items */
export const footerMenu3Items = [
    { name: 'Write to us', code: 'mailto:editor@kkcp.chandamarutham.org', type: 'href', icon: faEnvelope, href: 'mail' },
    { name: 'Advertise', code: 13, type: 'internal', icon: null, href: '/advertise' },
    { name: 'Report  Error', code: 14, type: 'internal', icon: null, href: '/report-error' },
    { name: 'Facebook', code: 'https://www.facebook.com/share/19rFekfEtC/?mibextid=wwXIfr', type: 'href', icon: faFacebookF, href: 'fb' },
];

/* Commonly used to refer all three menus */
export const footerMenuList = [
    ...footerMenu1Items,
    ...footerMenu2Items,
    ...footerMenu3Items,
];
