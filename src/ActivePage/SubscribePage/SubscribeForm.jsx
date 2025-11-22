import { useState, useEffect } from 'react';
import { PostFormData } from '../../lib/PostFormData';
import { samashrayanamOptions, interestOptions, selectedSamashrayanamOptions } from './FormData/SubscribeFormData';
import styles from './SubscribeForm.module.css';
import countryCodes from './FormData/country_prefix.json';

const relative_url = "/subscribe";

export default function SubscribeForm({ getValidCredentials }) {
    // Form Data State
    const [formData, setFormData] = useState({
        full_name: '',
        email_address: '',
        phone_number: '',
        contact_preference: '',
        address_line_1: '',
        address_line_2: '',
        name_of_city: '',
        postal_code: '',
        state_or_province: '',
        name_of_country: '',
        samashrayanam: '',
        thirumaligai: '',
        acharyan_name: '',
        interests: '',
        authorise_to_contact: false
    });
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAcharyanDetails, setShowAcharyanDetails] = useState(false);
    const [showOtherInterests, setShowOtherInterests] = useState(false);
    const [interestsList, setInterestsList] = useState([]);
    const [otherInterests, setOtherInterests] = useState('');

    {/* Some pre-treatment and status definitions for phone number */ }
    const [countryCode, setCountryCode] = useState('+91');
    const [phoneNumber, setPhoneNumber] = useState('');
    formData.phone_number = `${countryCode} ${phoneNumber}`;
    const countryCodeOptions = countryCodes.countryCodes.map(({ callingCode, name }) => ({
        label: `(${callingCode}) ${name} `,
        value: callingCode
    }));
    const countryOptions = countryCodes.countryCodes.map(({ name }) => name);

    {/* --------------------- */ }
    {/* Use Effect Hooks      */ }
    {/* --------------------- */ }
    {/* Update phone number in formData when country code or phone number changes */ }
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            phone_number: `${countryCode}${phoneNumber.replace(/^\+\d+\s?/, '')}`
        }));
    }, [countryCode, phoneNumber]);


    {/* ------- End of Effect Hooks ---------- */ }

    {/* Helper Functions */ }
    const getInterestsString = () => {
        let interests_list = [...interestsList];
        if (showOtherInterests && otherInterests.trim() !== '') {
            interests_list.push(otherInterests.trim());
        }
        return interests_list.join(':');
    };

    const resetForm = () => {
        setFormData({
            full_name: '',
            email_address: '',
            phone_number: '',
            contact_preference: '',
            address_line_1: '',
            address_line_2: '',
            name_of_city: '',
            postal_code: '',
            state_or_province: '',
            name_of_country: '',
            samashrayanam: '',
            thirumaligai: '',
            acharyan_name: '',
            interests: '',
            authorise_to_contact: false
        });
        setInterestsList([]);
        setOtherInterests('');
        setShowOtherInterests(false);
        setShowAcharyanDetails(false);
        setErrors({});
        setSuccessMessage('');
        setErrorMessage('');
    };

    const validateForm = () => {
        const newErrors = {};

        // Validate Full Name
        if (!formData.full_name.trim()) {
            newErrors.full_name = 'Full name is required';
        }
        // Validate Contact Preference
        if (!formData.contact_preference) {
            newErrors.contact_preference = 'Contact preference is required';
        }
        // Validate Email Address
        if (!formData.email_address.trim()) {
            newErrors.email_address = 'Email address is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email_address)) {
            newErrors.email_address = 'Email address is invalid';
        }

        // Validate Phone Number
        if (!formData.phone_number.trim()) {
            newErrors.phone_number = 'Phone number is required';
        } else if (!/^\+(?:[0-9] ?){6,14}[0-9]$/.test(formData.phone_number)) {
            newErrors.phone_number = 'Phone number is invalid';
        }
        // Validate Address Line 1
        if (!formData.address_line_1.trim()) {
            newErrors.address_line_1 = 'Address Line 1 is required';
        }

        // Validate City
        if (!formData.name_of_city.trim()) {
            newErrors.name_of_city = 'City is required';
        }

        // Validate Postal Code
        if (!formData.postal_code.trim()) {
            newErrors.postal_code = 'Postal code is required';
        }

        // Validate State or Province
        if (!formData.state_or_province.trim()) {
            newErrors.state_or_province = 'State or Province is required';
        }

        // Validate Country
        if (!formData.name_of_country.trim()) {
            newErrors.name_of_country = 'Country is required';
        }

        // Validate Samashrayanam Status
        if (!formData.samashrayanam.trim()) {
            newErrors.samashrayanam = 'Samashrayanam status is required';
        }

        // Validate Acharyan Details if Samashrayanam is selected
        if (showAcharyanDetails) {
            if (!formData.thirumaligai.trim()) {
                newErrors.thirumaligai = 'Thirumaligai is required';
            }

            if (!formData.acharyan_name.trim()) {
                newErrors.acharyan_name = 'Acharyan name is required';
            }
        }

        // Validte that Others has been specified if selected
        if (showOtherInterests && !otherInterests.trim()) {
            newErrors.otherInterests = 'Please specify your other interests';
        }

        // Validate Authorisation to Contact
        if (!formData.authorise_to_contact) {
            newErrors.authorise_to_contact = 'You must authorise us to contact you';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        // Handle checkbox inputs for interests
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox' && name === 'extra_interest') {
            if (checked) {
                setShowOtherInterests(true);
            } else {
                setShowOtherInterests(false);
                setErrors(prev => ({ ...prev, otherInterests: '' }));
                setOtherInterests('');
            }
            return; // Do not update interestsList here for 'extra_interest'
        };

        if (type === 'checkbox' && name.startsWith('interest_')) {
            const interestValue = value;
            let updatedInterests = [...interestsList];
            if (checked) {
                updatedInterests.push(interestValue);
            } else {
                updatedInterests = updatedInterests.filter(interest => interest !== interestValue);
            }
            setInterestsList(updatedInterests);
            return;
        };

        // Handle input change for Samashrayanam to show/hide Acharyan details
        if (name === 'samashrayanam') {
            if (selectedSamashrayanamOptions.includes(value)) {
                setShowAcharyanDetails(true);
            } else {
                setShowAcharyanDetails(false);
                setErrors(prev => ({
                    ...prev,
                    thirumaligai: '',
                    acharyan_name: ''
                }));
            }
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        };

        if (name === 'phone_number') {
            setPhoneNumber(value);
            return;
        }

        // General input change handling
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value

        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleReset = (e) => {
        e.preventDefault();
        resetForm();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const interestsString = getInterestsString();

        const updatedFormData = {
            ...formData,
            interests: interestsString
        };

        setFormData(updatedFormData);

        // Validate using updated data object
        const isValid = validateForm();

        if (isValid) {
            console.log("Submitting form with data:", updatedFormData);
        }
    };

    return (
        <div className={styles.container}>
            {/* Form Header */}
            <div className={styles.formBox}>
                <h2 className={styles.formTitle}>Subscribe to Our Magazine</h2>
                <p className={styles.formSubtitle}>Join our community and learn more about out Sampradayam.</p>
                {showSuccess && <div className={styles.successMessage}>{successMessage}</div>}
                {errors.submit && <div className={styles.errorMessage}>{errors.submit}</div>}
                {/* Subscription Form */}
                <form className={styles.form} onSubmit={handleSubmit}>
                    {/* -------------------------------------------------------------------------------------------- */}
                    {/* First Group: Contact Information comprising Name, Contact Preference, Phone, Email */}
                    {/* -------------------------------------------------------------------------------------------- */}
                    <fieldset className={styles.fieldset}>
                        <legend className={styles.legend}>Contact Information</legend>
                        {/* ------------------------------------------- */}
                        {/* Full Name & Contact Preference in first row */}
                        {/* ------------------------------------------- */}
                        <div className={styles.formRow}>

                            {/* Full Name */}
                            <div className={styles.formGroup}>
                                <label htmlFor="full_name" className={styles.label}>
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    id="full_name"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleInputChange}
                                    placeholder="Enter your full name"
                                    className={`${styles.input} ${errors.full_name ? styles.inputError : ''}`}
                                />
                                {errors.full_name && <span className={styles.error}>{errors.full_name}</span>}
                            </div>

                            {/* Contact Preference */}
                            <div className={styles.formGroup}>
                                <label htmlFor="contact_preference" className={styles.label}>
                                    Contact Preference *
                                </label>
                                <select
                                    id="contact_preference"
                                    name="contact_preference"
                                    value={formData.contact_preference}
                                    onChange={handleInputChange}
                                    className={styles.select}
                                >
                                    <option className={styles.text} value="">-- Select Preference --</option>
                                    <option className={styles.text} value="Phone">Phone</option>
                                    <option className={styles.text} value="Email">Email</option>
                                </select>
                                {errors.contact_preference && <span className={styles.error}>{errors.contact_preference}</span>}
                            </div>
                        </div> {/* End of Full Name & Contact Preference Row */}

                        {/* -------------------------------------------- */}
                        {/* Email address and Phone Number in second row */}
                        {/* -------------------------------------------- */}
                        <div className={styles.formRow}>
                            {/* Email Address */}
                            <div className={styles.formGroup}>
                                <label htmlFor="email_address" className={styles.label}>
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    id="email_address"
                                    name="email_address"
                                    value={formData.email_address}
                                    onChange={handleInputChange}
                                    placeholder="Enter your email address"
                                    className={`${styles.input} ${errors.email_address ? styles.inputError : ''}`}
                                />
                                {errors.email_address && <span className={styles.error}>{errors.email_address}</span>}
                            </div>
                            {/* Phone Number - this group has three components */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Phone Number *
                                </label>
                                <div className={styles.phoneGroup}>
                                    <select
                                        name="country_code"
                                        value={countryCode}
                                        onChange={(e) => setCountryCode(e.target.value)}
                                        className={styles.countryCodeSelect}
                                    >
                                        {countryCodeOptions.map((option) => (
                                            <option key={option.label} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="tel"
                                        id="phone_number"
                                        name="phone_number"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="Enter your phone number"
                                        className={`${styles.phoneInput} ${errors.phone_number ? styles.inputError : ''}`}
                                    />
                                </div>
                                {errors.phone_number && <span className={styles.error}>{errors.phone_number}</span>}
                            </div>
                        </div> {/* End of Email address and Phone Number Row */}
                    </fieldset> {/* End of Contact Information Fieldset */}

                    {/* ------------------------------------------------------------------------- */}
                    {/* Second Group: Address Information comprising Street, City, State, Zip etc */}
                    {/* ------------------------------------------------------------------------- */}
                    <fieldset className={styles.fieldset}>
                        <legend className={styles.legend}>Address Information</legend>
                        {/* -------------------------------------------- */}
                        {/* Address Line 1 & Address Line 2 in first row */}
                        {/* -------------------------------------------- */}
                        <div className={styles.formRow}>
                            {/* Address Line 1 */}
                            <div className={styles.formGroup}>
                                <label htmlFor="address_line_1" className={styles.label}>
                                    Address Line 1 *
                                </label>
                                <input
                                    type="text"
                                    id="address_line_1"
                                    name="address_line_1"
                                    value={formData.address_line_1}
                                    onChange={handleInputChange}
                                    placeholder="Street address"
                                    className={`${styles.input} ${errors.address_line_1 ? styles.inputError : ''}`}
                                />
                                {errors.address_line_1 && <span className={styles.error}>{errors.address_line_1}</span>}
                            </div>
                            {/* Address Line 2 */}
                            <div className={styles.formGroup}>
                                <label htmlFor="address_line_2" className={styles.label}>
                                    Address Line 2
                                </label>
                                <input
                                    type="text"
                                    id="address_line_2"
                                    name="address_line_2"
                                    value={formData.address_line_2}
                                    onChange={handleInputChange}
                                    placeholder="Apartment, suite, etc."
                                    className={styles.input}
                                />
                            </div>
                        </div> {/* End of Address Line 1 & 2 Row */}
                        {/* -------------------------------- */}
                        {/* City & Postal Code in second row */}
                        {/* -------------------------------- */}
                        <div className={styles.formRow}>
                            {/* City */}
                            <div className={styles.formGroup}>
                                <label htmlFor="name_of_city" className={styles.label}>
                                    City *
                                </label>
                                <input
                                    type="text"
                                    id="name_of_city"
                                    name="name_of_city"
                                    value={formData.name_of_city}
                                    onChange={handleInputChange}
                                    placeholder="Enter your city"
                                    className={`${styles.input} ${errors.name_of_city ? styles.inputError : ''}`}
                                />
                                {errors.city && <span className={styles.error}>{errors.city}</span>}
                            </div>
                            {/* Postal Code */}
                            <div className={styles.formGroup}>
                                <label htmlFor="postal_code" className={styles.label}>
                                    Postal Code *
                                </label>
                                <input
                                    type="text"
                                    id="postal_code"
                                    name="postal_code"
                                    value={formData.postal_code}
                                    onChange={handleInputChange}
                                    placeholder="Enter postal code"
                                    className={`${styles.input} ${errors.postal_code ? styles.inputError : ''}`}
                                />
                                {errors.postal_code && <span className={styles.error}>{errors.postal_code}</span>}
                            </div>
                        </div> {/* End of City & Postal Code Row */}
                        {/* --------------------------------------- */}
                        {/* State/Province & Country in third row */}
                        {/* --------------------------------------- */}
                        <div className={styles.formRow}>
                            {/* State or Province */}
                            <div className={styles.formGroup}>
                                <label htmlFor="state_or_province" className={styles.label}>
                                    State/Province *
                                </label>
                                <input
                                    type="text"
                                    id="state_or_province"
                                    name="state_or_province"
                                    value={formData.state_or_province}
                                    onChange={handleInputChange}
                                    placeholder="Enter state or province"
                                    className={`${styles.input} ${errors.state_or_province ? styles.inputError : ''}`}
                                />
                                {errors.state_or_province && <span className={styles.error}>{errors.state_or_province}</span>}
                            </div>
                            {/* Country */}
                            <div className={styles.formGroup}>
                                <label htmlFor="name_of_country" className={styles.label}>
                                    Country *
                                </label>
                                <select
                                    name="name_of_country"
                                    value={formData.name_of_country}
                                    onChange={handleInputChange}
                                    placeholder="Select your country"
                                    className={`${styles.input} ${errors.name_of_country ? styles.inputError : ''}`}
                                >
                                    <option value="">-- Select your country --</option>
                                    {countryOptions.map((option, index) => (
                                        <option key={`${option}_${index}`} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                                {errors.country && <span className={styles.error}>{errors.country}</span>}
                            </div>
                        </div> {/* End of State/Province & Country Row */}
                    </fieldset> {/* End of Address Information Group of inputs */}
                    {/* --------------------------------------------------------------------- */}
                    {/* Third Group: Spiritual Information - including two conditional fields */}
                    {/* --------------------------------------------------------------------- */}
                    <fieldset className={styles.fieldset}>
                        <legend className={styles.legend}>Share about your panchasamskaram</legend>
                        {/* --------------------------------------------------- */}
                        {/* Technically the first row with Samashrayanam Status */}
                        {/* --------------------------------------------------- */}
                        {/* Samashrayanam Status */}
                        <div className={styles.formGroup}>
                            <label htmlFor="samashrayanam" className={styles.label}>
                                Your Samashrayanam Status *
                            </label>
                            <select
                                id="samashrayanam"
                                name="samashrayanam"
                                value={formData.samashrayanam}
                                onChange={handleInputChange}
                                className={styles.select}
                            >
                                <option value="">-- Select your status --</option>
                                {samashrayanamOptions.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                            {errors.samashrayanam && <span className={styles.error}>{errors.samashrayanam}</span>}
                        </div>
                        {/* Conditional Acharyan Details - second row if applicable */}
                        {showAcharyanDetails && (
                            <div className={styles.formRow}>
                                {/* Thirumaligai Name */}
                                <div className={styles.formGroup}>
                                    <label htmlFor="thirumaligai" className={styles.label}>
                                        Thirumaligai *
                                    </label>
                                    <input
                                        type="text"
                                        id="thirumaligai"
                                        name="thirumaligai"
                                        value={formData.thirumaligai}
                                        onChange={handleInputChange}
                                        placeholder="Enter thirumaligai name"
                                        className={`${styles.input} ${errors.thirumaligai ? styles.inputError : ''}`}
                                    />
                                    {errors.thirumaligai && <span className={styles.error}>{errors.thirumaligai}</span>}
                                </div>
                                {/* Acharyan Name */}
                                <div className={styles.formGroup}>
                                    <label htmlFor="acharyan_name" className={styles.label}>
                                        Acharyan Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="acharyan_name"
                                        name="acharyan_name"
                                        value={formData.acharyan_name}
                                        onChange={handleInputChange}
                                        placeholder="Enter acharyan's name"
                                        className={`${styles.input} ${errors.acharyan_name ? styles.inputError : ''}`}
                                    />
                                    {errors.acharyan_name && <span className={styles.error}>{errors.acharyan_name}</span>}
                                </div>
                            </div> /* End of Conditional Acharyan Details Row */
                        )}
                    </fieldset> {/* End of Spiritual Information Group of inputs */}
                    {/* ---------------------------------------------------------------------------------- */}
                    {/* Fourth Group: Interests - also collects the other interests as a conditional input */}
                    {/* ---------------------------------------------------------------------------------- */}
                    <fieldset className={styles.fieldset}>
                        <legend className={styles.legend}>Your Areas of Interest</legend>
                        {/* ---------------------------------------------- */}
                        {/* Interests Checkboxes - first row of this group */}
                        {/* ---------------------------------------------- */}
                        {/* Interests Checkboxes */}
                        <div className={styles.checkboxGroup}>
                            {interestOptions.map((interest, index) => (
                                <div key={interest} className={styles.checkboxItem}>
                                    <input
                                        type="checkbox"
                                        id={`interest_${index}`}
                                        name={`interest_${index}`}
                                        value={interest}
                                        checked={interestsList.includes(interest)}
                                        onChange={handleInputChange}
                                        className={styles.checkbox}
                                    />
                                    <label htmlFor={`interest_${index}`} className={styles.checkboxLabel}>
                                        {interest}
                                    </label>
                                </div>
                            ))}
                        </div>
                        {/* Conditional Other Interests Checkbox - second column if applicable */}
                        <div className={`${styles.formRow} ${styles.extraInterestsRow}`}>
                            <div className={styles.checkboxItem}>
                                <input
                                    type="checkbox"
                                    id="extra_interest"
                                    name="extra_interest"
                                    checked={showOtherInterests}
                                    value="Other"
                                    onChange={handleInputChange}
                                    className={styles.checkbox}
                                />
                                <label htmlFor="extra_interest" className={styles.checkboxLabel}>
                                    Other Interests
                                </label>
                            </div>
                            {showOtherInterests && (
                                <div className={`${styles.formGroup} ${styles.otherInterestsInput}`}>
                                    <input
                                        type="text"
                                        id="other_interest"
                                        name="other_interest"
                                        value={otherInterests}
                                        onChange={(e) => setOtherInterests(e.target.value)}
                                        placeholder="Add your other interests here"
                                        className={styles.input}
                                    />
                                </div>
                            )}
                        </div>
                        {errors.otherInterests && <span className={styles.error}>{errors.otherInterests}</span>}
                    </fieldset> {/* End of Interests Group of inputs */}
                    {/* --------------------------------- */}
                    {/* Authorisation to Contact Checkbox */}
                    {/* --------------------------------- */}
                    <fieldset className={styles.fieldset}>
                        <legend className={styles.legend}>Authorization</legend>
                        <div className={styles.checkboxItem}>
                            <input
                                type="checkbox"
                                id="authorise_to_contact"
                                name="authorise_to_contact"
                                checked={formData.authorise_to_contact}
                                onChange={handleInputChange}
                                className={`${styles.checkbox} ${errors.authorise_to_contact ? styles.inputError : ''}`}
                            />
                            <label htmlFor="authorise_to_contact" className={styles.checkboxLabel}>
                                I authorize the magazine to use my contact information for subscription purposes and agree to receive communications.
                            </label>
                        </div>
                        {errors.authorise_to_contact && <span className={styles.error}>{errors.authorise_to_contact}</span>}
                    </fieldset>
                    {/* ------------ */}
                    {/* Form Buttons */}
                    {/* ------------ */}
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
        </div >
    );
}