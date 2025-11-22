import { useState } from 'react';
import { PostFormData } from '../../lib/PostFormData';
import styles from './FeedbackForm.module.css';

const relative_url = "/feedback";

export default function FeedbackForm({ getValidCredentials }) {
    const [formData, setFormData] = useState({
        issue_date: '',
        details_of_error: '',
        location_of_error: '',
        name_of_person: '',
        name_of_city: '',
        email_or_phone: ''
    }); // Form field values
    const [errors, setErrors] = useState({}); // Validation errors & Field-specific errors
    const [isSubmitting, setIsSubmitting] = useState(false); // Submission state
    const [showSuccess, setShowSuccess] = useState(false); // Success message visibility for the form submission
    const [successMessage, setSuccessMessage] = useState(""); // Success message content for the form submission
    const [showError, setShowError] = useState(false); // Error message visibility for the form submission
    const [errorMessage, setErrorMessage] = useState(""); // Error message content for the form submission

    {/* Effects Section */ }
    // Nothing in this form

    /* Helpers Section */
    // Reset form fields to initial state
    const resetFormFields = () => {
        setFormData({
            issue_date: '',
            details_of_error: '',
            location_of_error: '',
            name_of_person: '',
            name_of_city: '',
            email_or_phone: ''
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

        if (!formData.issue_date.trim()) {
            newErrors.issue_date = 'Issue Date is required';
        }

        if (!formData.details_of_error.trim()) {
            newErrors.details_of_error = 'Error details are required';
        } else if (formData.details_of_error.length > fields.find(f => f.name === 'details_of_error').maxLength) {
            newErrors.details_of_error = `Error details must be ${fields.find(f => f.name === 'details_of_error').maxLength} characters or less`;
        }

        if (!formData.location_of_error.trim()) {
            newErrors.location_of_error = 'Error location is required';
        }

        if (!formData.name_of_person.trim()) {
            newErrors.name_of_person = 'Your name is required';
        }

        if (!formData.name_of_city.trim()) {
            newErrors.name_of_city = 'Your city is required';
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
                setErrorMessage("Failed to submit feedback. Try again later.");
                setTimeout(() => setShowError(false), 5000);
            } else {
                resetForm();
                setShowSuccess(true);
                setSuccessMessage("Thank you for your feedback!");
                setTimeout(() => setShowSuccess(false), 5000);
            }
        } catch (error) {
            setShowError(true);
            setErrorMessage("Failed to submit feedback. Try again later.");
            setTimeout(() => setShowError(false), 5000);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.formBox}>
                {/* Form Title and Form-level Messages */}
                <h2 className={styles.formTitle}>Feedback Form</h2>
                <p className={styles.formSubtitle}>We value your feedback to improve our magazine.</p>
                {showSuccess && <div className={styles.successMessage}><p>{successMessage}</p></div>}
                {showError && <div className={styles.errorMessage}><p>{errorMessage}</p></div>}
                {showError && <p>{errorMessage}</p>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* Form Fields */}
                    {/* Issue Date Field */}
                    <div className={styles.formGroup}>
                        <label htmlFor="issue_date" className={styles.label}>
                            Issue Date *
                        </label>
                        <input
                            type="text"
                            id="issue_date"
                            name="issue_date"
                            value={formData.issue_date}
                            onChange={handleInputChange}
                            placeholder="Enter issue date"
                            className={`${styles.input} ${errors.issue_date ? styles.inputError : ''}`}
                        />
                        {errors.issue_date && <span className={styles.error}>{errors.issue_date}</span>}
                    </div>
                    {/* Details of Error Field */}
                    <div className={styles.formGroup}>
                        <label htmlFor="details_of_error" className={styles.label}>
                            Details of Error *
                        </label>
                        <textarea
                            id="details_of_error"
                            name="details_of_error"
                            value={formData.details_of_error}
                            onChange={handleInputChange}
                            placeholder="Describe the error in detail. Maximum 1000 characters."
                            maxLength={1000}
                            className={`${styles.textarea} ${errors.details_of_error ? styles.inputError : ''}`}
                        />
                        <div className={styles.charCount}>
                            {formData.details_of_error.length}/1000 characters
                        </div>
                        {errors.details_of_error && <span className={styles.error}>{errors.details_of_error}</span>}
                    </div>
                    {/* Location of Error Field */}
                    <div className={styles.formGroup}>
                        <label htmlFor="location_of_error" className={styles.label}>
                            Location of Error *
                        </label>
                        <input
                            type="text"
                            id="location_of_error"
                            name="location_of_error"
                            value={formData.location_of_error}
                            onChange={handleInputChange}
                            placeholder="Enter where the error is located (e.g., page number, section)"
                            className={`${styles.input} ${errors.location_of_error ? styles.inputError : ''}`}
                        />
                        {errors.location_of_error && <span className={styles.error}>{errors.location_of_error}</span>}
                    </div>
                    {/* Name of Person Field */}
                    <div className={styles.formGroup}>
                        <label htmlFor="name_of_person" className={styles.label}>
                            Your Name *
                        </label>
                        <input
                            type="text"
                            id="name_of_person"
                            name="name_of_person"
                            value={formData.name_of_person}
                            onChange={handleInputChange}
                            placeholder="Enter your name"
                            className={`${styles.input} ${errors.name_of_person ? styles.inputError : ''}`}
                        />
                        {errors.name_of_person && <span className={styles.error}>{errors.name_of_person}</span>}
                    </div>
                    {/* Name of City Field */}
                    <div className={styles.formGroup}>
                        <label htmlFor="name_of_city" className={styles.label}>
                            Your City *
                        </label>
                        <input
                            type="text"
                            id="name_of_city"
                            name="name_of_city"
                            value={formData.name_of_city}
                            onChange={handleInputChange}
                            placeholder="Enter the name of your city"
                            className={`${styles.input} ${errors.name_of_city ? styles.inputError : ''}`}
                        />
                        {errors.name_of_city && <span className={styles.error}>{errors.name_of_city}</span>}
                    </div>
                    {/* Email or Phone Field */}
                    <div className={styles.formGroup}>
                        <label htmlFor="email_or_phone" className={styles.label}>
                            Email or Phone
                        </label>
                        <input
                            type="text"
                            id="email_or_phone"
                            name="email_or_phone"
                            value={formData.email_or_phone}
                            onChange={handleInputChange}
                            placeholder="Optional information to reach you; we won't spam you"
                            className={`${styles.input} ${errors.email_or_phone ? styles.inputError : ''}`}
                        />
                        {errors.email_or_phone && <span className={styles.error}>{errors.email_or_phone}</span>}
                    </div>
                    {/* ------------------ */}
                    <div className={styles.buttonGroup}>
                        {/* Submit Button */}
                        <button
                            type="submit"
                            className={`${styles.submitButton} ${isSubmitting ? styles.buttonDisabled : ''}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Sending...' : 'Subscribe'}
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
                </form>
            </div>
        </div>
    );
};
