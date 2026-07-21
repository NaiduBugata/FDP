import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import AdminPage from './AdminPage.jsx'
import AdminRegistrationsPage from './AdminRegistrationsPage.jsx'
import bala from './assets/bala.jpg'
import noni from './assets/noni.png'
import subbu from './assets/subbu.png'
import kapil from './assets/kapil.png'
import kumar from './assets/kumar.png'
import vignanLogo from './assets/vignan logo updated.png'

const ADMIN_AUTH_STORAGE_KEY = 'qubiodl-admin-auth'
const ADMIN_TOKEN_STORAGE_KEY = 'qubiodl-admin-token'
const SITE_CONTENT_CACHE_KEY = 'qubiodl-site-content-cache-v5'
const REQUIRED_CONVENER_NAME = 'Dr. Sunil Babu Melingi'
const DEFAULT_API_BASE_URL = import.meta.env.PROD
	? 'https://fdp-r80r.onrender.com'
	: 'http://localhost:5000'

const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL
const API_BASE_URL = (() => {
  const trimmed = String(RAW_API_BASE_URL).trim().replace(/\/+$/, '')
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`
})()
const SITE_CONTENT_KEY = 'site-content'

const parseJwtPayload = (token = '') => {
  try {
    const raw = String(token || '').trim()
    if (!raw) {
      return null
    }

    const parts = raw.split('.')
    if (parts.length < 2) {
      return null
    }

    const payload = parts[1]
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=')
    const json = atob(padded)
    return JSON.parse(json)
  } catch {
    return null
  }
}
const PARTICIPANT_TYPE_OPTIONS = [
  'Faculty',
  'Researchers',
  'Ph.D. Scholars',
  'Clinicians & Industry Persons',
]

const DEFAULT_REGISTRATION_FIELDS = [
  {
    id: 'full-name',
    name: 'fullName',
    label: 'Full Name',
    type: 'text',
    required: true,
    section: '1. Basic Details',
    options: [],
  },
  {
    id: 'mobile-number',
    name: 'mobileNumber',
    label: 'Mobile Number',
    type: 'tel',
    required: true,
    section: '1. Basic Details',
    options: [],
  },
  {
    id: 'email-id',
    name: 'emailId',
    label: 'Email ID',
    type: 'email',
    required: true,
    section: '1. Basic Details',
    options: [],
  },
  {
    id: 'designation',
    name: 'designation',
    label: 'Designation',
    type: 'text',
    required: true,
    section: '2. Professional Info',
    options: [],
  },
  {
    id: 'institution',
    name: 'institution',
    label: 'Institution/Organization',
    type: 'text',
    required: true,
    section: '2. Professional Info',
    options: [],
  },
  {
    id: 'participant-type',
    name: 'participantType',
    label: 'Participant Type',
    type: 'select',
    required: true,
    section: '3. Participation',
    options: PARTICIPANT_TYPE_OPTIONS,
  },
  {
    id: 'mode',
    name: 'mode',
    label: 'Mode (Online / Offline)',
    type: 'select',
    required: true,
    section: '3. Participation',
    options: ['Online', 'Offline'],
  },
  {
    id: 'apaar-id',
    name: 'apaarId',
    label: 'APAAR Id (Optional)',
    type: 'text',
    required: false,
    section: '4. Additional Info',
    options: [],
  },
  {
    id: 'declaration',
    name: 'declaration',
    label: 'I will attend the sessions and follow guidelines (Yes/No)',
    type: 'select',
    required: true,
    section: '5. Declaration',
    options: ['Yes', 'No'],
  },
]
const DEFAULT_NAVBAR_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Objectives', href: '#objectives' },
  { label: 'Committee', href: '#committee' },
  { label: 'Speakers', href: '#speakers' },
  { label: 'Portal', href: '#superadmin' },
]

const DEFAULT_SECTION_CONTENT = {
  hero: {
    pill: 'ANRF Sponsored National Seminar',
    titlePrefix: 'Next-Gen',
    titleHighlight: 'Healthcare',
    subtitle: 'Biomedical Imaging through Quantum-Driven Deep Learning (QuBioDL 2K26)',
    metaDate: '01st-05th June 2026',
    metaMode: 'Hybrid Mode',
    metaSeats: 'Limited to 100 Seats',
    registerButtonText: 'Register Now',
    scheduleButtonText: 'View Schedule',
    daysLeftSuffix: 'days left until seminar begins',
  },
  about: {
    heading: 'About the Programme',
    subheading: 'Bridging Quantum Computing & Deep Learning',
    intro: 'The Faculty Development Programme (FDP) empowers educators and researchers to master the intersection of quantum computing and deep learning for biomedical image analysis.',
    handsOnHeading: 'Hands-on & Theory',
    handsOnText: 'Participants gain practical experience with platforms like IBM Quantum Experience, Qiskit, and Microsoft Quantum Development Kit, alongside foundational theory.',
    collaborationHeading: 'Collaboration & Impact',
    collaborationText: 'The FDP fosters collaboration between academia and industry, and addresses ethical and societal implications in healthcare technology.',
    takeawaysHeading: 'Key Takeaways',
    takeaways: [
      'Quantum-enhanced medical imaging',
      'Deep learning for diagnostics',
      'Industry-standard quantum tools',
      'Research & innovation skills',
      'Ethical awareness in AI healthcare',
    ],
    ctaText: 'Register for the FDP',
  },
  objectives: {
    heading: 'Seminar Objectives',
    items: [
      {
        icon: 'developer_board',
        title: 'Quantum Fundamentals',
        text: 'Establish foundational knowledge in quantum mechanics applied to computing.',
      },
      {
        icon: 'integration_instructions',
        title: 'DL Integration',
        text: 'Frameworks for merging quantum circuits with deep neural networks.',
      },
      {
        icon: 'biotech',
        title: 'Tumor Detection',
        text: 'Practical applications in identifying anomalies in complex medical scans.',
      },
      {
        icon: 'model_training',
        title: 'Hands-on Training',
        text: 'Intensive lab sessions using industry-standard quantum simulators.',
      },
      {
        icon: 'lightbulb',
        title: 'Collaboration',
        text: 'Fostering interdisciplinary research networks between clinicians and engineers.',
      },
    ],
  },
  legacy: {
    heading: 'Institutional Legacy',
    entries: [
      {
        icon: 'domain',
        title: 'Vignan Group',
        text: 'VIGNAN GROUP is a premier group of institutions in the country, which has established a strong foothold at all levels of education by catering to the needs of various sections of student community. Starting from schools to junior colleges (+2), Science, Engineering, Pharmacy and Postgraduate institutions with a student base of about 60,000. VIGNAN has today branched across all important geographical areas of A.P, like Guntur, Visakhapatnam and Hyderabad.',
      },
      {
        icon: 'school',
        title: 'Vignan University',
        text: 'Vignan University, officially Vignan\'s Foundation for Science, Technology, and Research (VFSTR), is a Deemed university in Guntur, Andhra Pradesh, established in 2008. It offers various undergraduate, postgraduate, and doctoral programs in engineering, science, management, and humanities. Known for its quality education, the university has an \u2018A+\u2019 NAAC accreditation and NBA accreditation. Vignan ranks 72nd in the NIRF Engineering category and has five ABET-accredited programs. The university emphasizes practical learning through internships and projects while fostering a vibrant campus life.',
      },
      {
        icon: 'memory',
        title: 'CSE Department',
        text: 'The Department of Computer Science and Engineering (CSE), established in 1997, is crucial to advancing various engineering disciplines and is accredited by ABET and NBA. It offers B.Tech, M.Tech, and Ph.D. programs, supported by around 80 qualified faculty members specializing in areas like databases, data mining, and artificial neural networks. Faculty engage in extensive research, contributing to numerous publications. The department fosters student creativity through symposiums and in-plant training programs, enhancing technical skills in computing.',
      },
    ],
  },
  speakers: {
    heading: 'Resource Persons',
    subhead:
      'Experts from IITs, NITs, IIITs, leading universities, IBM, Microsoft, and healthcare technology firms.',
    participantsTitle: 'Target Participants',
    participantsText:
      'Faculty, researchers, Ph.D. scholars, postgraduate students, clinicians, and industry professionals.',
  },
  committee: {
    heading: 'Organizing Committee',
    chiefPatronsLabel: 'Chief Patrons',
    patronsLabel: 'Co-Patrons',
    programmeChairsLabel: 'Programme Chairs',
    convenersLabel: 'Convener & Co-Conveners',
  },
  audience: {
    heading: 'Who Should Attend?',
    items: [
      { icon: 'school', label: 'Faculty' },
      { icon: 'psychology', label: 'Researchers' },
      { icon: 'experiment', label: 'Ph.D. Scholars' },
      { icon: 'stethoscope', label: 'Clinicians & Industry Persons' },
    ],
    certificationTitle: 'Certification Requirements',
    certificationText:
      'Certificates will be issued to participants maintaining at least 80% attendance and securing a minimum of 70% in the final assessment.',
  },
  cta: {
    heading: 'Join the Future of Healthcare',
    text: "Don't miss this opportunity to master the intersection of Quantum Computing and Biomedical AI. Secure your spot today.",
    feeLabel: 'REGISTRATION FEE',
    feeValue: 'FREE REGISTRATION',
    registerButtonText: 'Register Now',
    note: 'Registration link is valid for first 100 eligible participants.',
  },
  schedule: {
    heading: 'Program Schedule (27th - 31st July 2026)',
    buttonText: 'Download PDF Schedule',
    note: '',
  },
  footer: {
    eventTitle: 'QuBioDL 2K26',
    eventText: 'A collaborative platform for healthcare professionals and technology researchers.',
    departmentTitle: 'Department of CSE',
    departmentText: 'Vignan\'s Foundation for Science, Technology and Research, Vadlamudi, Guntur.',
    linksTitle: 'Quick Links',
    links: ['Privacy Policy', 'Terms of Service', 'Contact Support'],
    copyright: '\u00a9 2024 International Conference on Health and AI. All rights reserved.',
  },
}

const normalizeNavbarLinks = (links) => {
  if (!Array.isArray(links) || links.length === 0) {
    return DEFAULT_NAVBAR_LINKS
  }

  return links
    .map((item) => {
      const rawHref = item?.href ?? '#'
      const href = rawHref === '#admin' ? '#superadmin' : rawHref
      const rawLabel = item?.label ?? ''
      const label =
        rawHref === '#admin' && rawLabel.trim().toLowerCase() === 'admin' ? 'Portal' : rawLabel

      return {
        label,
        href,
      }
    })
    .filter((item) => item.label.trim())
}

const normalizeNavbarLogos = (logos) => {
  if (!Array.isArray(logos) || logos.length === 0) {
    return [vignanLogo]
  }

  return logos.filter((logo) => typeof logo === 'string' && logo.trim())
}

const normalizeSections = (sections) => {
  const source = sections ?? {}

  return {
    hero: {
      ...DEFAULT_SECTION_CONTENT.hero,
      ...(source.hero ?? {}),
    },
    about: {
      ...DEFAULT_SECTION_CONTENT.about,
      ...(source.about ?? {}),
      takeaways:
        Array.isArray(source.about?.takeaways) && source.about.takeaways.length > 0
          ? source.about.takeaways
          : DEFAULT_SECTION_CONTENT.about.takeaways,
    },
    objectives: {
      ...DEFAULT_SECTION_CONTENT.objectives,
      ...(source.objectives ?? {}),
      items:
        Array.isArray(source.objectives?.items) && source.objectives.items.length > 0
          ? source.objectives.items
          : DEFAULT_SECTION_CONTENT.objectives.items,
    },
    legacy: {
      ...DEFAULT_SECTION_CONTENT.legacy,
      ...(source.legacy ?? {}),
      entries:
        Array.isArray(source.legacy?.entries) && source.legacy.entries.length > 0
          ? source.legacy.entries
          : DEFAULT_SECTION_CONTENT.legacy.entries,
    },
    speakers: {
      ...DEFAULT_SECTION_CONTENT.speakers,
      ...(source.speakers ?? {}),
    },
    committee: {
      ...DEFAULT_SECTION_CONTENT.committee,
      ...(source.committee ?? {}),
      patronsLabel:
        !source.committee?.patronsLabel ||
        String(source.committee.patronsLabel).trim().toLowerCase() === 'patrons'
          ? 'Co-Patrons'
          : source.committee.patronsLabel,
      convenersLabel:
        !source.committee?.convenersLabel ||
        String(source.committee.convenersLabel).trim().toLowerCase() === 'convener & co-convener'
          ? 'Convener & Co-Conveners'
          : source.committee.convenersLabel,
    },
    audience: {
      ...DEFAULT_SECTION_CONTENT.audience,
      ...(source.audience ?? {}),
      items:
        Array.isArray(source.audience?.items) && source.audience.items.length > 0
          ? source.audience.items.map((item) =>
              String(item?.label ?? '').trim().toLowerCase() === 'clinicians'
                ? { ...item, label: 'Clinicians & Industry Persons' }
                : item,
            )
          : DEFAULT_SECTION_CONTENT.audience.items,
    },
    cta: {
      ...DEFAULT_SECTION_CONTENT.cta,
      ...(source.cta ?? {}),
    },
    schedule: {
      ...DEFAULT_SECTION_CONTENT.schedule,
      ...(source.schedule ?? {}),
      heading:
        !source.schedule?.heading ||
        ['fdp timeline overview', 'seminar timeline overview'].includes(
          String(source.schedule.heading).trim().toLowerCase(),
        )
          ? DEFAULT_SECTION_CONTENT.schedule.heading
          : source.schedule.heading,
      note:
        !source.schedule?.note ||
        String(source.schedule.note).toLowerCase().includes('more detailed sessions')
          ? DEFAULT_SECTION_CONTENT.schedule.note
          : source.schedule.note,
    },
    footer: {
      ...DEFAULT_SECTION_CONTENT.footer,
      ...(source.footer ?? {}),
      links:
        Array.isArray(source.footer?.links) && source.footer.links.length > 0
          ? source.footer.links
          : DEFAULT_SECTION_CONTENT.footer.links,
    },
  }
}

const normalizeRegistrationFields = (fields) => {
  if (!Array.isArray(fields) || fields.length === 0) {
    return DEFAULT_REGISTRATION_FIELDS
  }

  const fieldNames = new Set(fields.map((field) => String(field?.name ?? '').trim()))
  const hasLegacyUploadOrSignature =
    fieldNames.has('passportPhoto') || fieldNames.has('signature') || !fieldNames.has('apaarId')
  const participantTypeField = fields.find((field) => field?.name === 'participantType')
  const hasLegacyParticipantType =
    !participantTypeField ||
    participantTypeField.type !== 'select' ||
    !Array.isArray(participantTypeField.options) ||
    participantTypeField.options.length === 0

  if (hasLegacyUploadOrSignature || hasLegacyParticipantType) {
    return DEFAULT_REGISTRATION_FIELDS
  }

  return fields
    .map((field, index) => ({
      id: field?.id ?? `field-${index + 1}`,
      name: field?.name ?? `field_${index + 1}`,
      label: field?.label ?? `Field ${index + 1}`,
      type: field?.type ?? 'text',
      required: Boolean(field?.required),
      section: field?.section ?? 'Additional Details',
      options: Array.isArray(field?.options) ? field.options : [],
    }))
    .filter((field) => field.name.trim() && field.label.trim())
}

const buildLegacyRegistrationFields = (labels, customFields) => {
  const mappedDefaults = DEFAULT_REGISTRATION_FIELDS.map((field) => {
    const legacyKeyMap = {
      fullName: 'fullName',
      mobileNumber: 'mobileNumber',
      emailId: 'emailId',
      designation: 'designation',
      institution: 'institution',
      participantType: 'participantType',
      mode: 'mode',
      apaarId: 'apaarId',
      declaration: 'declaration',
    }

    const legacyKey = legacyKeyMap[field.name]
    return {
      ...field,
      label: legacyKey && labels?.[legacyKey] ? labels[legacyKey] : field.label,
    }
  })

  const extraFields = Array.isArray(customFields)
    ? customFields.map((field, index) => ({
        id: field?.id ?? `custom-field-${index + 1}`,
        name: `custom_${field?.id ?? index + 1}`,
        label: field?.label ?? `Custom Field ${index + 1}`,
        type: 'text',
        required: false,
        section: 'Additional Details',
        options: [],
      }))
    : []

  return [...mappedDefaults, ...extraFields]
}

const normalizeCommitteeMembers = (members) => {
  if (!Array.isArray(members)) {
    return []
  }

  return members
    .map((member) => {
      if (typeof member === 'string') {
        return {
          name: member,
          details: '',
          image: '',
        }
      }

      return {
        name: member?.name ?? '',
        details: member?.details ?? '',
        image: member?.image ?? '',
      }
    })
    .filter((member) => member.name || member.details || member.image)
}

const normalizeConveners = (conveners) => {
  const source = Array.isArray(conveners) ? conveners : []
  const hasRequiredConvener = source.some(
    (item) => item?.name?.trim()?.toLowerCase() === REQUIRED_CONVENER_NAME.toLowerCase(),
  )
  const withRequired = hasRequiredConvener
    ? source
    : [defaultContent.committee.conveners[0], ...source]

  const seenNames = new Set()
  const uniqueConveners = []

  for (const item of withRequired) {
    const normalizedName = item?.name?.trim()?.toLowerCase() ?? ''
    if (normalizedName && seenNames.has(normalizedName)) {
      continue
    }

    if (normalizedName) {
      seenNames.add(normalizedName)
    }

    const title = String(item?.title ?? '').trim()
    const titleKey = title.toLowerCase()
    const normalizedTitle =
      titleKey === 'co-convener' || titleKey === 'co-convenor' ? 'Co-Conveners' : title

    uniqueConveners.push({
      ...item,
      title: normalizedTitle,
    })
  }

  const mainConvener = []
  const coConveners = []
  const others = []

  for (const item of uniqueConveners) {
    const titleKey = String(item?.title ?? '').trim().toLowerCase()
    if (titleKey === 'convener') {
      mainConvener.push(item)
    } else if (titleKey === 'co-conveners') {
      coConveners.push(item)
    } else {
      others.push(item)
    }
  }

  const gandhi = coConveners.filter((item) =>
    (item?.name ?? '').toLowerCase().replace(/\s+/g, '').includes('gandhi'),
  )
  const mondal = coConveners.filter((item) =>
    (item?.name ?? '').toLowerCase().replace(/\s+/g, '').includes('mondal'),
  )
  const remainingCo = coConveners.filter((item) => {
    const key = (item?.name ?? '').toLowerCase().replace(/\s+/g, '')
    return !key.includes('gandhi') && !key.includes('mondal')
  })

  return [...mainConvener, ...gandhi, ...mondal, ...remainingCo, ...others]
}

const DEFAULT_PROGRAM_SCHEDULE = [
  {
    dayTitle: 'DAY 1 : Foundations of Quantum & Imaging',
    date: '27-07-2026',
    sessions: [
      { time: '9:00 AM – 10:00 AM', title: 'Inaugural Ceremony' },
      { time: '10:00 AM – 11:00 AM', title: 'Keynote: "Quantum Computing in Healthcare"' },
      { time: '11:00 AM - 11:30 AM', title: 'Refreshments' },
      {
        time: '11:30 AM – 1:00 PM',
        title: 'Lecture: Fundamentals of Quantum Computing (Qubits, Superposition, Entanglement)',
      },
      { time: '1:00 PM – 2:00 PM', title: 'Lunch' },
      {
        time: '2:00 PM – 3:45 PM',
        title:
          'Lecture & Discussion : Basics of Biomedical Image Processing, Image modalities, Interactive Q&A',
      },
      { time: '3:45 PM - 4:15 PM', title: 'Hi-Tea' },
    ],
  },
  {
    dayTitle: 'DAY 2 : Deep Learning for Imaging',
    date: '28-07-2026',
    sessions: [
      {
        time: '9:00 AM – 10:30 AM',
        title:
          'Lecture: Deep Learning and Foundation Models for Medical Image Analysis: CNNs, GANs, Vision Transformers (ViTs), etc',
      },
      { time: '10:30AM – 11:00 AM', title: 'Refreshments' },
      {
        time: '11:00 AM – 12:30 PM',
        title:
          'Deep Learning-Based Diagnosis of Chest Infections from Chest X-ray Images; Autism Spectrum Disorder Detection Using Facial Expression Recognition (FER)',
      },
      { time: '12:30 PM – 1:30 PM', title: 'Lunch' },
      { time: '1:30 PM – 3:45 PM', title: 'Workshop : Hands-on: Deep Learning models for Imaging.' },
      { time: '3:45 PM - 4:15 PM', title: 'Hi-Tea' },
    ],
  },
  {
    dayTitle: 'DAY 3 : Quantum–DL Integration',
    date: '29-07-2026',
    sessions: [
      {
        time: '9:00 AM – 10:30 AM',
        title: "Lecture: Quantum Algorithms for Imaging (Grover's, VQE, QAOA)",
      },
      { time: '10:30AM – 11:00 AM', title: 'Refreshments' },
      { time: '11:00 AM – 12:30 PM', title: 'Demo : Hybrid Quantum–Classical Workflows' },
      { time: '12:30 PM – 1:30 PM', title: 'Lunch' },
      {
        time: '1:30 PM – 3:45 PM',
        title: 'Workshop : Hands-on: IBM Quantum Experience & Qiskit for Biomedical Imaging',
      },
      { time: '3:45 PM - 4:15 PM', title: 'Hi-Tea' },
    ],
  },
  {
    dayTitle: 'DAY 4 : Applications & Ethics',
    date: '30-07-2026',
    sessions: [
      {
        time: '9:00 AM – 10:30 AM',
        title:
          'Lecture & Case Studies : Real-Time Applications in Healthcare Imaging & Clinical Deployments',
      },
      { time: '10:30AM – 11:00 AM', title: 'Refreshments' },
      { time: '11:00 AM – 12:30 PM', title: 'Lecture & Case Studies' },
      { time: '12:30 PM – 1:30 PM', title: 'Lunch' },
      { time: '1:30 PM – 3:45 PM', title: 'Workshop : Microsoft Quantum Development Kit' },
      { time: '3:45 PM - 4:15 PM', title: 'Hi-Tea' },
    ],
  },
  {
    dayTitle: 'DAY 5 : Collaboration & Future Directions',
    date: '31-07-2026',
    sessions: [
      { time: '9:00 AM – 10:30 AM', title: 'Lecture : Future Trends in Quantum Healthcare' },
      { time: '10:30AM – 11:00 AM', title: 'Refreshments' },
      { time: '11:00 AM – 12:30 PM', title: 'Collaboration : Academia–Industry Collaboration' },
      { time: '12:30 PM – 1:30 PM', title: 'Lunch' },
      {
        time: '1:30 PM – 3:45 PM',
        title: 'Participant reflections & Closing : Valedictory Session & Certificate Distribution',
      },
      { time: '3:45 PM - 4:15 PM', title: 'Hi-Tea' },
    ],
  },
]

const hasUsableProgramSessions = (schedule) =>
  Array.isArray(schedule) &&
  schedule.some(
    (day) =>
      Array.isArray(day?.sessions) &&
      day.sessions.some((session) => Boolean(String(session?.time || session?.title || '').trim())),
  )

const normalizeProgramSchedule = (schedule) => {
  // Legacy timeline items ({ title, text }) or empty day shells must not win over the PDF schedule.
  if (!hasUsableProgramSessions(schedule)) {
    return DEFAULT_PROGRAM_SCHEDULE
  }

  return schedule.map((day) => ({
    dayTitle: day.dayTitle || day.title || 'Program Day',
    date: day.date || '',
    sessions: (day.sessions || [])
      .map((session) => ({
        time: session.time || '',
        title: session.title || session.text || '',
      }))
      .filter((session) => session.time || session.title),
  }))
}

const defaultContent = {
  navbar: {
    brand: 'QuBioDL',
    subBrand: '2K26',
    links: DEFAULT_NAVBAR_LINKS,
    logos: [vignanLogo],
  },
  registration: {
    modalTitle: 'Seminar Registration Form',
    formFields: DEFAULT_REGISTRATION_FIELDS,
  },
  schedule: DEFAULT_PROGRAM_SCHEDULE,
  speakers: [
    {
      name: 'Prof. R. Balasubramanian',
      role: 'Professor & HoD, Dept. of CSE',
      org: 'IIT, Roorkee',
      image: bala,
    },
    {
      name: 'Dr. Nonitha Sharma',
      role: 'Associate Professor, Dept. of IT',
      org: 'IGDTUW, Old Delhi',
      image: noni,
    },
    {
      name: 'Dr. Subrahmanyam Gorthi',
      role: 'Associate Professor, Dept. of EE',
      org: 'IIT, Tirupati',
      image: subbu,
    },
    {
      name: 'Dr. Kapil Kumar Soni',
      role: 'Assistant Professor, Dept. of IT',
      org: 'NIT, Rourkela',
      image: kapil,
    },
    {
      name: 'Dr Kumar Gautam',
      role: 'Founder CEO, QRACE and Egreen Quanta',
      org: 'RMoC (AIM-NITI Aayog)',
      image: kumar,
    },
  ],
  committee: {
    department: 'Department of Computer Science & Engineering',
    school: 'School of Computing and Informatics (SoCI)',
    chiefPatrons: [
      {
        name: 'Chairman',
        details: '',
        image: '',
      },
      {
        name: 'Vice-Chairman',
        details: '',
        image: '',
      },
      {
        name: 'CEO',
        details: '',
        image: '',
      },
    ],
    patrons: [
      {
        name: 'Vice-Chancellor',
        details: '',
        image: '',
      },
      {
        name: 'Registrar',
        details: '',
        image: '',
      },
    ],
    programmeChairs: [
      {
        name: 'Dr. S.V. Phani Kumar',
        role: 'Professor & HoD, CSE',
        image: '',
      },
      {
        name: 'Dr. S. Deva Kumar',
        role: 'Associate Professor & Deputy HoD, CSE',
        image: '',
      },
    ],
    conveners: [
      {
        title: 'Convener',
        name: 'Dr. Sunil Babu Melingi',
        role: 'Assistant Professor, CSE',
        contact: '+91-8333001991',
        email: 'drmsb_cse@vignan.ac.in',
        image: '',
      },
      {
        title: 'Co-Conveners',
        name: 'Mr. O. Gandhi',
        role: 'Assistant Professor, CSE',
        contact: '',
        email: '',
        image: '',
      },
      {
        title: 'Co-Conveners',
        name: 'Mr. Sourav Mondal',
        role: 'Assistant Professor, CSE',
        contact: '+91-9831422643',
        email: 'svml_cse@vignan.ac.in',
        image: '',
      },
    ],
  },
  sections: DEFAULT_SECTION_CONTENT,
}

const buildContentFromSaved = (saved = {}) => {
  try {
    const savedConveners = Array.isArray(saved.committee?.conveners)
      ? saved.committee.conveners
      : defaultContent.committee.conveners

    const normalizedConveners = normalizeConveners(savedConveners)
    const normalizedRegistrationFields = Array.isArray(saved.registration?.formFields)
      ? normalizeRegistrationFields(saved.registration.formFields)
      : normalizeRegistrationFields(
          buildLegacyRegistrationFields(saved.registration?.labels, saved.registration?.customFields),
        )

    const { loader: _ignoredLoader, schedule: _ignoredSchedule, ...restSaved } = saved

    return {
      ...defaultContent,
      ...restSaved,
      registration: {
        ...defaultContent.registration,
        ...(restSaved.registration ?? {}),
        formFields: normalizedRegistrationFields,
      },
      navbar: {
        ...defaultContent.navbar,
        ...(restSaved.navbar ?? {}),
        links: normalizeNavbarLinks(restSaved.navbar?.links),
        logos: normalizeNavbarLogos(restSaved.navbar?.logos),
      },
      schedule: normalizeProgramSchedule(saved.schedule),
      speakers: Array.isArray(restSaved.speakers) ? restSaved.speakers : defaultContent.speakers,
      committee: {
        ...defaultContent.committee,
        ...(restSaved.committee ?? {}),
        chiefPatrons: normalizeCommitteeMembers(
          Array.isArray(restSaved.committee?.chiefPatrons)
            ? restSaved.committee.chiefPatrons
            : defaultContent.committee.chiefPatrons,
        ),
        patrons: normalizeCommitteeMembers(
          Array.isArray(restSaved.committee?.patrons)
            ? restSaved.committee.patrons
            : defaultContent.committee.patrons,
        ),
        programmeChairs: Array.isArray(restSaved.committee?.programmeChairs)
          ? restSaved.committee.programmeChairs
          : defaultContent.committee.programmeChairs,
        conveners: normalizedConveners,
      },
      sections: normalizeSections(restSaved.sections),
    }
  } catch {
    return defaultContent
  }
}

const readCachedSiteContent = () => {
  try {
    const raw = window.localStorage.getItem(SITE_CONTENT_CACHE_KEY)
    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') {
      return null
    }

    return buildContentFromSaved(parsed)
  } catch {
    return null
  }
}

const writeCachedSiteContent = (contentValue) => {
  try {
    const { loader: _ignoredLoader, ...contentWithoutLoader } = contentValue ?? {}
    window.localStorage.setItem(SITE_CONTENT_CACHE_KEY, JSON.stringify(contentWithoutLoader))
  } catch {
    // Ignore quota / private-mode failures.
  }
}

function App() {
  const [routeHash, setRouteHash] = useState(() => window.location.hash)
  const cachedContent = useMemo(() => readCachedSiteContent(), [])
  const [content, setContent] = useState(() => cachedContent ?? defaultContent)
  const [contentSectionId, setContentSectionId] = useState(null)
  const [isContentBootstrapped, setIsContentBootstrapped] = useState(Boolean(cachedContent))
  const [allowContentSave, setAllowContentSave] = useState(false)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(
    () => window.localStorage.getItem(ADMIN_AUTH_STORAGE_KEY) === 'true',
  )
  const [adminToken, setAdminToken] = useState(
    () => window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) || '',
  )

  const tokenPayload = useMemo(() => parseJwtPayload(adminToken), [adminToken])
  const tokenRole = tokenPayload?.role || ''
  const [adminLoginForm, setAdminLoginForm] = useState({ username: '', password: '' })
  const [adminLoginError, setAdminLoginError] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [today, setToday] = useState(new Date())
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    emailId: '',
    designation: '',
    institution: '',
    participantType: '',
    mode: '',
    apaarId: '',
    declaration: '',
  })
  const [isSubmittingRegistration, setIsSubmittingRegistration] = useState(false)
  const [registrationSubmitMessage, setRegistrationSubmitMessage] = useState('')
  const [registrationSubmitError, setRegistrationSubmitError] = useState('')
  const [registrationToastMessage, setRegistrationToastMessage] = useState('')
  const saveTimerRef = useRef(null)

  useEffect(() => {
    const id = window.setInterval(() => setToday(new Date()), 60000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    const onHashChange = () => setRouteHash(window.location.hash)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    window.localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, isAdminAuthenticated ? 'true' : 'false')
  }, [isAdminAuthenticated])

  useEffect(() => {
    if (adminToken) {
      window.localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, adminToken)
      return
    }

    window.localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY)
  }, [adminToken])

  useEffect(() => {
    let isMounted = true

    const loadContentFromDB = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/sections`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
          },
        })
        if (!response.ok) {
          throw new Error('Failed to fetch content from database')
        }

        const payload = await response.json()
        const sections = Array.isArray(payload.data) ? payload.data : []
        const siteContentSection = sections.find((item) => item.key === SITE_CONTENT_KEY)

        if (siteContentSection?.content && isMounted) {
          const nextContent = buildContentFromSaved(siteContentSection.content)
          setContent(nextContent)
          setContentSectionId(siteContentSection._id)
          writeCachedSiteContent(nextContent)
          setAllowContentSave(true)
        } else if (isMounted) {
          // No server document yet — keep local defaults and allow first save to create it.
          setAllowContentSave(true)
        }
      } catch (error) {
        console.error(error)
        // Keep cached/default content visible; do not overwrite server on failed fetch.
      } finally {
        if (isMounted) {
          setIsContentBootstrapped(true)
        }
      }
    }

    loadContentFromDB()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!isContentBootstrapped || !allowContentSave) {
      return undefined
    }

    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current)
    }

    saveTimerRef.current = window.setTimeout(async () => {
      try {
        const { loader: _ignoredLoader, ...contentWithoutLoader } = content
        writeCachedSiteContent(contentWithoutLoader)

        const requestBody = {
          key: SITE_CONTENT_KEY,
          title: 'Site Content',
          content: contentWithoutLoader,
          isPublished: true,
        }

        const isUpdate = Boolean(contentSectionId)
        const response = await fetch(
          isUpdate ? `${API_BASE_URL}/sections/${contentSectionId}` : `${API_BASE_URL}/sections`,
          {
            method: isUpdate ? 'PUT' : 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
            },
            body: JSON.stringify(requestBody),
            cache: 'no-store',
          },
        )

        if (!response.ok) {
          throw new Error('Failed to sync content with database')
        }

        if (!isUpdate) {
          const payload = await response.json()
          if (payload.data?._id) {
            setContentSectionId(payload.data._id)
          }
        }
      } catch (error) {
        console.error(error)
      }
    }, 600)

    return () => {
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current)
      }
    }
  }, [content, contentSectionId, isContentBootstrapped, allowContentSave])

  useEffect(() => {
    const normalizedConveners = normalizeConveners(content.committee.conveners)

    if (JSON.stringify(normalizedConveners) === JSON.stringify(content.committee.conveners)) {
      return
    }

    setContent((prev) => ({
      ...prev,
      committee: {
        ...prev.committee,
        conveners: normalizedConveners,
      },
    }))
  }, [content.committee.conveners])

  useEffect(() => {
    if (!isRegisterOpen) {
      return undefined
    }

    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setIsRegisterOpen(false)
      }
    }

    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isRegisterOpen])

  useEffect(() => {
    if (!isRegisterOpen) {
      return undefined
    }

    const scrollY = window.scrollY
    const previousBodyStyles = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    }

    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'

    return () => {
      document.body.style.overflow = previousBodyStyles.overflow
      document.body.style.position = previousBodyStyles.position
      document.body.style.top = previousBodyStyles.top
      document.body.style.width = previousBodyStyles.width
      window.scrollTo(0, scrollY)
    }
  }, [isRegisterOpen])

  const openRegistrationForm = () => {
    setIsMenuOpen(false)
    setIsRegisterOpen(true)
  }

  const closeRegistrationForm = () => {
    setIsRegisterOpen(false)
  }

  const handleFieldChange = (event) => {
    const { name, value, files, type } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'file' ? files?.[0] ?? null : value,
    }))
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault()

    setRegistrationSubmitError('')
    setRegistrationSubmitMessage('')
    setIsSubmittingRegistration(true)

    try {
      const payload = {
        fullName: formData.fullName,
        mobileNumber: formData.mobileNumber,
        emailId: formData.emailId,
        designation: formData.designation,
        institution: formData.institution,
        participantType: formData.participantType,
        mode: formData.mode,
        apaarId: formData.apaarId?.trim?.() ?? '',
        declaration: formData.declaration,
      }

      const response = await fetch(`${API_BASE_URL}/registrations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMessage = data.message || data.errors?.[0]?.msg || 'Failed to submit registration'
        throw new Error(errorMessage)
      }

      setRegistrationSubmitMessage('Registration submitted successfully and saved to database.')
      setRegistrationToastMessage('Registration successful')
      setFormData({
        fullName: '',
        mobileNumber: '',
        emailId: '',
        designation: '',
        institution: '',
        participantType: '',
        mode: '',
        apaarId: '',
        declaration: '',
      })
      window.setTimeout(() => {
        setIsRegisterOpen(false)
      }, 700)
      window.setTimeout(() => {
        setRegistrationToastMessage('')
      }, 3000)
    } catch (error) {
      setRegistrationSubmitError(error.message || 'Failed to submit registration')
    } finally {
      setIsSubmittingRegistration(false)
    }
  }

  const handleAdminLoginChange = (event) => {
    const { name, value } = event.target
    setAdminLoginForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleAdminLoginSubmit = async (event) => {
    event.preventDefault()

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: adminLoginForm.username.trim(),
          password: adminLoginForm.password,
        }),
      })

      const payload = await response.json()
      if (!response.ok || !payload?.data?.token) {
        throw new Error(payload?.message || 'Invalid username or password.')
      }

      setAdminToken(payload.data.token)
      setIsAdminAuthenticated(true)
      setAdminLoginError('')
      setAdminLoginForm({ username: '', password: '' })
      return
    } catch {
      // Login is intentionally backend-only for production readiness.
    }

    setAdminLoginError('Invalid username or password.')
  }

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false)
    setAdminToken('')
    setAdminLoginForm({ username: '', password: '' })
    setAdminLoginError('')
    window.location.hash = ''
  }

  const daysLeft = useMemo(() => {
    const target = new Date('2026-06-01T00:00:00')
    const diffMs = target.getTime() - today.getTime()
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }, [today])

  const registrationSections = useMemo(() => {
    const grouped = {}
    const order = []
    const formFields = Array.isArray(content.registration?.formFields)
      ? content.registration.formFields
      : []

    for (const field of formFields) {
      const sectionName = field.section || 'Additional Details'
      if (!grouped[sectionName]) {
        grouped[sectionName] = []
        order.push(sectionName)
      }
      grouped[sectionName].push(field)
    }

    return order.map((sectionName) => ({
      title: sectionName,
      fields: grouped[sectionName],
    }))
  }, [content.registration?.formFields])

  const downloadSchedule = async () => {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF({ unit: 'mm', format: 'a4' })
    const datePart = new Date().toISOString().slice(0, 10)
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const marginX = 14
    const contentWidth = pageWidth - marginX * 2
    const headerHeight = 28
    const footerReserve = 14

    const drawPageHeader = () => {
      doc.setFillColor(11, 107, 107)
      doc.rect(0, 0, pageWidth, headerHeight, 'F')

      doc.setTextColor(255, 255, 255)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(14)
      doc.text(sectionContent.schedule.heading || 'Program Schedule', marginX, 12)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, marginX, 19)
    }

    let y = headerHeight + 10
    drawPageHeader()

    if (!Array.isArray(content.schedule) || content.schedule.length === 0) {
      doc.setTextColor(58, 74, 89)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(11)
      doc.text('No schedule entries are available right now.', marginX, y)
    }

    content.schedule.forEach((day) => {
      const dayLabel = [day.dayTitle, day.date].filter(Boolean).join('  ·  ')
      const dayLines = doc.splitTextToSize(dayLabel || 'Program Day', contentWidth)

      if (y + 18 > pageHeight - footerReserve) {
        doc.addPage()
        drawPageHeader()
        y = headerHeight + 10
      }

      doc.setTextColor(11, 107, 107)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      doc.text(dayLines, marginX, y)
      y += dayLines.length * 5.5 + 3

      doc.setFillColor(11, 107, 107)
      doc.rect(marginX, y, contentWidth, 8, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      doc.text('Time', marginX + 3, y + 5.4)
      doc.text('Session Title', marginX + 52, y + 5.4)
      y += 8

      ;(day.sessions ?? []).forEach((session) => {
        const timeLines = doc.splitTextToSize(session.time || '-', 44)
        const titleLines = doc.splitTextToSize(session.title || '-', contentWidth - 52)
        const rowHeight = Math.max(timeLines.length, titleLines.length) * 4.4 + 4

        if (y + rowHeight > pageHeight - footerReserve) {
          doc.addPage()
          drawPageHeader()
          y = headerHeight + 10
        }

        doc.setDrawColor(197, 208, 215)
        doc.setFillColor(255, 255, 255)
        doc.rect(marginX, y, contentWidth, rowHeight, 'FD')
        doc.line(marginX + 48, y, marginX + 48, y + rowHeight)

        doc.setTextColor(21, 32, 40)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        doc.text(timeLines, marginX + 3, y + 4.5)
        doc.text(titleLines, marginX + 52, y + 4.5)
        y += rowHeight
      })

      y += 6
    })

    const totalPages = doc.getNumberOfPages()
    for (let pageIndex = 1; pageIndex <= totalPages; pageIndex += 1) {
      doc.setPage(pageIndex)
      doc.setDrawColor(220, 230, 240)
      doc.line(marginX, pageHeight - 10, pageWidth - marginX, pageHeight - 10)
      doc.setTextColor(120, 136, 153)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.text(`Page ${pageIndex} of ${totalPages}`, pageWidth / 2, pageHeight - 5.5, {
        align: 'center',
      })
    }

    doc.save(`seminar-schedule-${datePart}.pdf`)
  }

  const isSuperAdminPage = routeHash === '#superadmin'
  const isAdminPage = routeHash === '#admin'

  if (!isContentBootstrapped) {
    return <div className="content-boot" aria-busy="true" aria-live="polite" />
  }

  if (isSuperAdminPage) {
    if (!isAdminAuthenticated) {
      return (
        <main className="admin-login-page">
          <header className="admin-login-nav">
            <div className="admin-login-nav-inner">
              <p className="admin-login-brand">QuBioDL 2K26</p>
              <a href="#" className="admin-login-home-link">Back to Home</a>
            </div>
          </header>
          <section className="admin-login-card">
            <h1>Portal Login</h1>
            <p>Sign in to open the content control panel.</p>
            <form className="admin-login-form" onSubmit={handleAdminLoginSubmit}>
              <label>
                User ID
                <input
                  type="text"
                  name="username"
                  value={adminLoginForm.username}
                  onChange={handleAdminLoginChange}
                  required
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  name="password"
                  value={adminLoginForm.password}
                  onChange={handleAdminLoginChange}
                  required
                />
              </label>
              {adminLoginError ? <p className="admin-login-error">{adminLoginError}</p> : null}
              <button type="submit" className="btn btn-primary admin-login-btn">
                Login
              </button>
            </form>
          </section>
        </main>
      )
    }

    if (tokenRole !== 'superadmin') {
      return (
        <main className="admin-login-page">
          <header className="admin-login-nav">
            <div className="admin-login-nav-inner">
              <p className="admin-login-brand">QuBioDL 2K26</p>
              <a href="#" className="admin-login-home-link">Back to Home</a>
            </div>
          </header>
          <section className="admin-login-card">
            <h1>Access Restricted</h1>
            <p>This portal is for Super Admin only.</p>
            <button type="button" className="btn btn-primary admin-login-btn" onClick={handleAdminLogout}>
              Logout
            </button>
          </section>
        </main>
      )
    }

    return (
      <AdminPage
        content={content}
        onContentChange={setContent}
        onLogout={handleAdminLogout}
        apiBaseUrl={API_BASE_URL}
        adminToken={adminToken}
      />
    )
  }

  if (isAdminPage) {
    if (!isAdminAuthenticated) {
      return (
        <main className="admin-login-page">
          <header className="admin-login-nav">
            <div className="admin-login-nav-inner">
              <p className="admin-login-brand">QuBioDL 2K26</p>
              <a href="#" className="admin-login-home-link">Back to Home</a>
            </div>
          </header>
          <section className="admin-login-card">
            <h1>Admin Login</h1>
            <p>Sign in to open the registrations admin panel.</p>
            <form className="admin-login-form" onSubmit={handleAdminLoginSubmit}>
              <label>
                User ID
                <input
                  type="text"
                  name="username"
                  value={adminLoginForm.username}
                  onChange={handleAdminLoginChange}
                  required
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  name="password"
                  value={adminLoginForm.password}
                  onChange={handleAdminLoginChange}
                  required
                />
              </label>
              {adminLoginError ? <p className="admin-login-error">{adminLoginError}</p> : null}
              <button type="submit" className="btn btn-primary admin-login-btn">
                Login
              </button>
            </form>
          </section>
        </main>
      )
    }

    if (tokenRole !== 'admin') {
      return (
        <main className="admin-login-page">
          <header className="admin-login-nav">
            <div className="admin-login-nav-inner">
              <p className="admin-login-brand">QuBioDL 2K26</p>
              <a href="#" className="admin-login-home-link">Back to Home</a>
            </div>
          </header>
          <section className="admin-login-card">
            <h1>Access Restricted</h1>
            <p>This portal is for Admin only.</p>
            <button type="button" className="btn btn-primary admin-login-btn" onClick={handleAdminLogout}>
              Logout
            </button>
          </section>
        </main>
      )
    }

    return (
      <AdminRegistrationsPage
        apiBaseUrl={API_BASE_URL}
        adminToken={adminToken}
        onLogout={handleAdminLogout}
      />
    )
  }

  const navbarConfig = content.navbar
  const sectionContent = content.sections
  const speakers = content.speakers

  return (
    <>
      <div className={`page-shell ${isRegisterOpen ? 'is-blurred' : ''}`}>
      <header className="topbar">
        <div className="container topbar-inner">
          <div className="brand-wrap">
            <div className="navbar-logo-stack">
              {navbarConfig.logos.map((logo, index) => (
                <img src={logo} alt={`Navbar logo ${index + 1}`} className="navbar-logo" key={`main-logo-${index}`} />
              ))}
            </div>
            <p className="brand">
              {navbarConfig.brand}
              <span>{navbarConfig.subBrand}</span>
            </p>
          </div>
          <button
            type="button"
            className="menu-btn"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? 'Close' : 'Menu'}
          </button>
          <nav className={`nav-links ${isMenuOpen ? 'is-open' : ''}`}>
            {navbarConfig.links.map((link, index) => (
              <a href={link.href} key={`main-link-${index}`} onClick={() => setIsMenuOpen(false)}>
                {link.label}
              </a>
            ))}
            <button type="button" className="btn btn-primary" onClick={openRegistrationForm}>
              Register Now
            </button>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-rings" aria-hidden="true"></div>
          <div className="container hero-content">
            <p className="hero-brand">
              {navbarConfig.brand}
              {navbarConfig.subBrand ? ` ${navbarConfig.subBrand}` : ''}
            </p>
            <p className="hero-eyebrow">{sectionContent.hero.pill}</p>
            <h1>
              {sectionContent.hero.titlePrefix} <span>{sectionContent.hero.titleHighlight}</span>
            </h1>
            <p className="hero-subtitle">{sectionContent.hero.subtitle}</p>
            <div className="hero-actions">
              <button type="button" className="btn btn-primary" onClick={openRegistrationForm}>
                {sectionContent.hero.registerButtonText}
              </button>
              <a className="btn btn-ghost" href="#schedule">
                {sectionContent.hero.scheduleButtonText}
              </a>
            </div>
            <p className="hero-meta-line">
              <span>{sectionContent.hero.metaDate}</span>
              <span className="hero-meta-dot" aria-hidden="true" />
              <span>{sectionContent.hero.metaMode}</span>
              <span className="hero-meta-dot" aria-hidden="true" />
              <span>{sectionContent.hero.metaSeats}</span>
              <span className="hero-meta-dot" aria-hidden="true" />
              <span>
                {daysLeft} {sectionContent.hero.daysLeftSuffix}
              </span>
            </p>
          </div>
        </section>

        <section id="about" className="section section-soft">
          <div className="section-about-modern about-grid">
            {/* Left: Text Content */}
            <div className="about-text">
              <h2 className="about-heading">
                <span className="about-heading-accent"></span>
                {sectionContent.about.heading}
              </h2>
              <h3>{sectionContent.about.subheading}</h3>
              <p>{sectionContent.about.intro}</p>
              <h4>{sectionContent.about.handsOnHeading}</h4>
              <p>{sectionContent.about.handsOnText}</p>
              <h4>{sectionContent.about.collaborationHeading}</h4>
              <p>{sectionContent.about.collaborationText}</p>
            </div>
            {/* Right: Highlight Card */}
            <div className="about-highlight-card">
              <h3>{sectionContent.about.takeawaysHeading}</h3>
              <ul>
                {sectionContent.about.takeaways.map((item, index) => (
                  <li key={`takeaway-${index}`}>{item}</li>
                ))}
              </ul>
              <button type="button" className="btn btn-primary about-cta" onClick={openRegistrationForm}>
                {sectionContent.about.ctaText}
              </button>
            </div>
          </div>
        </section>

        <section id="objectives" className="section">
          <div className="container">
            <div className="section-head">
              <h2>{sectionContent.objectives.heading}</h2>
              <div className="section-line"></div>
            </div>
            <div className="objective-grid">
              {sectionContent.objectives.items.map((item, index) => (
                <article className="card glass" key={item.title}>
                  <div className={`objective-icon icon-${index + 1}`}>
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-soft">
          <div className="container narrow">
            <h2 className="center">{sectionContent.legacy.heading}</h2>
            {sectionContent.legacy.entries.map((entry, index) => (
              <details className="accordion" open={index === 0} key={`${entry.title}-${index}`}>
                <summary>
                  <span>
                    <span className="material-symbols-outlined">{entry.icon}</span> {entry.title}
                  </span>
                  <span className="material-symbols-outlined">expand_more</span>
                </summary>
                <p>{entry.text}</p>
              </details>
            ))}
          </div>
        </section>

        <section id="speakers" className="section section-soft">
          <div className="container resource-container">
            <h2 className="center">{sectionContent.speakers.heading}</h2>
            <p className="center subhead">{sectionContent.speakers.subhead}</p>
            <div className="row-top">
              {speakers.slice(0, 3).map((speaker) => (
                <article className={`resource-card ${speaker.image ? '' : 'resource-card-no-image'}`} key={speaker.name}>
                  {speaker.image ? <img src={speaker.image} alt={speaker.name} /> : null}
                  <h3>{speaker.name}</h3>
                  <p>{speaker.role}</p>
                  <p className="speaker-org">{speaker.org}</p>
                </article>
              ))}
            </div>
            <div className="row-bottom">
              {speakers.slice(3).map((speaker) => (
                <article className={`resource-card ${speaker.image ? '' : 'resource-card-no-image'}`} key={speaker.name}>
                  {speaker.image ? <img src={speaker.image} alt={speaker.name} /> : null}
                  <h3>{speaker.name}</h3>
                  <p>{speaker.role}</p>
                  <p className="speaker-org">{speaker.org}</p>
                </article>
              ))}
            </div>
            <div className="target-participants">
              <h3>{sectionContent.speakers.participantsTitle}</h3>
              <p>{sectionContent.speakers.participantsText}</p>
            </div>
          </div>
        </section>

        <section id="committee" className="section">
          <div className="container">
            <h2 className="center">{sectionContent.committee.heading}</h2>
            <div className="committee-top center">
              {/* <p className="committee-kicker">Organized by</p> */}
              <h3>{content.committee.department}</h3>
              <h4>{content.committee.school}</h4>
            </div>
            <div className="committee-stack">
              <section className="committee-group">
                <h3 className="section-label">{sectionContent.committee.chiefPatronsLabel}</h3>
                <div className="committee-member-grid">
                  {content.committee.chiefPatrons.map((member, index) => (
                    <article className="committee-member-card" key={`${member.name}-${index}`}>
                      {member.image ? <img className="committee-photo" src={member.image} alt={member.name} /> : null}
                      <p className="committee-name">{member.name}</p>
                      {member.details ? <p className="committee-role">{member.details}</p> : null}
                    </article>
                  ))}
                </div>
              </section>

              <section className="committee-group">
                <h3 className="section-label">{sectionContent.committee.patronsLabel}</h3>
                <div className="programme-grid">
                  {content.committee.patrons.map((member, index) => (
                    <article className="card committee-text-card" key={`${member.name}-${index}`}>
                      {member.image ? <img className="committee-photo" src={member.image} alt={member.name} /> : null}
                      <p className="committee-name">{member.name}</p>
                      {member.details ? <p className="committee-role">{member.details}</p> : null}
                    </article>
                  ))}
                </div>
              </section>

              <section className="committee-group">
                <h3 className="section-label">{sectionContent.committee.programmeChairsLabel}</h3>
                <div className="programme-grid">
                  {content.committee.programmeChairs.map((chair, index) => (
                    <article className="card committee-text-card" key={`${chair.name}-${index}`}>
                      {chair.image ? <img className="committee-photo" src={chair.image} alt={chair.name} /> : null}
                      <p className="committee-name">{chair.name}</p>
                      <p className="committee-role">{chair.role}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="committee-group committee-highlight">
                <h3 className="section-label">{sectionContent.committee.convenersLabel}</h3>
                <div className="convener-grid">
                  {content.committee.conveners.map((convener, index) => (
                    <article className="committee-contact-card" key={`${convener.name}-${index}`}>
                      {convener.image ? <img className="committee-photo" src={convener.image} alt={convener.name} /> : null}
                      <h4>{convener.title}</h4>
                      <p className="committee-name">{convener.name}</p>
                      <p className="committee-role">{convener.role}</p>
                      <p>Contact: {convener.contact}</p>
                      <p>Email: {convener.email}</p>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container narrow">
            <h2 className="center">{sectionContent.audience.heading}</h2>
            <div className="audience-grid">
              {sectionContent.audience.items.map((item, index) => (
                <p key={`${item.label}-${index}`}>
                  <span className="material-symbols-outlined">{item.icon}</span>
                  {item.label}
                </p>
              ))}
            </div>
            <article className="cert-note">
              <div className="cert-icon">
                <span className="material-symbols-outlined">verified</span>
              </div>
              <div>
                <h3>{sectionContent.audience.certificationTitle}</h3>
                <p>{sectionContent.audience.certificationText}</p>
              </div>
            </article>
          </div>
        </section>

        <section id="registration" className="section">
          <div className="container">
            <div className="cta-block">
              <h2>{sectionContent.cta.heading}</h2>
              <p>{sectionContent.cta.text}</p>
              <p className="fee-label">{sectionContent.cta.feeLabel}</p>
              <div className="fee">{sectionContent.cta.feeValue}</div>
              <button type="button" className="btn btn-light" onClick={openRegistrationForm}>
                {sectionContent.cta.registerButtonText}
              </button>
              <p className="cta-note">{sectionContent.cta.note}</p>
            </div>
          </div>
        </section>

        <section id="schedule" className="section section-soft">
          <div className="container">
            <div className="timeline-head">
              <h2>{sectionContent.schedule.heading}</h2>
              <button className="timeline-btn" type="button" onClick={downloadSchedule}>
                <span className="material-symbols-outlined">download</span>
                {sectionContent.schedule.buttonText}
              </button>
            </div>

            <div className="program-schedule">
              {content.schedule.map((day, dayIndex) => (
                <article className="program-day-card" key={`${day.dayTitle}-${dayIndex}`}>
                  <header className="program-day-header">
                    <div className="program-day-heading">
                      <span className="program-day-badge">Day {dayIndex + 1}</span>
                      <h3>{day.dayTitle?.replace(/^DAY\s*\d+\s*:\s*/i, '') || day.dayTitle}</h3>
                    </div>
                    {day.date ? <span className="program-day-date">{day.date}</span> : null}
                  </header>
                  <div className="program-table-wrap">
                    <table className="program-table">
                      <thead>
                        <tr>
                          <th scope="col">Time</th>
                          <th scope="col">Session Title</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(day.sessions ?? []).map((session, sessionIndex) => {
                          const title = session.title || ''
                          const isBreak = /^(refreshments|lunch|hi-tea)$/i.test(title.trim())
                          return (
                            <tr
                              key={`${dayIndex}-${sessionIndex}-${session.time}`}
                              className={isBreak ? 'is-break' : undefined}
                            >
                              <td>
                                <span className="program-time">{session.time}</span>
                              </td>
                              <td>
                                <span className="program-session-title">{title}</span>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </article>
              ))}
            </div>

            {sectionContent.schedule.note ? (
              <p className="timeline-note">{sectionContent.schedule.note}</p>
            ) : null}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <h3>{sectionContent.footer.eventTitle}</h3>
            <p>{sectionContent.footer.eventText}</p>
            <div className="footer-icons">
              <span className="material-symbols-outlined">share</span>
              <span className="material-symbols-outlined">alternate_email</span>
            </div>
          </div>
          <div>
            <h3>{sectionContent.footer.departmentTitle}</h3>
            <p>{sectionContent.footer.departmentText}</p>
          </div>
          <div>
            <h3>{sectionContent.footer.linksTitle}</h3>
            <ul>
              {sectionContent.footer.links.map((link, index) => (
                <li key={`footer-link-${index}`}>{link}</li>
              ))}
            </ul>
          </div>
        </div>
      </footer>

      <div className="copyright">
        {sectionContent.footer.copyright}
      </div>

      </div>

      {isRegisterOpen ? (
        <div
          className="registration-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="registration-modal-title"
          onClick={closeRegistrationForm}
        >
          <div className="registration-modal" onClick={(event) => event.stopPropagation()}>
            <div className="registration-modal-head">
              <h2 id="registration-modal-title">
                {content.registration?.modalTitle || 'Registration Form'}
              </h2>
              <button
                type="button"
                className="registration-close-btn"
                onClick={closeRegistrationForm}
                aria-label="Close registration form"
              >
                ×
              </button>
            </div>

            <form className="registration-form" onSubmit={handleFormSubmit}>
              {registrationSections.map((section) => (
                <fieldset key={section.title}>
                  <legend>{section.title}</legend>
                  {section.fields.map((field) => (
                    <label key={field.id}>
                      {field.label}
                      {field.type === 'select' ? (
                        <select
                          name={field.name}
                          value={formData[field.name] ?? ''}
                          onChange={handleFieldChange}
                          required={field.required}
                        >
                          <option value="">Select option</option>
                          {(field.options ?? []).map((option, index) => (
                            <option value={option} key={`${field.id}-option-${index}`}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : field.type === 'file' ? (
                        <input
                          type="file"
                          name={field.name}
                          accept="image/*"
                          onChange={handleFieldChange}
                          required={field.required}
                        />
                      ) : (
                        <input
                          type={field.type || 'text'}
                          name={field.name}
                          value={formData[field.name] ?? ''}
                          onChange={handleFieldChange}
                          required={field.required}
                        />
                      )}
                    </label>
                  ))}
                </fieldset>
              ))}

              <div className="registration-form-actions">
                <button type="button" className="btn btn-ghost" onClick={closeRegistrationForm}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`btn btn-primary registration-submit-btn ${isSubmittingRegistration ? 'is-loading' : ''}`}
                  disabled={isSubmittingRegistration}
                >
                  {isSubmittingRegistration ? (
                    <>
                      <span className="registration-spinner" aria-hidden="true"></span>
                      Submitting...
                    </>
                  ) : (
                    'Submit'
                  )}
                </button>
              </div>
              {registrationSubmitMessage ? <p>{registrationSubmitMessage}</p> : null}
              {registrationSubmitError ? <p>{registrationSubmitError}</p> : null}
            </form>
          </div>
        </div>
      ) : null}

      {registrationToastMessage ? (
        <div className="registration-toast-overlay" role="status" aria-live="polite">
          <div className="registration-toast-window">
            <p className="registration-toast-title">Success</p>
            <p className="registration-toast-message">{registrationToastMessage}</p>
            <button
              type="button"
              className="btn btn-primary registration-toast-btn"
              onClick={() => setRegistrationToastMessage('')}
            >
              OK
            </button>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default App
