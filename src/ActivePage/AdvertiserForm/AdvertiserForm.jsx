import { useState } from 'react';
import { SubmitForm } from '../../lib/SubmitForm';
import styles from './AdvertiserForm.module.css';

const apiEndpoint = 'https://6vzjagr1kh.execute-api.ap-south-1.amazonaws.com/production/advertise';

export default function AdvertiserForm() {
    const [formData, setFormData] = useState({
        email: '',
        company_name: '',
        contact_person_name: '',
        phone: '',
        website: '',
        business_type: '',
        advert_type: '',
        ad_place_preference: '',
        budget: '',
        reference: ''
    });

    const [errors, setErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);

    // Dropdown options
    const advertTypeOptions = [
        'Full Page',
        'Half Page',
        'Quarter Page',
        'Inserts/Flyers',
        'Sponsoring Content',
        'Online/Digital Ad',
        'Event based promotion'
    ];

    const adPlacePreferenceOptions = [
        'Full-page',
        'Half-page',
        'Back-cover',
        'Inside-cover near table of content',
        'Near centre-spread',
        'Specific type of articles'
    ];

    const budgetOptions = [
        'Below ₹10,000/-',
        '₹10,000/- to ₹25,000/-',
        '₹25,000/- to ₹50,000/-',
        '₹50,000/- to ₹1,00,000/-',
        'Above ₹1,00,000/-',
        'Prefer to discuss'
    ];

    const referenceOptions = [
        'Word of Mouth',
        'Social Media',
        'Online Search',
        'Existing Advertiser',
        'Event',
        'Other'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone) => {
        // Allow Indian phone number formats: 10 digits with optional +91, spaces, or dashes
        const phoneRegex = /^(\+91[\s-]?)?[6-9]\d{9}$/;
        const cleanPhone = phone.replace(/[\s-]/g, '');
        return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
    };

    const validateWebsite = (url) => {
        if (!url) return true; // Optional field
        try {
            new URL(url.startsWith('http') ? url : `https://${url}`);
            return true;
        } catch {
            return false;
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Mandatory field validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.company_name.trim()) {
            newErrors.company_name = 'Company name is required';
        }

        if (!formData.contact_person_name.trim()) {
            newErrors.contact_person_name = 'Contact person name is required';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!validatePhone(formData.phone)) {
            newErrors.phone = 'Please enter a valid Indian phone number';
        }

        if (!formData.business_type.trim()) {
            newErrors.business_type = 'Business type is required';
        }

        // Optional field validation
        if (formData.website && !validateWebsite(formData.website)) {
            newErrors.website = 'Please enter a valid website URL';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setFormData({
            email: '',
            company_name: '',
            contact_person_name: '',
            phone: '',
            website: '',
            business_type: '',
            advert_type: '',
            ad_place_preference: '',
            budget: '',
            reference: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return; // Do not submit if validation fails!
        }
        try {
            const response = await SubmitForm(formData, apiEndpoint);
            if (response.ok) {
                setShowSuccess(true);  // If you want the success message to show
                resetForm();           // Optionally clear the form here on success
            }
        } catch (err) {
            console.error('Form submission error:', err);
        }
    };

    const handleReset = () => {
        resetForm();
        setErrors({});
        setShowSuccess(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                <h1 className={styles.title}>Advertise With Us</h1>
                <p className={styles.subtitle}>
                    Join our community of advertisers and reach thousands of engaged readers.
                    Fill out this form to get started with your advertising campaign.
                </p>

                {showSuccess && (
                    <div className={styles.successMessage}>
                        <p>Thank you for your interest in advertising with us! We've received your information and will contact you within 1-2 business days to discuss your advertising needs.</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* Contact Information Section */}
                    <fieldset className={styles.fieldset}>
                        <legend className={styles.legend}>Contact Information</legend>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="email" className={styles.label}>
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="your@email.com"
                                    className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                                />
                                {errors.email && <span className={styles.error}>{errors.email}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="phone" className={styles.label}>
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="+91 98765 43210"
                                    className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                                />
                                {errors.phone && <span className={styles.error}>{errors.phone}</span>}
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="company_name" className={styles.label}>
                                    Company Name *
                                </label>
                                <input
                                    type="text"
                                    id="company_name"
                                    name="company_name"
                                    value={formData.company_name}
                                    onChange={handleInputChange}
                                    placeholder="Your Company Name"
                                    className={`${styles.input} ${errors.company_name ? styles.inputError : ''}`}
                                />
                                {errors.company_name && <span className={styles.error}>{errors.company_name}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="contact_person_name" className={styles.label}>
                                    Contact Person *
                                </label>
                                <input
                                    type="text"
                                    id="contact_person_name"
                                    name="contact_person_name"
                                    value={formData.contact_person_name}
                                    onChange={handleInputChange}
                                    placeholder="Contact person's full name"
                                    className={`${styles.input} ${errors.contact_person_name ? styles.inputError : ''}`}
                                />
                                {errors.contact_person_name && <span className={styles.error}>{errors.contact_person_name}</span>}
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="business_type" className={styles.label}>
                                    Business Type *
                                </label>
                                <input
                                    type="text"
                                    id="business_type"
                                    name="business_type"
                                    value={formData.business_type}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Retail, Technology, Healthcare"
                                    className={`${styles.input} ${errors.business_type ? styles.inputError : ''}`}
                                />
                                {errors.business_type && <span className={styles.error}>{errors.business_type}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="website" className={styles.label}>
                                    Website (Optional)
                                </label>
                                <input
                                    type="url"
                                    id="website"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleInputChange}
                                    placeholder="www.yourwebsite.com"
                                    className={`${styles.input} ${errors.website ? styles.inputError : ''}`}
                                />
                                {errors.website && <span className={styles.error}>{errors.website}</span>}
                            </div>
                        </div>
                    </fieldset>

                    {/* Advertisement Preferences Section */}
                    <fieldset className={styles.fieldset}>
                        <legend className={styles.legend}>Advertisement Preferences</legend>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="advertType" className={styles.label}>
                                    Advertisement Type (Optional)
                                </label>
                                <select
                                    id="advertType"
                                    name="advertType"
                                    value={formData.advert_type}
                                    onChange={handleInputChange}
                                    className={styles.select}
                                >
                                    <option value="">Select advertisement type</option>
                                    {advertTypeOptions.map((option, index) => (
                                        <option key={index} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="adPlacePreference" className={styles.label}>
                                    Placement Preference (Optional)
                                </label>
                                <select
                                    id="adPlacePreference"
                                    name="adPlacePreference"
                                    value={formData.adPlacePreference}
                                    onChange={handleInputChange}
                                    className={styles.select}
                                >
                                    <option value="">Select placement preference</option>
                                    {adPlacePreferenceOptions.map((option, index) => (
                                        <option key={index} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="budget" className={styles.label}>
                                    Budget Range (Optional)
                                </label>
                                <select
                                    id="budget"
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleInputChange}
                                    className={styles.select}
                                >
                                    <option value="">Select budget range</option>
                                    {budgetOptions.map((option, index) => (
                                        <option key={index} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="reference" className={styles.label}>
                                    How did you hear about us? (Optional)
                                </label>
                                <select
                                    id="reference"
                                    name="reference"
                                    value={formData.reference}
                                    onChange={handleInputChange}
                                    className={styles.select}
                                >
                                    <option value="">Select reference source</option>
                                    {referenceOptions.map((option, index) => (
                                        <option key={index} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </fieldset>

                    <div className={styles.buttonGroup}>
                        <button
                            type="submit"
                            className={styles.submitButton}
                        >
                            Submit
                        </button>

                        <button
                            type="button"
                            onClick={handleReset}
                            className={styles.resetButton}
                        >
                            Clear Form
                        </button>
                    </div>

                    <p className={styles.requiredNote}>
                        * Required fields
                    </p>
                </form>
            </div>
        </div>
    );
}