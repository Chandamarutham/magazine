import styles from "../styles/Footer.module.css";

const Footer = ({ menuChanger }) => {
	const footerMenu1 = [
		{ name: 'திருமாளிகை', href: '#', code: 6 },
		{ name: 'அறக்கட்டளை', href: '#', code: 7 },
		{ name: 'நிர்வாகக் குழு', href: '#', code: 9 }
	];

	const footerMenu2 = [
		{ name: 'குருபரம்பரை தனியன்கள்', href: '#', code: 10 },
		{ name: 'திருக்கடிகை உற்சவங்கள்', href: '#', code: 11 }
	];

	const footerMenu3 = [
		{ name: 'Advertise', href: '#', code: 12 },
		{ name: 'Report an error', href: '#', code: 13 }
	];

	const handleFooterItemClick = (itemCode) => {
		menuChanger(itemCode);
	};

	return (
		<footer className={styles.footer} aria-labelledby="footer-heading">
			<div className={styles.inner}>
				<div className={styles.brand}>
					<div className={styles.logo}>
						<svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
							<rect width="24" height="24" rx="6" fill="#38bdf8" />
							<path d="M7 12h10" stroke="#042024" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
						<span>சண்டமாருதம்</span>
					</div>
					<p className={styles.tagline} id="footer-heading">
						ஶ்ரீவைஷ்ணவத்தைப் பற்றிய பத்திரிகை.
					</p>


				</div>

				<div>
					<div className={styles.grid}>
						<div>
							<div className={styles.colTitle}>About</div>
							<ul className={styles.linkList}>
								{footerMenu1.map((item) => (
									<li key={item.name}>
										<a
											className={styles.link}
											href={item.href}
											onClick={() => handleFooterItemClick(item.code)}
										>
											{item.name}
										</a>
									</li>
								))}
							</ul>
						</div>

						<div>
							<div className={styles.colTitle}>Resources</div>
							<ul className={styles.linkList}>
								{footerMenu2.map((item) => (
									<li key={item.name}>
										<a
											className={styles.link}
											href={item.href}
											onClick={() => handleFooterItemClick(item.code)}
										>
											{item.name}
										</a>
									</li>
								))}
							</ul>
						</div>

						<div>
							<div className={styles.colTitle}>Contact</div>
							<ul className={styles.linkList}>
								<li><a className={styles.link} href="mailto:editor@kkcp.chandamarutham.org">editor@kkcp.chandamarutham.org</a></li>
								{footerMenu3.map((item) => (
									<li key={item.name}>
										<a
											className={styles.link}
											href={item.href}
											onClick={() => handleFooterItemClick(item.code)}
										>
											{item.name}
										</a>
									</li>
								))}
							</ul>
						</div>
					</div>

					<div className={styles.bottom}>
						<div className={styles.copyright}>© {new Date().getFullYear()} Chandamarutham Magazine — All rights reserved.</div>

						<div className={styles.socials} aria-label="Social links">
							<a className={styles.socialLink} href="https://www.facebook.com/share/19rFekfEtC/?mibextid=wwXIfr" aria-label="Facebook">
								<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
									<path d="M13 22v-8h2.7l.4-3H13V9.2c0-.9.2-1.5 1.6-1.5H16V5.2c-.3 0-1.3-.1-2.6-.1-2.6 0-4.3 1.6-4.3 4.6V11h-2v3h2v8h3z" fill="currentColor" />
								</svg>
							</a>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;

