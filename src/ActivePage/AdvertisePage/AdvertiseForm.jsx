import { useState, useEffect } from 'react';
import { PostFormData } from '../../lib/PostFormData';
import {
    advertisementTypeOptions,
    adPlacePreferenceOptions,
    budgetIndicationOptions,
    referralSourceOptions
} from './FormData/AdvertiseFormData';
import styles from './AdvertiseForm.module.css';


const relative_url = "/advertise";


export default function AdvertiseForm({ getValidCredentials }) {
    const [formData, setFormData] = useState({
        email: "",
        advert_type: "",
        company_name: "",
        contact_person_name: "",
        phone_number: "",
        web_site: "",
        business_type: "",
        ad_place_preference: "",
        budget: "",
        referred_by: ""
    }); // Initial form data state
    const [errors, setErrors] = useState({}); // Validation errors for fields
    const [successMessage, setSuccessMessage] = useState("") // Success message after submission
    const [errorMessage, setErrorMessage] = useState("") // Error message after submission
    const [showSuccess, setShowSuccess] = useState(false); // Whether to show success message
    const [showError, setShowError] = useState(false); // Whether to show error message
    const [isSubmitting, setIsSubmitting] = useState(false); // Submission state

    /* Effect Section */
    // Nothing in this form

    /* Helpers Section */
    // Reset form fields to initial state
    const resetFormFields = () => {
        setFormData({
            email: "",
            advert_type: "",
            company_name: "",
            contact_person_name: "",
            phone_number: "",
            web_site: "",
            business_type: "",
            ad_place_preference: "",
            budget: "",
            referred_by: ""
        });
    };

    // Reset controlling states
    const resetControllingStates = () => {
        setErrors({});
        setShowSuccess(false);
        setSuccessMessage("");
        setShowError(false);
        setErrorMessage("");
        setIsSubmitting(false);
    };

    // Validate form fields
    const validateForm = () => {
        const newErrors = {};
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email address is invalid";
        }

        if (!formData.advert_type.trim()) {
            newErrors.advert_type = "Advertisement type is required";
        }

        if (!formData.company_name.trim()) {
            newErrors.company_name = "Company name is required";
        }

        if (!formData.contact_person_name.trim()) {
            newErrors.contact_person_name = "Contact person name is required";
        }

        if (!formData.phone_number.trim()) {
            newErrors.phone_number = "Phone number is required";
        }

        if (!formData.business_type.trim()) {
            newErrors.business_type = "Business type is required";
        }

        if (!formData.ad_place_preference.trim()) {
            newErrors.ad_place_preference = "Ad place preference is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle input changes
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

    // Handle form reset
    const handleReset = (e) => {
        e.preventDefault();
        resetFormFields();
        resetControllingStates();
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        resetControllingStates();
        setIsSubmitting(true);

        // Validate form before submission
        if (!validateForm()) {
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await PostFormData(
                relative_url,
                formData,
                getValidCredentials
            );
            if (!response.ok) {
                setShowError(true);
                if (response.status === 409) {
                    setErrorMessage("You are already registered.");
                } else {
                    setErrorMessage("Failed to submit request. Try again later.");
                }
                setTimeout(() => setShowError(false), 5000);
            } else {
                resetFormFields();
                setShowSuccess(true);
                setSuccessMessage("Thank you for your interest!");
                setTimeout(() => setShowSuccess(false), 5000);
            }
        } catch (error) {
            setShowError(true);
            setErrorMessage("Failed to submit form. Try again later.");
            setTimeout(() => setShowError(false), 5000);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.formBox}>
                <h2 className={styles.formTitle}>Advertise with Us</h2>
                <p className={styles.formSubtitle}>Reach a targeted audience by advertising in our magazine. Please fill out the form below and our team will get back to you with more details.</p>
                <form onSubmit={handleSubmit} className={styles.form}>

                    {/* Group #1: Advertising Interest */}
                    <fieldset className={styles.fieldset}>
                        <legend className={styles.legend}>Your Interests</legend>
                        {/* One row of two columns */}
                        <div className={styles.formRow}>
                            {/* Advertisement Type - takes options from imported data */}
                            <div className={styles.formGroup}>
                                <label htmlFor="advert_type" className={styles.label}>
                                    Advertisement Type *
                                </label>
                                <select
                                    id="advert_type"
                                    name="advert_type"
                                    value={formData.advert_type}
                                    onChange={handleInputChange}
                                    className={styles.select}
                                >
                                    <option className={styles.text} value="">-- Select Preference --</option>
                                    {advertisementTypeOptions.map((option, index) => (
                                        <option key={`advert_type_option_${index}`} className={styles.text} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                                {errors.advert_type && <span className={styles.error}>{errors.advert_type}</span>}
                            </div>
                            {/* Ad Place Preference - takes options from imported data */}
                            <div className={styles.formGroup}>
                                <label htmlFor="ad_place_preference" className={styles.label}>
                                    Ad Place Preference *
                                </label>
                                <select
                                    id="ad_place_preference"
                                    name="ad_place_preference"
                                    value={formData.ad_place_preference}
                                    onChange={handleInputChange}
                                    className={styles.select}
                                >
                                    <option className={styles.text} value="">-- Select Preference --</option>
                                    {adPlacePreferenceOptions.map((option, index) => (
                                        <option key={`ad_place_preference_option_${index}`} className={styles.text} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                                {errors.ad_place_preference && <span className={styles.error}>{errors.ad_place_preference}</span>}
                            </div>
                        </div>
                    </fieldset>
                    {/* Group #2: About the company */}
                    <fieldset className={styles.fieldset}>
                        <legend className={styles.legend}>About You</legend>
                        {/* One row of two columns */}
                        <div className={styles.formRow}>
                            {/* Company Name */}
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
                                    className={styles.input}
                                    placeholder="Enter your company name"
                                />
                                {errors.company_name && <span className={styles.error}>{errors.company_name}</span>}
                            </div>
                            {/* Business Type */}
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
                                    className={styles.input}
                                    placeholder="Enter your business type"
                                />
                                {errors.business_type && <span className={styles.error}>{errors.business_type}</span>}
                            </div>
                        </div>
                        {/* One row of two columns */}
                        <div className={styles.formRow}>
                            {/* Website */}
                            <div className={styles.formGroup}>
                                <label htmlFor="web_site" className={styles.label}>
                                    Website
                                </label>
                                <input
                                    type="text"
                                    id="web_site"
                                    name="web_site"
                                    value={formData.web_site}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    placeholder="Enter your website URL"
                                />
                            </div>
                            {/* Contact Person Name */}
                            <div className={styles.formGroup}>
                                <label htmlFor="contact_person_name" className={styles.label}>
                                    Contact Person Name *
                                </label>
                                <input
                                    type="text"
                                    id="contact_person_name"
                                    name="contact_person_name"
                                    value={formData.contact_person_name}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    placeholder="Enter contact person's name"
                                />
                                {errors.contact_person_name && <span className={styles.error}>{errors.contact_person_name}</span>}
                            </div>
                        </div>
                        {/* One row of two columns */}
                        <div className={styles.formRow}>
                            {/* Email */}
                            <div className={styles.formGroup}>
                                <label htmlFor="email" className={styles.label}>
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    placeholder="Enter your email address"
                                />
                                {errors.email && <span className={styles.error}>{errors.email}</span>}
                            </div>
                            {/* Phone Number */}
                            <div className={styles.formGroup}>
                                <label htmlFor="phone_number" className={styles.label}>
                                    Phone Number *
                                </label>
                                <input
                                    type="text"
                                    id="phone_number"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    placeholder="Enter your phone number"
                                />
                                {errors.phone_number && <span className={styles.error}>{errors.phone_number}</span>}
                            </div>
                        </div>
                    </fieldset>
                    {/* Group #3: Additional Details */}
                    <fieldset className={styles.fieldset}>
                        <legend className={styles.legend}>Optional Inputs</legend>
                        {/* One row of two columns */}
                        <div className={styles.formRow}>
                            {/* Budget Indication - takes options from imported data */}
                            <div className={styles.formGroup}>
                                <label htmlFor="budget" className={styles.label}>
                                    Budget Indication
                                </label>
                                <select
                                    id="budget"
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleInputChange}
                                    className={styles.select}
                                >
                                    <option className={styles.text} value="">-- Select Budget --</option>
                                    {budgetIndicationOptions.map((option, index) => (
                                        <option key={`budget_option_${index}`} className={styles.text} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* Referred By - takes options from imported data */}
                            <div className={styles.formGroup}>
                                <label htmlFor="referred_by" className={styles.label}>
                                    Referred By
                                </label>
                                <select
                                    id="referred_by"
                                    name="referred_by"
                                    value={formData.referred_by}
                                    onChange={handleInputChange}
                                    className={styles.select}
                                >
                                    <option className={styles.text} value="">-- Select Source --</option>
                                    {referralSourceOptions.map((option, index) => (
                                        <option key={`referred_by_option_${index}`} className={styles.text} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </fieldset>
                    <div className={styles.buttonGroup}>
                        {/* Submit Button */}
                        <button
                            type="submit"
                            className={`${styles.submitButton} ${isSubmitting ? styles.buttonDisabled : ''}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Sending...' : 'Submit'}
                        </button>

                        {/* Clear Button */}
                        <button
                            type="button"
                            className={`${styles.clearButton} ${isSubmitting ? styles.buttonDisabled : ''}`}
                            onClick={handleReset}
                            disabled={isSubmitting}
                        >
                            Clear Form
                        </button>
                    </div>
                    {showSuccess && <div className={styles.successMessage}><p>{successMessage}</p></div>}
                    {showError && <div className={styles.errorMessage}><p>{errorMessage}</p></div>}
                </form >
            </div >
        </div >
    );
};
