import styles from "../styles/Footer.module.css";

const Footer = () => {
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

					<div className={styles.newsletter}>
						<div className={styles.colTitle}>தொடர்பு கொள்ள:</div>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								// Placeholder: wire this to real newsletter backend
								const form = e.currentTarget;
								const email = form.elements["email"].value;
								// minimal client-side validation
								if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
													alert("Please enter a valid email address.");
									return;
								}
								// Simulate success
													alert(`Thanks — we'll send updates to ${email}`);
								form.reset();
							}}
						>
							<label htmlFor="footer-email" className="sr-only">
								Email address
							</label>
							<div className={styles.formRow}>
								<input
									id="footer-email"
									name="email"
									className={styles.input}
									type="email"
									placeholder="abc@xyz.com"
									aria-label="Email address"
									required
								/>
								<button className={styles.btn} type="submit">Subscribe</button>
							</div>
						</form>
					</div>
				</div>

				<div>
					<div className={styles.grid}>
						<div>
							<div className={styles.colTitle}>About</div>
							<ul className={styles.linkList}>
								<li><a className={styles.link} href="#">திருமாளிகை</a></li>
								<li><a className={styles.link} href="#">அறக்கட்டளை</a></li>
								<li><a className={styles.link} href="#">இந்த முயற்சி</a></li>
								<li><a className={styles.link} href="#">நிர்வாகக் குழு</a></li>
							</ul>
						</div>

						<div>
							<div className={styles.colTitle}>Resources</div>
							<ul className={styles.linkList}>
								<li><a className={styles.link} href="#">குருபரம்பரை தனியன்கள்</a></li>
								<li><a className={styles.link} href="#">திருக்கடிகை உற்சவங்கள்</a></li>
								<li><a className={styles.link} href="#">இனிவரும் நிகழ்வுகள்</a></li>
								<li><a className={styles.link} href="#">கேள்வி-பதில்</a></li>
							</ul>
						</div>

						<div>
							<div className={styles.colTitle}>Contact</div>
							<ul className={styles.linkList}>
								<li><a className={styles.link} href="mailto:editor@chandamarutham.org">editor@chandamarutham.org</a></li>
								<li><a className={styles.link} href="#">Advertise</a></li>
								<li><a className={styles.link} href="#">Report an error</a></li>
							</ul>
						</div>
					</div>

					<div className={styles.bottom}>
						<div className={styles.copyright}>© {new Date().getFullYear()} Chandamarutham Magazine — All rights reserved.</div>

						<div className={styles.socials} aria-label="Social links">
							<a className={styles.socialLink} href="#" aria-label="Twitter">
								<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
									<path d="M20 7.5c-.6.3-1.2.4-1.9.5.7-.4 1.2-1 1.5-1.7-.6.4-1.4.7-2.1.9-.6-.6-1.4-1-2.3-1-1.8 0-3.3 1.6-3.3 3.5 0 .3 0 .7.1 1C9.6 10.4 7.7 9.2 6.4 7.6c-.4.6-.6 1.3-.6 2.1 0 1.4.8 2.7 2 3.4-.5 0-1-.2-1.5-.4 0 1.9 1.5 3.5 3.4 3.8-.4.1-.9.1-1.3.1-.3 0-.6 0-.9-.1.6 1.8 2.4 3.1 4.5 3.1-1.6 1.2-3.5 1.9-5.6 1.9-.4 0-.8 0-1.2-.1C5.6 20.9 8.3 22 11.2 22c6.7 0 10.4-5.7 10.4-10.6v-.5c.7-.5 1.2-1.2 1.6-2z" fill="currentColor"/>
								</svg>
							</a>
							<a className={styles.socialLink} href="#" aria-label="Facebook">
								<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
									<path d="M13 22v-8h2.7l.4-3H13V9.2c0-.9.2-1.5 1.6-1.5H16V5.2c-.3 0-1.3-.1-2.6-.1-2.6 0-4.3 1.6-4.3 4.6V11h-2v3h2v8h3z" fill="currentColor"/>
								</svg>
							</a>
							<a className={styles.socialLink} href="#" aria-label="LinkedIn">
								<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
									<path d="M4.98 3.5C4.98 4.6 4.06 5.5 2.95 5.5 1.85 5.5.93 4.6.93 3.5.93 2.4 1.85 1.5 2.95 1.5c1.1 0 2.03.9 2.03 2zm.02 4.5H1v13h4V8zM8 8h3.8v1.9h.1c.5-1 1.7-2 3.5-2 3.8 0 4.5 2.4 4.5 5.5V21h-4v-6.2c0-1.5 0-3.4-2.1-3.4-2.1 0-2.4 1.6-2.4 3.2V21H8V8z" fill="currentColor"/>
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

