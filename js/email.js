/* 
   ==========================================================================
   PAVITHRA J - EMAIL SERVICE MODULE (EMAILJS INTEGRATION)
   ==========================================================================
*/

const EmailService = (() => {
    // EmailJS credentials - Secure configuration placeholders
    // User should replace these placeholders with actual values from the EmailJS dashboard.
    const CONFIG = {
        PUBLIC_KEY: 'Od62V0iLp_CAnonhr',
        SERVICE_ID: 'service_aj12jal',
        TEMPLATE_ID: 'template_ex1i7dm'
    };

    /**
     * Initializes EmailJS SDK if a valid Public Key is configured.
     */
    const init = () => {
        if (isConfigured()) {
            emailjs.init(CONFIG.PUBLIC_KEY);
            console.log('EmailJS initialized successfully.');
        } else {
            console.warn('EmailJS: Credentials are not configured correctly.');
        }
    };

    /**
     * Validates form fields on the client-side.
     * @param {string} name 
     * @param {string} email 
     * @param {string} subject 
     * @param {string} message 
     * @returns {Object} { isValid: boolean, errorMsg: string }
     */
    const validateFields = (name, email, subject, message) => {
        if (!name || name.trim() === '') {
            return { isValid: false, errorMsg: 'Please enter your name.' };
        }
        if (!email || email.trim() === '' || !isValidEmail(email)) {
            return { isValid: false, errorMsg: 'Please enter a valid email address.' };
        }
        if (!subject || subject.trim() === '') {
            return { isValid: false, errorMsg: 'Please enter a subject.' };
        }
        if (!message || message.trim() === '') {
            return { isValid: false, errorMsg: 'Please write your message.' };
        }
        return { isValid: true, errorMsg: '' };
    };

    /**
     * Checks if email address is in valid format.
     * @param {string} email 
     * @returns {boolean}
     */
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    /**
     * Checks if actual credentials have been provided instead of placeholders.
     * @returns {boolean}
     */
    const isConfigured = () => {
        const isPlaceholder = (val) => {
            if (!val) return true;
            const v = val.trim();
            const upper = v.toUpperCase();
            return (
                upper === '' || 
                upper.includes('YOUR_') || 
                upper.includes('PLACEHOLDER') || 
                upper === 'YOUR_PUBLIC_KEY' || 
                upper === 'YOUR_SERVICE_ID' || 
                upper === 'YOUR_TEMPLATE_ID'
            );
        };
        return (
            CONFIG.PUBLIC_KEY && !isPlaceholder(CONFIG.PUBLIC_KEY) &&
            CONFIG.SERVICE_ID && !isPlaceholder(CONFIG.SERVICE_ID) &&
            CONFIG.TEMPLATE_ID && !isPlaceholder(CONFIG.TEMPLATE_ID)
        );
    };

    /**
     * Sends the contact form message asynchronously using EmailJS.
     * @param {Object} formData 
     * @returns {Promise<any>}
     */
    const send = async (formData) => {
        const { name, email, subject, message } = formData;

        // Perform validation
        const validation = validateFields(name, email, subject, message);
        if (!validation.isValid) {
            throw new Error(validation.errorMsg);
        }

        // Check if EmailJS credentials are configured
        if (!isConfigured()) {
            throw new Error('EmailJS configuration credentials (Service ID, Template ID, or Public Key) are missing or invalid.');
        }

        const submissionDate = new Date().toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            dateStyle: 'full',
            timeStyle: 'medium'
        });

        // Parameters sent to EmailJS template variables
        const templateParams = {
            from_name: name.trim(),
            from_email: email.trim(),
            subject: subject.trim(),
            message: message.trim(),
            submission_date: submissionDate,
            to_email: 'pavithra.workss@gmail.com'
        };

        // Production direct call
        try {
            return await emailjs.send(CONFIG.SERVICE_ID, CONFIG.TEMPLATE_ID, templateParams);
        } catch (error) {
            console.error('EmailJS SDK Error Details:', error);
            const errorMsg = error && (error.text || error.message || (typeof error === 'string' ? error : JSON.stringify(error)));
            throw new Error(errorMsg || 'Failed to transmit message through EmailJS API.');
        }
    };

    return {
        init,
        send
    };
})();

// Auto initialize on script load
EmailService.init();
