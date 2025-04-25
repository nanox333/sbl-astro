document.addEventListener('DOMContentLoaded', () => {

    // --- Elements ---
    const langButtons = document.querySelectorAll('.lang-switch button');
    const translatableElements = document.querySelectorAll('[data-lang-key]');
    const htmlElement = document.documentElement;
    const cvDownloadLink = document.getElementById('cv-download-link');
    const currentYearSpan = document.getElementById('current-year');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('header nav');

    // --- Functions ---
    const updateText = (lang) => {
        // --- Access global data directly INSIDE the function ---
        const siteData = window.portfolioData;
        if (!siteData) {
             console.error("ERROR: portfolioData not found on window when trying to update text!"); // Debug log
             return; // Exit if data isn't available
        }

        // --- Update page lang and title ---
        htmlElement.setAttribute('lang', lang);
        // Use try-catch for potential errors accessing nested data
        try {
            document.title = siteData[`title_${lang}`] || siteData.title_sv || 'Portfolio'; // Update title tag with fallback
        } catch (e) {
            console.error("Error updating document title:", e);
        }


        // --- Key Map (remains the same) ---
        const keyMap = {
            // pageTitle: Handled above
            navHome: `hero_section.title_${lang}`, // Example, adjust if needed
            navAbout: `about_section.title_${lang}`,
            navExperience: `experience_section.title_${lang}`,
            navEducation: `education_section.title_${lang}`,
            navContact: `contact_section.title_${lang}`,
            heroTitle: `hero_section.title_${lang}`,
            heroSubtitle: `hero_section.subtitle_${lang}`,
            heroContactBtn: `hero_section.contact_btn_${lang}`,
            heroCvBtn: `hero_section.cv_btn_${lang}`,
            aboutTitle: `about_section.title_${lang}`,
            aboutText1: `about_section.text1_${lang}`,
            aboutText2: `about_section.text2_${lang}`,
            skillsTitle: `about_section.skills_title_${lang}`,
            experienceTitle: `experience_section.title_${lang}`,
            educationTitle: `education_section.title_${lang}`,
            languagesTitle: `education_section.lang_title_${lang}`,
            contactTitle: `contact_section.title_${lang}`,
            contactIntro: `contact_section.intro_${lang}`,
            contactEmailLabel: `contact_section.email_label_${lang}`,
            contactPhoneLabel: `contact_section.phone_label_${lang}`,
            contactLinkedInLabel: `contact_section.linkedin_label_${lang}`,
            contactLinkedInLinkText: `contact_section.linkedin_link_text_${lang}`,
            contactLocationLabel: `contact_section.location_label_${lang}`,
            contactLocationText: `contact_section.location_text_${lang}`,
            footerRights: `footer_section.rights_${lang}`
        };

        // --- Update Simple Text Elements ---
        translatableElements.forEach(el => {
            const key = el.getAttribute('data-lang-key');
            const dataPath = keyMap[key];

            if (dataPath) {
                try {
                    // Helper function for safe nested access
                    const getValue = (path, obj) => path.split('.').reduce((o, i) => (o && typeof o === 'object' ? o[i] : undefined), obj);
                    const value = getValue(dataPath, siteData);

                    if (value !== undefined && value !== null) {
                        el.innerHTML = value; // Use innerHTML carefully, consider textContent if no HTML is needed
                    } else {
                        // Don't warn for keys that are handled specifically below (like lists)
                        if (!['skills', 'jobs', 'educations', 'languages'].some(listKey => dataPath.includes(listKey))) {
                           // console.warn(`Data value is null or undefined for key: ${key} (path: ${dataPath})`);
                           el.innerHTML = ''; // Clear the element if data is missing/null
                        }
                    }
                } catch (e) {
                    console.error(`Error accessing data for key: ${key} (path: ${dataPath})`, e);
                }
            }
        });


        // --- Update Lists (Skills, Experience, Education, Languages) ---
        try {
            // Skills
            const skillsList = document.querySelector('.skills');
            if (skillsList && siteData.about_section?.skills) {
                skillsList.innerHTML = ''; // Clear existing
                siteData.about_section.skills.forEach((item, index) => {
                    const li = document.createElement('li');
                    li.setAttribute('data-lang-key', `skill_${index + 1}`);
                    li.textContent = item[`skill_${lang}`] || ''; // Use textContent for safety
                    skillsList.appendChild(li);
                });
            }

            // Experience
            const expItems = document.querySelectorAll('#experience .timeline-item');
            if (siteData.experience_section?.jobs && expItems.length === siteData.experience_section.jobs.length) {
                siteData.experience_section.jobs.forEach((job, index) => {
                    const itemEl = expItems[index];
                    itemEl.querySelector('h3').textContent = job[`title_${lang}`] || '';
                    itemEl.querySelector('.dates').textContent = job[`dates_${lang}`] || '';
                    const descList = itemEl.querySelector('ul');
                    descList.innerHTML = ''; // Clear
                    const descriptions = job[`desc_${lang}`];
                    if (Array.isArray(descriptions)) {
                        descriptions.forEach(descItem => {
                            const li = document.createElement('li');
                            li.textContent = descItem || '';
                            descList.appendChild(li);
                        });
                    }
                });
            }

            // Education
            const eduItems = document.querySelectorAll('#education .timeline-item');
            if (siteData.education_section?.educations && eduItems.length === siteData.education_section.educations.length) {
                siteData.education_section.educations.forEach((edu, index) => {
                    const itemEl = eduItems[index];
                    itemEl.querySelector('h3').textContent = edu[`title_${lang}`] || '';
                    itemEl.querySelector('.dates').textContent = edu[`dates_${lang}`] || '';
                    const detailsEl = itemEl.querySelector('.details');
                    const detailsText = edu[`details_${lang}`];
                    if (detailsEl && detailsText) {
                        detailsEl.textContent = detailsText;
                        detailsEl.style.display = 'block';
                    } else if (detailsEl) {
                        detailsEl.textContent = ''; // Clear content
                        detailsEl.style.display = 'none';
                    }
                });
            }

            // Languages
            const langInfoDiv = document.querySelector('.language-info');
            if (langInfoDiv && siteData.education_section?.languages) {
                langInfoDiv.innerHTML = ''; // Clear
                siteData.education_section.languages.forEach((language, index) => {
                    const p = document.createElement('p');
                    const name = language[`name_${lang}`] || '';
                    const level = language[`level_${lang}`] || '';
                    // Use textContent to prevent potential injection issues if data ever changes
                    const strong = document.createElement('strong');
                    strong.setAttribute('data-lang-key', `lang${index + 1}Name`);
                    strong.textContent = `${name}:`;
                    const span = document.createElement('span');
                    span.setAttribute('data-lang-key', `lang${index + 1}Level`);
                    span.textContent = ` ${level}`; // Add space
                    p.appendChild(strong);
                    p.appendChild(span);
                    langInfoDiv.appendChild(p);
                });
            }
        } catch (e) {
            console.error("Error updating list content:", e);
        }


        // --- Update Specific Attributes ---
        // Update CV download link
        try {
            if (cvDownloadLink && siteData[`cv_${lang}`]) {
                cvDownloadLink.href = siteData[`cv_${lang}`];
            } else if (cvDownloadLink) {
                cvDownloadLink.href = "#"; // Fallback
            }
        } catch (e) {
            console.error("Error updating CV link:", e);
        }


        // --- Update active language button style ---
        langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.id === `lang-${lang}`);
        });
    }; // End updateText function

    // --- Event Listeners ---
    langButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedLang = button.id.split('-')[1];
            localStorage.setItem('preferredLang', selectedLang); // Save preference
            updateText(selectedLang);
             // Close mobile menu if open after language change
            if (navMenu && navMenu.classList.contains('active')) { // Add check for navMenu
                navMenu.classList.remove('active');
            }
        });
    });

    // Mobile Menu Toggle
    if (mobileMenuToggle && navMenu) { // Add checks for elements
         mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }


    // Close mobile menu when a link is clicked
     if (navMenu) { // Add check for navMenu
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('href').startsWith('#') && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                }
            });
        });
     }


    // --- Initial Load ---
    // Set current year in footer
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Set initial language
    const preferredLang = localStorage.getItem('preferredLang') || 'sv';
    // Ensure data is available before the first update
    if (window.portfolioData) {
        updateText(preferredLang);
        // console.log(`Initial language set to: ${preferredLang}`); // Debug log
    } else {
        // Data might not be ready *exactly* on DOMContentLoaded with define:vars, add slight delay or wait event
        console.warn("Initial portfolioData not found on DOMContentLoaded, attempting fallback...");
        setTimeout(() => {
            if (window.portfolioData) {
                updateText(preferredLang);
            } else {
                 console.error("ERROR: portfolioData still not available after delay.");
            }
        }, 100); // Small delay as a fallback
    }

}); // End DOMContentLoaded