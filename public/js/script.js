document.addEventListener('DOMContentLoaded', () => {
    const siteData = window.portfolioData;

    if (!siteData) {
        console.error("CRITICAL: portfolioData not found on window!");
        return;
    }

    // --- Elements ---
    const langButtons = document.querySelectorAll('.lang-switch button');
    const htmlElement = document.documentElement;
    const cvDownloadLink = document.getElementById('cv-download-link');
    const currentYearSpan = document.getElementById('current-year');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('header nav');

    // --- Helper to get nested values safely ---
    const getNestedValue = (obj, path, defaultValue = '') => {
        try {
            const value = path.split('.').reduce((o, i) => (o && typeof o === 'object' ? o[i] : undefined), obj);
            return value !== undefined && value !== null ? value : defaultValue;
        } catch (e) {
            return defaultValue;
        }
    };

    // --- Main Text Update Function ---
    const updateText = (lang) => {
        if (!siteData.translations || !siteData.translations[lang]) {
            console.error(`[updateText] Translations for language '${lang}' not found. Available translations:`, siteData.translations);
            return;
        }
        const t = siteData.translations[lang]; // Current language translations

        // Update page lang and title
        htmlElement.setAttribute('lang', lang);
        document.title = t.title || 'Portfolio';

        // Update CV download link
        if (cvDownloadLink && siteData.cv && siteData.cv[lang]) {
            cvDownloadLink.href = siteData.cv[lang];
        }

        // --- Update simple text content for specific elements ---
        // Hero Section
        const heroTitle = document.querySelector('.hero h1');
        if (heroTitle) heroTitle.textContent = t.hero_section?.title || '';
        const heroSubtitle = document.querySelector('.hero .subtitle');
        if (heroSubtitle) heroSubtitle.textContent = t.hero_section?.subtitle || '';
        const heroContactBtn = document.querySelector('.hero-buttons a[href="#contact"]');
        if (heroContactBtn) heroContactBtn.textContent = t.hero_section?.contact_btn || '';
        const heroCvBtn = document.querySelector('.hero-buttons a#cv-download-link');
        if (heroCvBtn) heroCvBtn.textContent = t.hero_section?.cv_btn || '';

        // About Section
        const aboutTitle = document.querySelector('#about h2');
        if (aboutTitle) aboutTitle.textContent = t.about_section?.title || '';
        const aboutText1 = document.querySelector('#about p:nth-of-type(1)'); // More specific selector if needed
        if (aboutText1) aboutText1.textContent = t.about_section?.text1 || '';
        const aboutText2 = document.querySelector('#about p:nth-of-type(2)'); // More specific selector if needed
        if (aboutText2) aboutText2.textContent = t.about_section?.text2 || '';
        const skillsTitle = document.querySelector('#about h3');
        if (skillsTitle) skillsTitle.textContent = t.about_section?.skills_title || '';

        // Experience Section
        const experienceTitle = document.querySelector('#experience h2');
        if (experienceTitle) experienceTitle.textContent = t.experience_section?.title || '';

        // Education Section
        const educationTitle = document.querySelector('#education h2');
        if (educationTitle) educationTitle.textContent = t.education_section?.title || '';
        const languagesTitle = document.querySelector('#education h3[data-lang-key="languagesTitle"], #education .language-info ~ h3'); // Fallback for structure
        if (languagesTitle && t.education_section?.lang_title) languagesTitle.textContent = t.education_section.lang_title;

        // Contact Section
        const contactTitle = document.querySelector('#contact h2');
        if (contactTitle) contactTitle.textContent = t.contact_section?.title || '';
        const contactIntro = document.querySelector('#contact .contact-intro');
        if (contactIntro) contactIntro.textContent = t.contact_section?.intro || '';
        const contactEmailLabel = document.querySelector('.contact-info p:nth-child(1) strong');
        if (contactEmailLabel) contactEmailLabel.textContent = t.contact_section?.email_label || '';
        const contactPhoneLabel = document.querySelector('.contact-info p:nth-child(2) strong');
        if (contactPhoneLabel) contactPhoneLabel.textContent = t.contact_section?.phone_label || '';
        const contactLinkedInLabel = document.querySelector('.contact-info p:nth-child(3) strong');
        if (contactLinkedInLabel) contactLinkedInLabel.textContent = t.contact_section?.linkedin_label || '';
        const contactLinkedInLink = document.querySelector('.contact-info p:nth-child(3) a');
        if (contactLinkedInLink) contactLinkedInLink.textContent = t.contact_section?.linkedin_link_text || '';
        const contactLocationLabel = document.querySelector('.contact-info p:nth-child(4) strong');
        if (contactLocationLabel) contactLocationLabel.textContent = t.contact_section?.location_label || '';
        const contactLocationText = document.querySelector('.contact-info p:nth-child(4) span');
        if (contactLocationText) contactLocationText.textContent = t.contact_section?.location_text || '';

        // Footer (rights text)
        const footerRights = document.querySelector('footer span[data-lang-key="footerRights"], footer p span:last-of-type'); // Robust selector
        if (footerRights) footerRights.textContent = t.footer_section?.rights || '';
        const footerNameInFooter = document.querySelector('footer p span:nth-of-type(2)'); // Assuming structure © YYYY NAME. Rights.
        if (footerNameInFooter && t.footer_section?.name) footerNameInFooter.textContent = t.footer_section.name;

        // --- Update Navigation Links (Layout.astro server-renders these, but client-side update ensures consistency if needed)
        const navAbout = document.querySelector('header nav a[href="#about"]');
        if (navAbout && t.about_section?.title) navAbout.textContent = t.about_section.title;
        const navExperience = document.querySelector('header nav a[href="#experience"]');
        if (navExperience && t.experience_section?.title) navExperience.textContent = t.experience_section.title;
        const navEducation = document.querySelector('header nav a[href="#education"]');
        if (navEducation && t.education_section?.title) navEducation.textContent = t.education_section.title;
        const navContact = document.querySelector('header nav a[href="#contact"]');
        if (navContact && t.contact_section?.title) navContact.textContent = t.contact_section.title;


        // --- Update Lists (Skills, Experience, Education, Languages) ---
        // Skills
        const skillsList = document.querySelector('.skills');
        if (skillsList && t.about_section?.skills) {
            skillsList.innerHTML = ''; // Clear existing
            t.about_section.skills.forEach((skillText) => {
                const li = document.createElement('li');
                li.textContent = skillText || '';
                skillsList.appendChild(li);
            });
        }

        // Experience
        const expSection = document.querySelector('#experience .timeline');
        if (expSection && t.experience_section?.jobs) {
            expSection.innerHTML = ''; // Clear existing timeline items
            t.experience_section.jobs.forEach((job) => {
                const itemEl = document.createElement('div');
                itemEl.className = 'timeline-item card';
                itemEl.innerHTML = `
                    <h3>${job.title || ''}</h3>
                    <p class="company">${job.company || ''}</p>
                    <p class="dates">${job.dates || ''}</p>
                    <ul>
                        ${(job.desc || []).map(d => `<li>${d || ''}</li>`).join('')}
                    </ul>
                `;
                expSection.appendChild(itemEl);
            });
        }

        // Education
        const eduSection = document.querySelector('#education .timeline');
        if (eduSection && t.education_section?.educations) {
            eduSection.innerHTML = ''; // Clear existing timeline items
            t.education_section.educations.forEach((edu) => {
                const itemEl = document.createElement('div');
                itemEl.className = 'timeline-item card';
                let detailsHTML = '';
                if (edu.details) {
                    detailsHTML = `<p class="details">${edu.details}</p>`;
                }
                itemEl.innerHTML = `
                    <h3>${edu.title || ''}</h3>
                    <p class="institution">${edu.institution || ''}</p>
                    <p class="dates">${edu.dates || ''}</p>
                    ${detailsHTML}
                `;
                eduSection.appendChild(itemEl);
            });
        }

        // Languages List in Education Section
        const langInfoDiv = document.querySelector('#education .language-info');
        if (langInfoDiv && t.education_section?.languages) {
            langInfoDiv.innerHTML = ''; // Clear
            t.education_section.languages.forEach((language) => {
                const p = document.createElement('p');
                const strong = document.createElement('strong');
                strong.textContent = `${language.name || ''}:`;
                const span = document.createElement('span');
                span.textContent = ` ${language.level || ''}`;
                p.appendChild(strong);
                p.appendChild(span);
                langInfoDiv.appendChild(p);
            });
        }

        // Update active language button style
        langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.id === `lang-${lang}`);
        });
    }; // End updateText function

    // --- Event Listeners ---
    langButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedLang = button.id.split('-')[1];
            localStorage.setItem('preferredLang', selectedLang);
            updateText(selectedLang);
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    });

    // Mobile Menu Toggle
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when a link is clicked
    if (navMenu) {
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (link.getAttribute('href').startsWith('#') && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                }
            });
        });
    }

    // --- Initial Load ---
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    const preferredLang = localStorage.getItem('preferredLang') || 'sv';

    // Validate preferredLang against available languages in siteData.languages or siteData.translations
    let initialLangToLoad = 'sv'; // Fallback
    if (siteData.languages && siteData.languages.some(l => l.code === preferredLang)) {
        initialLangToLoad = preferredLang;
    } else if (siteData.translations && siteData.translations[preferredLang]){
        initialLangToLoad = preferredLang;
    } else {
        // If preferredLang is invalid, use the first available language or 'sv'
        if (siteData.languages && siteData.languages.length > 0) {
            initialLangToLoad = siteData.languages[0].code;
        } else if (siteData.translations) {
            const availableLangs = Object.keys(siteData.translations);
            if (availableLangs.length > 0) {
                initialLangToLoad = availableLangs[0];
            }
        }
        localStorage.setItem('preferredLang', initialLangToLoad); // Correct localStorage if it was invalid
    }

    updateText(initialLangToLoad);
});