import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import AdminPage from './AdminPage.jsx'
import bala from './assets/bala.jpg'
import noni from './assets/noni.png'
import subbu from './assets/subbu.png'
import kapil from './assets/kapil.png'
import kumar from './assets/kumar.png'
import vignanLogo from './assets/vignan logo updated.png'

const ADMIN_AUTH_STORAGE_KEY = 'qubiodl-admin-auth'
const ADMIN_TOKEN_STORAGE_KEY = 'qubiodl-admin-token'
const REQUIRED_CONVENER_NAME = 'Dr. Sunil Babu Melingi'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const SITE_CONTENT_KEY = 'site-content'
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
    type: 'text',
    required: true,
    section: '3. Participation',
    options: [],
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
    id: 'passport-photo',
    name: 'passportPhoto',
    label: 'Passport Size Photo (Attach)',
    type: 'file',
    required: true,
    section: '4. Upload',
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
  {
    id: 'signature',
    name: 'signature',
    label: 'Signature',
    type: 'text',
    required: true,
    section: '5. Declaration',
    options: [],
  },
]
const DEFAULT_NAVBAR_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Objectives', href: '#objectives' },
  { label: 'Committee', href: '#committee' },
  { label: 'Speakers', href: '#speakers' },
  { label: 'Portal', href: '#admin' },
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
    patronsLabel: 'Patrons',
    programmeChairsLabel: 'Programme Chairs',
    convenersLabel: 'Convener & Co-Convener',
  },
  audience: {
    heading: 'Who Should Attend?',
    items: [
      { icon: 'school', label: 'Faculty' },
      { icon: 'psychology', label: 'Researchers' },
      { icon: 'experiment', label: 'Ph.D. Scholars' },
      { icon: 'stethoscope', label: 'Clinicians' },
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
    heading: 'FDP Timeline Overview',
    buttonText: 'Download PDF Schedule',
    note: '... and more detailed sessions across the 5 days.',
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
      const href = item?.href ?? '#'
      const rawLabel = item?.label ?? ''
      const label =
        href === '#admin' && rawLabel.trim().toLowerCase() === 'admin' ? 'Portal' : rawLabel

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
    },
    audience: {
      ...DEFAULT_SECTION_CONTENT.audience,
      ...(source.audience ?? {}),
      items:
        Array.isArray(source.audience?.items) && source.audience.items.length > 0
          ? source.audience.items
          : DEFAULT_SECTION_CONTENT.audience.items,
    },
    cta: {
      ...DEFAULT_SECTION_CONTENT.cta,
      ...(source.cta ?? {}),
    },
    schedule: {
      ...DEFAULT_SECTION_CONTENT.schedule,
      ...(source.schedule ?? {}),
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
      passportPhoto: 'passportPhoto',
      declaration: 'declaration',
      signature: 'signature',
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

    uniqueConveners.push(item)
  }

  return uniqueConveners
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
  schedule: [
    {
      title: 'Day 1: Genesis',
      text: 'Inauguration, Introduction to Quantum Computing & Linear Algebra.',
    },
    {
      title: 'Day 2: Qubit Logic',
      text: 'Quantum Gates, Circuits and IBM Qiskit hands-on sessions.',
    },
    {
      title: 'Day 3: Deep Vision',
      text: 'Medical Image Processing & Advanced CNN architectures for healthcare.',
    },
  ],
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
        title: 'Co-Convener',
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

    return {
      ...defaultContent,
      ...saved,
      registration: {
        ...defaultContent.registration,
        ...(saved.registration ?? {}),
        formFields: normalizedRegistrationFields,
      },
      navbar: {
        ...defaultContent.navbar,
        ...(saved.navbar ?? {}),
        links: normalizeNavbarLinks(saved.navbar?.links),
        logos: normalizeNavbarLogos(saved.navbar?.logos),
      },
      schedule: Array.isArray(saved.schedule) ? saved.schedule : defaultContent.schedule,
      speakers: Array.isArray(saved.speakers) ? saved.speakers : defaultContent.speakers,
      committee: {
        ...defaultContent.committee,
        ...(saved.committee ?? {}),
        chiefPatrons: normalizeCommitteeMembers(
          Array.isArray(saved.committee?.chiefPatrons)
            ? saved.committee.chiefPatrons
            : defaultContent.committee.chiefPatrons,
        ),
        patrons: normalizeCommitteeMembers(
          Array.isArray(saved.committee?.patrons)
            ? saved.committee.patrons
            : defaultContent.committee.patrons,
        ),
        programmeChairs: Array.isArray(saved.committee?.programmeChairs)
          ? saved.committee.programmeChairs
          : defaultContent.committee.programmeChairs,
        conveners: normalizedConveners,
      },
      sections: normalizeSections(saved.sections),
    }
  } catch {
    return defaultContent
  }
}

const getInitialContent = () => defaultContent

function App() {
  const [routeHash, setRouteHash] = useState(() => window.location.hash)
  const [content, setContent] = useState(getInitialContent)
  const [contentSectionId, setContentSectionId] = useState(null)
  const [isContentBootstrapped, setIsContentBootstrapped] = useState(false)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(
    () => window.localStorage.getItem(ADMIN_AUTH_STORAGE_KEY) === 'true',
  )
  const [adminToken, setAdminToken] = useState(
    () => window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) || '',
  )
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
    passportPhoto: null,
    declaration: '',
    signature: '',
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
        const response = await fetch(`${API_BASE_URL}/sections`)
        if (!response.ok) {
          throw new Error('Failed to fetch content from database')
        }

        const payload = await response.json()
        const sections = Array.isArray(payload.data) ? payload.data : []
        const siteContentSection = sections.find((item) => item.key === SITE_CONTENT_KEY)

        if (siteContentSection?.content && isMounted) {
          setContent(buildContentFromSaved(siteContentSection.content))
          setContentSectionId(siteContentSection._id)
        }
      } catch (error) {
        console.error(error)
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
    if (!isContentBootstrapped) {
      return undefined
    }

    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current)
    }

    saveTimerRef.current = window.setTimeout(async () => {
      try {
        const requestBody = {
          key: SITE_CONTENT_KEY,
          title: 'Site Content',
          content,
          isPublished: true,
        }

        const isUpdate = Boolean(contentSectionId)
        const response = await fetch(
          isUpdate ? `${API_BASE_URL}/sections/${contentSectionId}` : `${API_BASE_URL}/sections`,
          {
            method: isUpdate ? 'PUT' : 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
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
  }, [content, contentSectionId, isContentBootstrapped])

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

  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      if (!file) {
        resolve('')
        return
      }

      const reader = new FileReader()
      reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '')
      reader.onerror = () => reject(new Error('Failed to read passport photo'))
      reader.readAsDataURL(file)
    })

  const handleFormSubmit = async (event) => {
    event.preventDefault()

    setRegistrationSubmitError('')
    setRegistrationSubmitMessage('')
    setIsSubmittingRegistration(true)

    try {
      if (formData.passportPhoto && formData.passportPhoto.size > 3 * 1024 * 1024) {
        throw new Error('Passport photo must be 3MB or smaller.')
      }

      const passportPhotoData = await fileToDataUrl(formData.passportPhoto)

      const payload = {
        fullName: formData.fullName,
        mobileNumber: formData.mobileNumber,
        emailId: formData.emailId,
        designation: formData.designation,
        institution: formData.institution,
        participantType: formData.participantType,
        mode: formData.mode,
        passportPhoto: passportPhotoData,
        declaration: formData.declaration,
        signature: formData.signature,
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
        passportPhoto: null,
        declaration: '',
        signature: '',
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

    for (const field of content.registration.formFields) {
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
  }, [content.registration.formFields])

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
      doc.setFillColor(8, 90, 112)
      doc.rect(0, 0, pageWidth, headerHeight, 'F')

      doc.setTextColor(255, 255, 255)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(16)
      doc.text('FDP Schedule', marginX, 12)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, marginX, 19)
    }

    let y = headerHeight + 10
    drawPageHeader()

    if (content.schedule.length === 0) {
      doc.setTextColor(58, 74, 89)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(11)
      doc.text('No schedule entries are available right now.', marginX, y)
    }

    content.schedule.forEach((item, index) => {
      const titleLines = doc.splitTextToSize(`${index + 1}. ${item.title || 'Schedule Item'}`, contentWidth - 12)
      const descriptionLines = doc.splitTextToSize(item.text || '', contentWidth - 12)
      const cardHeight = 8 + titleLines.length * 5 + 3 + descriptionLines.length * 4.8 + 6

      if (y + cardHeight > pageHeight - footerReserve) {
        doc.addPage()
        drawPageHeader()
        y = headerHeight + 10
      }

      doc.setFillColor(245, 250, 255)
      doc.setDrawColor(199, 219, 236)
      doc.roundedRect(marginX, y, contentWidth, cardHeight, 2.5, 2.5, 'FD')

      doc.setFillColor(8, 90, 112)
      doc.roundedRect(marginX + 2, y + 2, 1.6, cardHeight - 4, 0.8, 0.8, 'F')

      let textY = y + 7
      doc.setTextColor(21, 52, 79)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11.5)
      doc.text(titleLines, marginX + 6, textY)
      textY += titleLines.length * 5 + 1

      doc.setTextColor(66, 85, 102)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.text(descriptionLines, marginX + 6, textY)

      y += cardHeight + 5
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

  if (!isContentBootstrapped) {
    return (
      <main className="app-loader" aria-live="polite" aria-busy="true">
        <span className="app-loader-glow app-loader-glow-a" aria-hidden="true"></span>
        <span className="app-loader-glow app-loader-glow-b" aria-hidden="true"></span>
        <span className="app-loader-grid" aria-hidden="true"></span>
        <div className="app-loader-card">
          <p className="app-loader-kicker">Vignan CSE Presents</p>
          <img src={vignanLogo} alt="Vignan logo" className="app-loader-logo" />
          <p className="app-loader-title">QuBioDL 2K26</p>
          <p className="app-loader-subtitle">Loading conference content...</p>
          <div className="app-loader-progress" aria-hidden="true">
            <span className="app-loader-spinner"></span>
            <span className="app-loader-bar">
              <span></span>
            </span>
          </div>
        </div>
      </main>
    )
  }

  const isAdminPage = routeHash === '#admin'

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
            <p className="pill">{sectionContent.hero.pill}</p>
            <h1>
              {sectionContent.hero.titlePrefix} <span>{sectionContent.hero.titleHighlight}</span>
            </h1>
            <p className="hero-subtitle">{sectionContent.hero.subtitle}</p>
            <div className="hero-meta">
              <span>
                <i aria-hidden="true">◷</i>
                {sectionContent.hero.metaDate}
              </span>
              <span>
                <i aria-hidden="true">✣</i>
                {sectionContent.hero.metaMode}
              </span>
              <span>
                <i aria-hidden="true">◉</i>
                {sectionContent.hero.metaSeats}
              </span>
            </div>
            <div className="hero-actions">
              <button type="button" className="btn btn-primary" onClick={openRegistrationForm}>
                {sectionContent.hero.registerButtonText}
              </button>
              <a className="btn btn-ghost" href="#schedule">
                {sectionContent.hero.scheduleButtonText}
              </a>
            </div>
            <p className="days-left">
              {daysLeft} {sectionContent.hero.daysLeftSuffix}
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
                <div className="committee-member-grid">
                  {content.committee.patrons.map((member, index) => (
                    <article className="committee-member-card" key={`${member.name}-${index}`}>
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
          <div className="container narrow">
            <div className="timeline-head">
              <h2>{sectionContent.schedule.heading}</h2>
              <button className="timeline-btn" type="button" onClick={downloadSchedule}>
                <span className="material-symbols-outlined">download</span>
                {sectionContent.schedule.buttonText}
              </button>
            </div>
            <div className="timeline">
              {content.schedule.map((item, index) => (
                <article className={index % 2 === 0 ? 'left' : 'right'} key={`${item.title}-${index}`}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
            <p className="timeline-note">{sectionContent.schedule.note}</p>
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
              <h2 id="registration-modal-title">{content.registration.modalTitle}</h2>
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
