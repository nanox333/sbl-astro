// stackbit.config.ts
import { defineStackbitConfig, Document } from '@stackbit/types';
import { GitContentSource } from '@stackbit/cms-git';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// --- ES Module equivalent for __dirname ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// -----------------------------------------

export default defineStackbitConfig({
    stackbitVersion: '~0.6.0',
    // --- Astro Specific Settings from OFFICIAL Guide ---
    ssgName: 'custom', // Required per Astro guide
    nodeVersion: '22', // Match your Netlify build environment
    devCommand: 'node_modules/.bin/astro dev --port {PORT} --hostname 127.0.0.1', // Required per Astro guide
    experimental: { // Required per Astro guide
        ssg: {
            name: 'Astro',
            logPatterns: {
                up: ['is ready', 'astro'] // Log patterns for Astro dev server
            },
            directRoutes: {
                'socket.io': 'socket.io'
            },
            passthrough: ['/vite-hmr/**'] // For Vite HMR
        }
    },
    // customContentReload: true, // REMOVED - Not needed per Astro guide
    // ---------------------------------------------

    contentSources: [
        new GitContentSource({
            rootPath: __dirname,
            // *** IMPORTANT: Correct path for YOUR data file ***
            contentDirs: ['src/data'],
            models: [
                {
                    name: 'pageData', // Model for your single data file
                    type: 'data',     // Correct type for global data
                    label: 'Page Content',
                    file: 'pageData.json', // Specific file relative to contentDirs
                    // No isSingleton needed
                    fields: [
                        // --- Your Fields Definitions ---
                        // (Keep the extensive fields definition from previous versions)
                        // Top Level Fields
                        { name: 'title_sv', type: 'string', label: 'Sidtitel (SV)', required: true },
                        { name: 'title_en', type: 'string', label: 'Sidtitel (EN)', required: true },
                        { name: 'headshot', type: 'image', label: 'Headshot' },
                        { name: 'cv_sv', type: 'file', label: 'CV File (SV)' },
                        { name: 'cv_en', type: 'file', label: 'CV File (EN)' },
                        // Hero
                        { name: 'hero_section', type: 'object', label: 'Hero Sektion', fields: [ { name: 'title_sv', type: 'string', label: 'Rubrik (SV)', required: true }, { name: 'title_en', type: 'string', label: 'Rubrik (EN)', required: true }, { name: 'subtitle_sv', type: 'text', label: 'Underrubrik (SV)' }, { name: 'subtitle_en', type: 'text', label: 'Underrubrik (EN)' }, { name: 'contact_btn_sv', type: 'string', label: 'Kontakt Knapp Text (SV)' }, { name: 'contact_btn_en', type: 'string', label: 'Kontakt Knapp Text (EN)' }, { name: 'cv_btn_sv', type: 'string', label: 'CV Knapp Text (SV)' }, { name: 'cv_btn_en', type: 'string', label: 'CV Knapp Text (EN)' }]},
                        // About
                        { name: 'about_section', type: 'object', label: 'Om Mig Sektion', fields: [ { name: 'title_sv', type: 'string', label: 'Rubrik (SV)' }, { name: 'title_en', type: 'string', label: 'Rubrik (EN)' }, { name: 'text1_sv', type: 'text', label: 'Text Stycke 1 (SV)' }, { name: 'text1_en', type: 'text', label: 'Text Stycke 1 (EN)' }, { name: 'text2_sv', type: 'text', label: 'Text Stycke 2 (SV)' }, { name: 'text2_en', type: 'text', label: 'Text Stycke 2 (EN)' }, { name: 'skills_title_sv', type: 'string', label: 'Kompetenser Rubrik (SV)' }, { name: 'skills_title_en', type: 'string', label: 'Kompetenser Rubrik (EN)' }, { name: 'skills', type: 'list', label: 'Kompetenslista', items: { type: 'object', fields: [ { name: 'skill_sv', type: 'string', label: 'Kompetens (SV)', required: true }, { name: 'skill_en', type: 'string', label: 'Kompetens (EN)', required: true }]}}]},
                        // Experience
                        { name: 'experience_section', type: 'object', label: 'Erfarenhet Sektion', fields: [ { name: 'title_sv', type: 'string', label: 'Rubrik (SV)' }, { name: 'title_en', type: 'string', label: 'Rubrik (EN)' }, { name: 'jobs', type: 'list', label: 'Jobb / Jobs', items: { type: 'object', fields: [ { name: 'title_sv', type: 'string', label: 'Jobbtitel (SV)', required: true }, { name: 'title_en', type: 'string', label: 'Jobbtitel (EN)', required: true }, { name: 'company', type: 'string', label: 'Företag & Plats', required: true }, { name: 'dates_sv', type: 'string', label: 'Datum (SV)', required: true }, { name: 'dates_en', type: 'string', label: 'Datum (EN)', required: true }, { name: 'desc_sv', type: 'list', label: 'Beskrivningspunkter (SV)', items: { type: 'string' } }, { name: 'desc_en', type: 'list', label: 'Beskrivningspunkter (EN)', items: { type: 'string' } }]}}]},
                        // Education
                        { name: 'education_section', type: 'object', label: 'Utbildning Sektion', fields: [ { name: 'title_sv', type: 'string', label: 'Rubrik (SV)' }, { name: 'title_en', type: 'string', label: 'Rubrik (EN)' }, { name: 'educations', type: 'list', label: 'Utbildningar / Educations', items: { type: 'object', fields: [ { name: 'title_sv', type: 'string', label: 'Titel/Program (SV)', required: true }, { name: 'title_en', type: 'string', label: 'Titel/Program (EN)', required: true }, { name: 'institution', type: 'string', label: 'Institution', required: true }, { name: 'dates_sv', type: 'string', label: 'Datum (SV)', required: true }, { name: 'dates_en', type: 'string', label: 'Datum (EN)', required: true }, { name: 'details_sv', type: 'string', label: 'Detaljer/Inriktning (SV)' }, { name: 'details_en', type: 'string', label: 'Detaljer/Inriktning (EN)' }]}}, { name: 'lang_title_sv', type: 'string', label: 'Språk Rubrik (SV)' }, { name: 'lang_title_en', type: 'string', label: 'Språk Rubrik (EN)' }, { name: 'languages', type: 'list', label: 'Språk / Languages', items: { type: 'object', fields: [ { name: 'name_sv', type: 'string', label: 'Språk Namn (SV)', required: true }, { name: 'name_en', type: 'string', label: 'Språk Namn (EN)', required: true }, { name: 'level_sv', type: 'string', label: 'Nivå (SV)', required: true }, { name: 'level_en', type: 'string', label: 'Nivå (EN)', required: true }]}}]},
                        // Contact
                        { name: 'contact_section', type: 'object', label: 'Kontakt Sektion', fields: [ { name: 'title_sv', type: 'string', label: 'Rubrik (SV)' }, { name: 'title_en', type: 'string', label: 'Rubrik (EN)' }, { name: 'intro_sv', type: 'text', label: 'Intro Text (SV)' }, { name: 'intro_en', type: 'text', label: 'Intro Text (EN)' }, { name: 'email_label_sv', type: 'string', label: 'E-post Etikett (SV)' }, { name: 'email_label_en', type: 'string', label: 'Email Etikett (EN)' }, { name: 'email_address', type: 'string', label: 'Email Adress' }, { name: 'phone_label_sv', type: 'string', label: 'Telefon Etikett (SV)' }, { name: 'phone_label_en', type: 'string', label: 'Telefon Etikett (EN)' }, { name: 'phone_number', type: 'string', label: 'Telefonnummer' }, { name: 'linkedin_label_sv', type: 'string', label: 'LinkedIn Etikett (SV)' }, { name: 'linkedin_label_en', type: 'string', label: 'LinkedIn Etikett (EN)' }, { name: 'linkedin_link_text_sv', type: 'string', label: 'LinkedIn Länk Text (SV)' }, { name: 'linkedin_link_text_en', type: 'string', label: 'LinkedIn Länk Text (EN)' }, { name: 'linkedin_url', type: 'string', label: 'LinkedIn URL' }, { name: 'location_label_sv', type: 'string', label: 'Plats Etikett (SV)' }, { name: 'location_label_en', type: 'string', label: 'Plats Etikett (EN)' }, { name: 'location_text_sv', type: 'string', label: 'Plats Text (SV)' }, { name: 'location_text_en', type: 'string', label: 'Plats Text (EN)' }]},
                        // Footer
                        { name: 'footer_section', type: 'object', label: 'Sidfot / Footer', fields: [ { name: 'rights_sv', type: 'string', label: 'Copyright Text (SV)' }, { name: 'rights_en', type: 'string', label: 'Copyright Text (EN)' }, { name: 'name', type: 'string', label: 'Namn' }]}
                    ]
                }
            ],
            // *** Check assetsConfig based on Astro guide example ***
            assetsConfig: {
                referenceType: 'static',
                staticDir: 'public',     // Astro serves static assets from 'public'
                publicPath: '/',        // These assets are served from the site root URL
                // uploadDir: 'uploads' // Optional: Subdirectory within 'public' for uploads
                                        // If used, new image paths in JSON will be '/uploads/...'
                                        // If omitted, uploads go to root of 'public'
            }
        })
    ],
    // siteMap function (should still be okay)
    siteMap: (props) => {
        const pageDataDoc = props.documents.find((doc: Document) => doc.modelName === 'pageData');
        if (pageDataDoc) {
            return [
                { urlPath: '/', stableId: pageDataDoc.id, document: pageDataDoc, isHomePage: true }
            ];
        }
        return [];
    }
});