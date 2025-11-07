import styles from "./Footer.module.css";
import FooterLinks from "./FooterLinks";
import { footerMenu1Items, footerMenu2Items, footerMenu3Items } from "./FooterMenuData";


const Footer = ({ menuChanger }) => {
	return (
		<footer className={styles.footer} aria-labelledby="footer-heading">
			<div className={styles.footerTitle}>
				<span className={styles.logoImage}>
					<img src="/ramanuja.svg" alt="Sri Ramanuja"  />
				</span>
				<span className={styles.brand}>
					<p>சண்டமாருதம்</p>
					<p className={styles.tagline}>ஶ்ரீவைஷ்ணவத்தைப் பற்றிய பத்திரிகை.</p>
				</span>
			</div>
			<div className={styles.inner}>
				<FooterLinks
					title="About us"
					listOfLinks={footerMenu1Items}
					menuChanger={menuChanger}
				/>
				<FooterLinks
					title="Resources"
					listOfLinks={footerMenu2Items}
					menuChanger={menuChanger}
				/>
				<FooterLinks
					title="Contact us"
					listOfLinks={footerMenu3Items}
					menuChanger={menuChanger}
				/>
			</div>




			<div className={styles.copyright}>© {new Date().getFullYear()} Chandamarutham Magazine — All rights reserved.</div>

		</footer>
	);
};

export default Footer;

