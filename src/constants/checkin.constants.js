/**
 * Static bilingual (Khmer / English) content for the visitor check-in wizard.
 * Transcribed from the Figma export (PNC & PSS Visitor Check-In). Khmer copy
 * was read visually off exported screenshots — verify spelling/diacritics
 * against the source Figma text layers before shipping to production.
 */

export const TOTAL_STEPS = 5

export const COMING_FROM_OPTIONS = [
  { value: 'ngo', km: 'អង្គការ', en: 'NGO' },
  { value: 'company', km: 'ក្រុមហ៊ុន', en: 'Company' },
  { value: 'individual', km: 'បុគ្គល', en: 'Individual' },
  { value: 'school_university', km: 'សាលារៀន', en: 'School - University' },
  { value: 'other', km: 'ផ្សេងៗ', en: 'Other' },
]

export const PURPOSE_OPTIONS = [
  { value: 'meeting', km: 'ប្រជុំ', en: 'Meeting' },
  { value: 'campus_tour', km: 'ទស្សនាបរិវេណអង្គការ', en: 'Campus Tour' },
  { value: 'partnership_discussion', km: 'ពិភាក្សាភាពជាដៃគូ', en: 'Partnership Discussion' },
  { value: 'training_workshop', km: 'បណ្តុះបណ្តាល', en: 'Training - Workshop' },
  { value: 'delivery', km: 'ប្រគល់ឯកសារ / សម្ភារៈ', en: 'Delivery' },
  { value: 'maintenance_support', km: 'ជួសជុល / គាំទ្រផ្នែកបច្ចេកទេស', en: 'Maintenance/Technical Support' },
  { value: 'other', km: 'ផ្សេងៗ', en: 'Other' },
]

/**
 * The 6-card Terms & Policies carousel shown on step 5.
 * Each `accepted` box must be checked before the visitor can submit.
 */
export const TERMS_CARDS = [
  {
    key: 'registration_access',
    titleKm: 'ការស្គាល់អត្តសញ្ញាណ និងការបញ្ជូល-ចេញ',
    titleEn: 'Registration & Access Control',
    bodyKm:
      'ខ្ញុំនឹងពាក់ប័ណ្ណសម្គាល់ខ្លួនរបស់ខ្ញុំ (Visitor Badge) ឱ្យឃើញច្បាស់បានទី និងស្ថិតនៅក្នុងតំបន់ដែលបានកំណត់សម្រាប់ភ្ញៀវប៉ុណ្ណោះ។',
    quoteEn:
      'I will wear my Visitor Badge visibly at all times, and remain within designated visitor areas.',
  },
  {
    key: 'child_youth_safeguarding',
    titleKm: 'ការការពារកុមារ យុវជន និងក្រមប្រតិបត្តិ',
    titleEn: 'Child/Youth Safeguarding & Behavioral Code',
    bodyKm:
      'ខ្ញុំនឹងគោរពតាមគោលការណ៍ការការពារកុមារ និងយុវជនយ៉ាងម៉ឺងម៉ាត់។ ខ្ញុំនឹងមិនប្រព្រឹត្តអំពើហិង្សា ការរើសអើង ឬធ្វើអន្តរកម្មតែម្នាក់ឯងជាមួយសិស្សដោយគ្មានការទទួលខុសត្រូវ ទោះបីមានភេទណាក៏ដោយ។',
    quoteEn:
      'I will strictly comply with Child and Youth Safeguarding policies. I will not engage in violence, harassment, discrimination, or unescorted one-on-one interactions with students, regardless of gender.',
  },
  {
    key: 'media_consent',
    titleKm: 'ការទទួលព័ត៌មាន និងការរក្សាការសម្ងាត់',
    titleEn: 'Media Consent & Confidentiality',
    bodyKm:
      'ខ្ញុំយល់ព្រមឱ្យថតរូប/វីដេអូក្នុងអំឡុងពេលទស្សនកិច្ច។ ខ្ញុំនឹងសុំការអនុញ្ញាតជាមុននឹងថតរូបឬវីដេអូរបស់សិស្ស ឬបុគ្គលិក ហើយនឹងគោរពឯកជនភាព និងភាពសម្ងាត់របស់សិស្ស។',
    quoteEn:
      'I consent to being photographed/filmed during my visit. I will obtain prior permission before taking photos/videos of students or staff, and will respect the privacy and confidentiality of student information.',
  },
  {
    key: 'health_safety_environment',
    titleKm: 'សុខភាព សុវត្ថិភាព និងបរិស្ថាន',
    titleEn: 'Health, Safety & Environment',
    bodyKm:
      'ខ្ញុំនឹងគោរពតាមវិធានការសុវត្ថិភាពអាទិកាល ការហាមប្រាមជក់បារី/ជក់ស្រវឹង/សារធាតុញៀននៅលើបរិវេណអង្គការ និងរាយការណ៍ជាបន្ទាន់នូវគ្រោះថ្នាក់ ឬបញ្ហាសុវត្ថិភាពទៅកាន់បុគ្គលិក។',
    quoteEn:
      'I will follow emergency and safety guidelines, respect the non-smoking and substance-free policy on campus, and immediately report any accidents or safety concerns to staff.',
  },
  {
    key: 'compliance_property',
    titleKm: 'ការគោរពតាមការណែនាំ និងការទទួលខុសត្រូវ',
    titleEn: 'Compliance & Property Liability',
    bodyKm:
      'ខ្ញុំនឹងគោរពតាមការណែនាំរបស់បុគ្គលិក PNC/PSS គ្រប់ពេលវេលា។ ខ្ញុំទទួលខុសត្រូវពេញលេញលើទ្រព្យសម្បត្តិផ្ទាល់ខ្លួនរបស់ខ្ញុំ ហើយនឹងគោរពទ្រព្យសម្បត្តិរបស់អង្គការមិនឱ្យមានការខូចខាត។',
    quoteEn:
      'I will follow all instructions given by PNC/PSS staff at all times. I assume full responsibility for my personal belongings and agree to respect organizational property.',
  },
  {
    key: 'acknowledgment_signature',
    titleKm: 'ការយល់ព្រម និងហត្ថលេខា',
    titleEn: 'ACKNOWLEDGMENT & SIGNATURE',
    bodyKm: 'ខ្ញុំបានអាន យល់ និងព្រមព្រៀងតាមលក្ខខណ្ឌទាំងអស់ខាងលើនេះស្រេច។',
    quoteEn:
      'I have read, understood, and agreed to all the terms and conditions listed above.',
  },
]
