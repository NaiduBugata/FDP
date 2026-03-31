import { useState } from 'react'
import './AdminPage.css'

const newSpeaker = () => ({
  name: '',
  role: '',
  org: '',
  image: '',
})

const newScheduleItem = () => ({
  title: '',
  text: '',
})

const newProgrammeChair = () => ({
  name: '',
  role: '',
  image: '',
})

const newConvener = () => ({
  title: '',
  name: '',
  role: '',
  contact: '',
  email: '',
  image: '',
})

const newCommitteeMember = () => ({
  name: '',
  details: '',
  image: '',
})

const newObjectiveItem = () => ({
  icon: 'lightbulb',
  title: '',
  text: '',
})

const newLegacyEntry = () => ({
  icon: 'domain',
  title: '',
  text: '',
})

const newAudienceItem = () => ({
  icon: 'school',
  label: '',
})

const newRegistrationFormField = () => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  name: 'newField',
  label: 'New Field',
  type: 'text',
  required: false,
  section: 'Additional Details',
  options: [],
})

const readFileAsDataUrl = (file, onLoad) => {
  if (!file) {
    return
  }

  const reader = new FileReader()
  reader.onload = () => onLoad(typeof reader.result === 'string' ? reader.result : '')
  reader.readAsDataURL(file)
}

const formatRegistrationDate = (value) => {
  if (!value) {
    return '-'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return '-'
  }

  return date.toLocaleString()
}

function AdminPage({ content, onContentChange, onLogout, apiBaseUrl }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isNavbarEditorOpen, setIsNavbarEditorOpen] = useState(false)
  const [isFormEditorOpen, setIsFormEditorOpen] = useState(false)
  const [isScheduleEditorOpen, setIsScheduleEditorOpen] = useState(false)
  const [isSpeakersEditorOpen, setIsSpeakersEditorOpen] = useState(false)
  const [isCommitteeEditorOpen, setIsCommitteeEditorOpen] = useState(false)
  const [isSectionsEditorOpen, setIsSectionsEditorOpen] = useState(false)
  const [isRegistrationsOpen, setIsRegistrationsOpen] = useState(false)
  const [registrations, setRegistrations] = useState([])
  const [isRegistrationsLoading, setIsRegistrationsLoading] = useState(false)
  const [registrationsError, setRegistrationsError] = useState('')
  const [isExportingRegistrations, setIsExportingRegistrations] = useState(false)
  const [activeFormFieldIndex, setActiveFormFieldIndex] = useState(null)

  const loadRegistrations = async () => {
    setIsRegistrationsLoading(true)
    setRegistrationsError('')

    try {
      const response = await fetch(`${apiBaseUrl}/registrations`)
      if (!response.ok) {
        throw new Error('Failed to fetch registration details')
      }

      const payload = await response.json()
      setRegistrations(Array.isArray(payload.data) ? payload.data : [])
    } catch (error) {
      setRegistrationsError(error.message || 'Failed to fetch registration details')
    } finally {
      setIsRegistrationsLoading(false)
    }
  }

  const openRegistrationsPanel = async () => {
    setIsRegistrationsOpen(true)
    await loadRegistrations()
  }

  const closeRegistrationsPanel = () => {
    setIsRegistrationsOpen(false)
  }

  const downloadRegistrationsExcel = async () => {
    setIsExportingRegistrations(true)
    setRegistrationsError('')

    try {
      const response = await fetch(`${apiBaseUrl}/registrations/export/excel`)
      if (!response.ok) {
        throw new Error('Failed to download registrations file')
      }

      const blob = await response.blob()
      const contentDisposition = response.headers.get('content-disposition') || ''
      const match = contentDisposition.match(/filename="?([^\"]+)"?/i)
      const fileName = match?.[1] || 'registrations.xlsx'

      const fileUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = fileUrl
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(fileUrl)
    } catch (error) {
      setRegistrationsError(error.message || 'Failed to download registrations file')
    } finally {
      setIsExportingRegistrations(false)
    }
  }

  const updateRegistrationTitle = (value) => {
    onContentChange((prev) => ({
      ...prev,
      registration: {
        ...prev.registration,
        modalTitle: value,
      },
    }))
  }

  const updateRegistrationFormField = (index, key, value) => {
    onContentChange((prev) => {
      const formFields = [...prev.registration.formFields]
      formFields[index] = { ...formFields[index], [key]: value }
      return {
        ...prev,
        registration: {
          ...prev.registration,
          formFields,
        },
      }
    })
  }

  const updateRegistrationFormFieldOptions = (index, value) => {
    const options = value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

    updateRegistrationFormField(index, 'options', options)
  }

  const addRegistrationFormField = () => {
    setActiveFormFieldIndex(content.registration.formFields.length)
    onContentChange((prev) => ({
      ...prev,
      registration: {
        ...prev.registration,
        formFields: [...prev.registration.formFields, newRegistrationFormField()],
      },
    }))
  }

  const removeRegistrationFormField = (index) => {
    const total = content.registration.formFields.length

    if (total <= 1) {
      setActiveFormFieldIndex(null)
    } else if (activeFormFieldIndex === index) {
      setActiveFormFieldIndex(index === 0 ? 0 : index - 1)
    } else if (activeFormFieldIndex !== null && activeFormFieldIndex > index) {
      setActiveFormFieldIndex(activeFormFieldIndex - 1)
    }

    onContentChange((prev) => ({
      ...prev,
      registration: {
        ...prev.registration,
        formFields: prev.registration.formFields.filter((_, itemIndex) => itemIndex !== index),
      },
    }))
  }

  const updateSchedule = (index, key, value) => {
    onContentChange((prev) => {
      const schedule = [...prev.schedule]
      schedule[index] = { ...schedule[index], [key]: value }
      return { ...prev, schedule }
    })
  }

  const addSchedule = () => {
    onContentChange((prev) => ({ ...prev, schedule: [...prev.schedule, newScheduleItem()] }))
  }

  const removeSchedule = (index) => {
    onContentChange((prev) => ({
      ...prev,
      schedule: prev.schedule.filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  const updateSpeaker = (index, key, value) => {
    onContentChange((prev) => {
      const speakers = [...prev.speakers]
      speakers[index] = { ...speakers[index], [key]: value }
      return { ...prev, speakers }
    })
  }

  const addSpeaker = () => {
    onContentChange((prev) => ({ ...prev, speakers: [...prev.speakers, newSpeaker()] }))
  }

  const removeSpeaker = (index) => {
    onContentChange((prev) => ({
      ...prev,
      speakers: prev.speakers.filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  const updateCommitteeField = (key, value) => {
    onContentChange((prev) => ({
      ...prev,
      committee: {
        ...prev.committee,
        [key]: value,
      },
    }))
  }

  const updateCommitteeMember = (listKey, index, key, value) => {
    onContentChange((prev) => {
      const nextList = [...prev.committee[listKey]]
      nextList[index] = { ...nextList[index], [key]: value }
      return {
        ...prev,
        committee: {
          ...prev.committee,
          [listKey]: nextList,
        },
      }
    })
  }

  const addCommitteeListItem = (listKey) => {
    onContentChange((prev) => ({
      ...prev,
      committee: {
        ...prev.committee,
        [listKey]: [...prev.committee[listKey], newCommitteeMember()],
      },
    }))
  }

  const removeCommitteeListItem = (listKey, index) => {
    onContentChange((prev) => ({
      ...prev,
      committee: {
        ...prev.committee,
        [listKey]: prev.committee[listKey].filter((_, itemIndex) => itemIndex !== index),
      },
    }))
  }

  const updateProgrammeChair = (index, key, value) => {
    onContentChange((prev) => {
      const programmeChairs = [...prev.committee.programmeChairs]
      programmeChairs[index] = { ...programmeChairs[index], [key]: value }
      return {
        ...prev,
        committee: {
          ...prev.committee,
          programmeChairs,
        },
      }
    })
  }

  const addProgrammeChair = () => {
    onContentChange((prev) => ({
      ...prev,
      committee: {
        ...prev.committee,
        programmeChairs: [...prev.committee.programmeChairs, newProgrammeChair()],
      },
    }))
  }

  const removeProgrammeChair = (index) => {
    onContentChange((prev) => ({
      ...prev,
      committee: {
        ...prev.committee,
        programmeChairs: prev.committee.programmeChairs.filter((_, itemIndex) => itemIndex !== index),
      },
    }))
  }

  const updateConvener = (index, key, value) => {
    onContentChange((prev) => {
      const conveners = [...prev.committee.conveners]
      conveners[index] = { ...conveners[index], [key]: value }
      return {
        ...prev,
        committee: {
          ...prev.committee,
          conveners,
        },
      }
    })
  }

  const addConvener = () => {
    onContentChange((prev) => ({
      ...prev,
      committee: {
        ...prev.committee,
        conveners: [...prev.committee.conveners, newConvener()],
      },
    }))
  }

  const removeConvener = (index) => {
    onContentChange((prev) => ({
      ...prev,
      committee: {
        ...prev.committee,
        conveners: prev.committee.conveners.filter((_, itemIndex) => itemIndex !== index),
      },
    }))
  }

  const updateNavbarField = (key, value) => {
    onContentChange((prev) => ({
      ...prev,
      navbar: {
        ...prev.navbar,
        [key]: value,
      },
    }))
  }

  const updateNavbarLink = (index, key, value) => {
    onContentChange((prev) => {
      const links = [...prev.navbar.links]
      links[index] = { ...links[index], [key]: value }
      return {
        ...prev,
        navbar: {
          ...prev.navbar,
          links,
        },
      }
    })
  }

  const addNavbarLink = () => {
    onContentChange((prev) => ({
      ...prev,
      navbar: {
        ...prev.navbar,
        links: [...prev.navbar.links, { label: 'New Link', href: '#' }],
      },
    }))
  }

  const removeNavbarLink = (index) => {
    onContentChange((prev) => ({
      ...prev,
      navbar: {
        ...prev.navbar,
        links: prev.navbar.links.filter((_, itemIndex) => itemIndex !== index),
      },
    }))
  }

  const addNavbarLogo = (file) => {
    readFileAsDataUrl(file, (value) => {
      onContentChange((prev) => ({
        ...prev,
        navbar: {
          ...prev.navbar,
          logos: [...prev.navbar.logos, value],
        },
      }))
    })
  }

  const replaceNavbarLogo = (index, file) => {
    readFileAsDataUrl(file, (value) => {
      onContentChange((prev) => {
        const logos = [...prev.navbar.logos]
        logos[index] = value
        return {
          ...prev,
          navbar: {
            ...prev.navbar,
            logos,
          },
        }
      })
    })
  }

  const removeNavbarLogo = (index) => {
    onContentChange((prev) => ({
      ...prev,
      navbar: {
        ...prev.navbar,
        logos: prev.navbar.logos.filter((_, itemIndex) => itemIndex !== index),
      },
    }))
  }

  const updateSectionField = (sectionKey, key, value) => {
    onContentChange((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionKey]: {
          ...prev.sections[sectionKey],
          [key]: value,
        },
      },
    }))
  }

  const updateSectionObjectListItem = (sectionKey, listKey, index, key, value) => {
    onContentChange((prev) => {
      const list = [...(prev.sections[sectionKey]?.[listKey] ?? [])]
      list[index] = { ...list[index], [key]: value }
      return {
        ...prev,
        sections: {
          ...prev.sections,
          [sectionKey]: {
            ...prev.sections[sectionKey],
            [listKey]: list,
          },
        },
      }
    })
  }

  const updateSectionTextListItem = (sectionKey, listKey, index, value) => {
    onContentChange((prev) => {
      const list = [...(prev.sections[sectionKey]?.[listKey] ?? [])]
      list[index] = value
      return {
        ...prev,
        sections: {
          ...prev.sections,
          [sectionKey]: {
            ...prev.sections[sectionKey],
            [listKey]: list,
          },
        },
      }
    })
  }

  const addSectionObjectListItem = (sectionKey, listKey, itemFactory) => {
    onContentChange((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionKey]: {
          ...prev.sections[sectionKey],
          [listKey]: [...(prev.sections[sectionKey]?.[listKey] ?? []), itemFactory()],
        },
      },
    }))
  }

  const addSectionTextListItem = (sectionKey, listKey, value) => {
    onContentChange((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionKey]: {
          ...prev.sections[sectionKey],
          [listKey]: [...(prev.sections[sectionKey]?.[listKey] ?? []), value],
        },
      },
    }))
  }

  const removeSectionListItem = (sectionKey, listKey, index) => {
    onContentChange((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionKey]: {
          ...prev.sections[sectionKey],
          [listKey]: (prev.sections[sectionKey]?.[listKey] ?? []).filter((_, itemIndex) => itemIndex !== index),
        },
      },
    }))
  }

  const openFormEditor = () => {
    setIsFormEditorOpen(true)
    setActiveFormFieldIndex(content.registration.formFields.length > 0 ? 0 : null)
  }

  const closeFormEditor = () => {
    setIsFormEditorOpen(false)
    setActiveFormFieldIndex(null)
  }

  const openNavbarEditor = () => {
    setIsNavbarEditorOpen(true)
  }

  const closeNavbarEditor = () => {
    setIsNavbarEditorOpen(false)
  }

  const openScheduleEditor = () => {
    setIsScheduleEditorOpen(true)
  }

  const closeScheduleEditor = () => {
    setIsScheduleEditorOpen(false)
  }

  const openSpeakersEditor = () => {
    setIsSpeakersEditorOpen(true)
  }

  const closeSpeakersEditor = () => {
    setIsSpeakersEditorOpen(false)
  }

  const openCommitteeEditor = () => {
    setIsCommitteeEditorOpen(true)
  }

  const closeCommitteeEditor = () => {
    setIsCommitteeEditorOpen(false)
  }

  const openSectionsEditor = () => {
    setIsSectionsEditorOpen(true)
  }

  const closeSectionsEditor = () => {
    setIsSectionsEditorOpen(false)
  }

  const activeFormField =
    activeFormFieldIndex === null ? null : content.registration.formFields[activeFormFieldIndex]

  return (
    <main className="admin-page">
      <header className="topbar">
        <div className="container topbar-inner">
          <div className="brand-wrap">
            <div className="navbar-logo-stack">
              {content.navbar.logos.map((logo, index) => (
                <img src={logo} alt={`Navbar logo ${index + 1}`} className="navbar-logo" key={`admin-logo-${index}`} />
              ))}
            </div>
            <p className="brand">
              {content.navbar.brand}
              <span>{content.navbar.subBrand}</span>
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
            {content.navbar.links.map((link, index) => (
              <a href={link.href} onClick={() => setIsMenuOpen(false)} key={`admin-link-${index}`}>
                {link.label}
              </a>
            ))}
            <button type="button" className="btn btn-primary" onClick={onLogout}>
              Logout
            </button>
          </nav>
        </div>
      </header>

      <div className="admin-shell">
        <header className="admin-header">
          <h1>Content Control Panel</h1>
          <p>All changes are applied instantly on the main page and saved in browser storage.</p>
          <a href="#" className="admin-back-link">Back to Main Website</a>
        </header>

        <section className="admin-card">
          <h2>Registration Details</h2>
          <p className="admin-helper-text">View all registered participants and download the full list in Excel.</p>
          <div className="admin-row-actions">
            <button type="button" className="admin-add" onClick={openRegistrationsPanel}>
              View Registrations
            </button>
            <button
              type="button"
              className="admin-muted"
              onClick={downloadRegistrationsExcel}
              disabled={isExportingRegistrations}
            >
              {isExportingRegistrations ? 'Preparing Excel...' : 'Download Excel'}
            </button>
          </div>
          {registrationsError ? <p className="admin-error-text">{registrationsError}</p> : null}
        </section>

        <section className="admin-card">
          <h2>Navbar Control</h2>
          <p className="admin-helper-text">Open a popup editor for brand text, navigation links, and logos.</p>
          <button type="button" className="admin-add" onClick={openNavbarEditor}>
            Edit Navbar
          </button>
        </section>

        <section className="admin-card">
          <h2>Registration Form Control</h2>
          <div className="admin-grid">
            <label>
              Form Title
              <input
                type="text"
                value={content.registration.modalTitle}
                onChange={(event) => updateRegistrationTitle(event.target.value)}
              />
            </label>
          </div>

          <div className="admin-row-actions">
            <button type="button" className="admin-add" onClick={openFormEditor}>
              Edit Form Fields
            </button>
            <p className="admin-helper-text">
              {content.registration.formFields.length} fields configured
            </p>
          </div>
        </section>

        <section className="admin-card">
          <h2>Schedule Section</h2>
          <p className="admin-helper-text">Open a popup editor to manage all schedule items.</p>
          <button type="button" className="admin-add" onClick={openScheduleEditor}>
            Edit Schedule
          </button>
        </section>

        <section className="admin-card">
          <h2>Resource Persons Control</h2>
          <p className="admin-helper-text">Open a popup editor to add, update, and remove resource persons.</p>
          <button type="button" className="admin-add" onClick={openSpeakersEditor}>
            Edit Resource Persons
          </button>
        </section>

        <section className="admin-card">
          <h2>Organizing Committee Control</h2>
          <p className="admin-helper-text">Open a popup editor to manage committee headings and all members.</p>
          <button type="button" className="admin-add" onClick={openCommitteeEditor}>
            Edit Committee
          </button>
        </section>

        <section className="admin-card">
          <h2>Website Sections Content</h2>
          <p className="admin-helper-text">Open a popup editor to update hero, about, objectives, legacy, audience, CTA, timeline, and footer content.</p>
          <button type="button" className="admin-add" onClick={openSectionsEditor}>
            Edit Website Sections
          </button>
        </section>

      </div>

      {isNavbarEditorOpen ? (
        <div className="admin-modal-overlay" onClick={closeNavbarEditor}>
          <section className="admin-modal" onClick={(event) => event.stopPropagation()}>
            <header className="admin-modal-header">
              <h3>Navbar Control</h3>
              <button type="button" className="admin-muted" onClick={closeNavbarEditor}>
                Close
              </button>
            </header>

            <div className="admin-modal-editor">
              <div className="admin-grid">
                <label>
                  Brand Text
                  <input
                    type="text"
                    value={content.navbar.brand}
                    onChange={(event) => updateNavbarField('brand', event.target.value)}
                  />
                </label>
                <label>
                  Sub Brand Text
                  <input
                    type="text"
                    value={content.navbar.subBrand}
                    onChange={(event) => updateNavbarField('subBrand', event.target.value)}
                  />
                </label>
              </div>

              <h3>Navbar Links</h3>
              <div className="admin-stack compact">
                {content.navbar.links.map((link, index) => (
                  <div className="admin-inline admin-inline-wide" key={`navbar-link-${index}`}>
                    <input
                      type="text"
                      value={link.label}
                      onChange={(event) => updateNavbarLink(index, 'label', event.target.value)}
                      placeholder="Link label"
                    />
                    <input
                      type="text"
                      value={link.href}
                      onChange={(event) => updateNavbarLink(index, 'href', event.target.value)}
                      placeholder="Link href (#about)"
                    />
                    <button type="button" className="admin-danger" onClick={() => removeNavbarLink(index)}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" className="admin-add" onClick={addNavbarLink}>Add Navbar Link</button>

              <h3>Navbar Logos</h3>
              <div className="admin-stack compact">
                {content.navbar.logos.map((logo, index) => (
                  <article className="admin-item" key={`navbar-logo-${index}`}>
                    <img className="admin-navbar-logo-preview" src={logo} alt={`Navbar logo ${index + 1}`} />
                    <label>
                      Replace Logo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => replaceNavbarLogo(index, event.target.files?.[0])}
                      />
                    </label>
                    <button type="button" className="admin-danger" onClick={() => removeNavbarLogo(index)}>
                      Remove Logo
                    </button>
                  </article>
                ))}
              </div>
              <label className="admin-upload-block">
                Insert New Logo
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    addNavbarLogo(event.target.files?.[0])
                    event.target.value = ''
                  }}
                />
              </label>
            </div>
          </section>
        </div>
      ) : null}

      {isScheduleEditorOpen ? (
        <div className="admin-modal-overlay" onClick={closeScheduleEditor}>
          <section className="admin-modal" onClick={(event) => event.stopPropagation()}>
            <header className="admin-modal-header">
              <h3>Schedule Section</h3>
              <button type="button" className="admin-muted" onClick={closeScheduleEditor}>
                Close
              </button>
            </header>

            <div className="admin-modal-editor">
              <div className="admin-stack">
                {content.schedule.map((item, index) => (
                  <article className="admin-item" key={`schedule-${index}`}>
                    <label>
                      Schedule Title
                      <input
                        type="text"
                        value={item.title}
                        onChange={(event) => updateSchedule(index, 'title', event.target.value)}
                      />
                    </label>
                    <label>
                      Schedule Description
                      <textarea
                        value={item.text}
                        onChange={(event) => updateSchedule(index, 'text', event.target.value)}
                      />
                    </label>
                    <button type="button" className="admin-danger" onClick={() => removeSchedule(index)}>
                      Remove Schedule Item
                    </button>
                  </article>
                ))}
              </div>
              <button type="button" className="admin-add" onClick={addSchedule}>Add Schedule Item</button>
            </div>
          </section>
        </div>
      ) : null}

      {isSpeakersEditorOpen ? (
        <div className="admin-modal-overlay" onClick={closeSpeakersEditor}>
          <section className="admin-modal" onClick={(event) => event.stopPropagation()}>
            <header className="admin-modal-header">
              <h3>Resource Persons Control</h3>
              <button type="button" className="admin-muted" onClick={closeSpeakersEditor}>
                Close
              </button>
            </header>

            <div className="admin-modal-editor">
              <div className="admin-stack">
                {content.speakers.map((speaker, index) => (
                  <article className="admin-item" key={`speaker-${index}`}>
                    <label>
                      Name
                      <input
                        type="text"
                        value={speaker.name}
                        onChange={(event) => updateSpeaker(index, 'name', event.target.value)}
                      />
                    </label>
                    <label>
                      Role
                      <input
                        type="text"
                        value={speaker.role}
                        onChange={(event) => updateSpeaker(index, 'role', event.target.value)}
                      />
                    </label>
                    <label>
                      Organization
                      <input
                        type="text"
                        value={speaker.org}
                        onChange={(event) => updateSpeaker(index, 'org', event.target.value)}
                      />
                    </label>
                    <label>
                      Upload Photo (Optional)
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          const file = event.target.files?.[0]
                          readFileAsDataUrl(file, (value) => updateSpeaker(index, 'image', value))
                        }}
                      />
                    </label>
                    {speaker.image ? <img className="admin-preview" src={speaker.image} alt={speaker.name || 'speaker'} /> : null}
                    <div className="admin-row-actions">
                      <button type="button" className="admin-muted" onClick={() => updateSpeaker(index, 'image', '')}>
                        Remove Photo
                      </button>
                      <button type="button" className="admin-danger" onClick={() => removeSpeaker(index)}>
                        Remove Person
                      </button>
                    </div>
                  </article>
                ))}
              </div>
              <button type="button" className="admin-add" onClick={addSpeaker}>Add Resource Person</button>
            </div>
          </section>
        </div>
      ) : null}

      {isCommitteeEditorOpen ? (
        <div className="admin-modal-overlay" onClick={closeCommitteeEditor}>
          <section className="admin-modal" onClick={(event) => event.stopPropagation()}>
            <header className="admin-modal-header">
              <h3>Organizing Committee Control</h3>
              <button type="button" className="admin-muted" onClick={closeCommitteeEditor}>
                Close
              </button>
            </header>

            <div className="admin-modal-editor">
              <div className="admin-grid">
                <label>
                  Department Heading
                  <input
                    type="text"
                    value={content.committee.department}
                    onChange={(event) => updateCommitteeField('department', event.target.value)}
                  />
                </label>
                <label>
                  School Heading
                  <input
                    type="text"
                    value={content.committee.school}
                    onChange={(event) => updateCommitteeField('school', event.target.value)}
                  />
                </label>
              </div>

              <h3>Chief Patrons</h3>
              <div className="admin-stack">
                {content.committee.chiefPatrons.map((item, index) => (
                  <article className="admin-item" key={`chief-${index}`}>
                    <label>
                      Name
                      <input
                        type="text"
                        value={item.name}
                        onChange={(event) => updateCommitteeMember('chiefPatrons', index, 'name', event.target.value)}
                      />
                    </label>
                    <label>
                      Details
                      <input
                        type="text"
                        value={item.details}
                        onChange={(event) => updateCommitteeMember('chiefPatrons', index, 'details', event.target.value)}
                        placeholder="Designation / Additional details"
                      />
                    </label>
                    <label>
                      Upload Photo (Optional)
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          const file = event.target.files?.[0]
                          readFileAsDataUrl(file, (value) => updateCommitteeMember('chiefPatrons', index, 'image', value))
                        }}
                      />
                    </label>
                    {item.image ? <img className="admin-preview" src={item.image} alt={item.name || 'chief patron'} /> : null}
                    <div className="admin-row-actions">
                      <button
                        type="button"
                        className="admin-muted"
                        onClick={() => updateCommitteeMember('chiefPatrons', index, 'image', '')}
                      >
                        Remove Photo
                      </button>
                      <button
                        type="button"
                        className="admin-danger"
                        onClick={() => removeCommitteeListItem('chiefPatrons', index)}
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                ))}
              </div>
              <button type="button" className="admin-add" onClick={() => addCommitteeListItem('chiefPatrons')}>
                Add Chief Patron
              </button>

              <h3>Patrons</h3>
              <div className="admin-stack">
                {content.committee.patrons.map((item, index) => (
                  <article className="admin-item" key={`patron-${index}`}>
                    <label>
                      Name
                      <input
                        type="text"
                        value={item.name}
                        onChange={(event) => updateCommitteeMember('patrons', index, 'name', event.target.value)}
                      />
                    </label>
                    <label>
                      Details
                      <input
                        type="text"
                        value={item.details}
                        onChange={(event) => updateCommitteeMember('patrons', index, 'details', event.target.value)}
                        placeholder="Designation / Additional details"
                      />
                    </label>
                    <label>
                      Upload Photo (Optional)
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          const file = event.target.files?.[0]
                          readFileAsDataUrl(file, (value) => updateCommitteeMember('patrons', index, 'image', value))
                        }}
                      />
                    </label>
                    {item.image ? <img className="admin-preview" src={item.image} alt={item.name || 'patron'} /> : null}
                    <div className="admin-row-actions">
                      <button
                        type="button"
                        className="admin-muted"
                        onClick={() => updateCommitteeMember('patrons', index, 'image', '')}
                      >
                        Remove Photo
                      </button>
                      <button
                        type="button"
                        className="admin-danger"
                        onClick={() => removeCommitteeListItem('patrons', index)}
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                ))}
              </div>
              <button type="button" className="admin-add" onClick={() => addCommitteeListItem('patrons')}>
                Add Patron
              </button>

              <h3>Programme Chairs</h3>
              <div className="admin-stack">
                {content.committee.programmeChairs.map((chair, index) => (
                  <article className="admin-item" key={`chair-${index}`}>
                    <label>
                      Name
                      <input
                        type="text"
                        value={chair.name}
                        onChange={(event) => updateProgrammeChair(index, 'name', event.target.value)}
                      />
                    </label>
                    <label>
                      Role
                      <input
                        type="text"
                        value={chair.role}
                        onChange={(event) => updateProgrammeChair(index, 'role', event.target.value)}
                      />
                    </label>
                    <label>
                      Upload Photo (Optional)
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          const file = event.target.files?.[0]
                          readFileAsDataUrl(file, (value) => updateProgrammeChair(index, 'image', value))
                        }}
                      />
                    </label>
                    {chair.image ? <img className="admin-preview" src={chair.image} alt={chair.name || 'chair'} /> : null}
                    <div className="admin-row-actions">
                      <button type="button" className="admin-muted" onClick={() => updateProgrammeChair(index, 'image', '')}>
                        Remove Photo
                      </button>
                      <button type="button" className="admin-danger" onClick={() => removeProgrammeChair(index)}>
                        Remove Chair
                      </button>
                    </div>
                  </article>
                ))}
              </div>
              <button type="button" className="admin-add" onClick={addProgrammeChair}>Add Programme Chair</button>

              <h3>Convener / Co-Convener</h3>
              <div className="admin-stack">
                {content.committee.conveners.map((convener, index) => (
                  <article className="admin-item" key={`convener-${index}`}>
                    <label>
                      Label (Convener/Co-Convener)
                      <input
                        type="text"
                        value={convener.title}
                        onChange={(event) => updateConvener(index, 'title', event.target.value)}
                      />
                    </label>
                    <label>
                      Name
                      <input
                        type="text"
                        value={convener.name}
                        onChange={(event) => updateConvener(index, 'name', event.target.value)}
                      />
                    </label>
                    <label>
                      Role
                      <input
                        type="text"
                        value={convener.role}
                        onChange={(event) => updateConvener(index, 'role', event.target.value)}
                      />
                    </label>
                    <label>
                      Contact
                      <input
                        type="text"
                        value={convener.contact}
                        onChange={(event) => updateConvener(index, 'contact', event.target.value)}
                      />
                    </label>
                    <label>
                      Email
                      <input
                        type="email"
                        value={convener.email}
                        onChange={(event) => updateConvener(index, 'email', event.target.value)}
                      />
                    </label>
                    <label>
                      Upload Photo (Optional)
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          const file = event.target.files?.[0]
                          readFileAsDataUrl(file, (value) => updateConvener(index, 'image', value))
                        }}
                      />
                    </label>
                    {convener.image ? <img className="admin-preview" src={convener.image} alt={convener.name || 'convener'} /> : null}
                    <div className="admin-row-actions">
                      <button type="button" className="admin-muted" onClick={() => updateConvener(index, 'image', '')}>
                        Remove Photo
                      </button>
                      <button type="button" className="admin-danger" onClick={() => removeConvener(index)}>
                        Remove Person
                      </button>
                    </div>
                  </article>
                ))}
              </div>
              <button type="button" className="admin-add" onClick={addConvener}>Add Convener Member</button>
            </div>
          </section>
        </div>
      ) : null}

      {isRegistrationsOpen ? (
        <div className="admin-modal-overlay" onClick={closeRegistrationsPanel}>
          <section className="admin-modal" onClick={(event) => event.stopPropagation()}>
            <header className="admin-modal-header">
              <h3>Registered Participants</h3>
              <div className="admin-row-actions">
                <button type="button" className="admin-muted" onClick={loadRegistrations} disabled={isRegistrationsLoading}>
                  {isRegistrationsLoading ? 'Refreshing...' : 'Refresh'}
                </button>
                <button type="button" className="admin-muted" onClick={closeRegistrationsPanel}>
                  Close
                </button>
              </div>
            </header>

            <div className="admin-modal-editor">
              {isRegistrationsLoading ? <p className="admin-helper-text">Loading registrations...</p> : null}
              {!isRegistrationsLoading && registrationsError ? (
                <p className="admin-error-text">{registrationsError}</p>
              ) : null}
              {!isRegistrationsLoading && !registrationsError && registrations.length === 0 ? (
                <p className="admin-helper-text">No registrations found yet.</p>
              ) : null}
              {!isRegistrationsLoading && !registrationsError && registrations.length > 0 ? (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Mobile</th>
                        <th>Email</th>
                        <th>Designation</th>
                        <th>Institution</th>
                        <th>Participant Type</th>
                        <th>Mode</th>
                        <th>Declaration</th>
                        <th>Submitted At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrations.map((item) => (
                        <tr key={item._id}>
                          <td>{item.fullName || '-'}</td>
                          <td>{item.mobileNumber || '-'}</td>
                          <td>{item.emailId || '-'}</td>
                          <td>{item.designation || '-'}</td>
                          <td>{item.institution || '-'}</td>
                          <td>{item.participantType || '-'}</td>
                          <td>{item.mode || '-'}</td>
                          <td>{item.declaration || '-'}</td>
                          <td>{formatRegistrationDate(item.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </div>
          </section>
        </div>
      ) : null}

      {isSectionsEditorOpen ? (
        <div className="admin-modal-overlay" onClick={closeSectionsEditor}>
          <section className="admin-modal" onClick={(event) => event.stopPropagation()}>
            <header className="admin-modal-header">
              <h3>Website Sections Content</h3>
              <button type="button" className="admin-muted" onClick={closeSectionsEditor}>
                Close
              </button>
            </header>

            <div className="admin-modal-editor">
              <h3>Hero Section</h3>
              <div className="admin-grid">
                <label>
                  Badge Text
                  <input
                    type="text"
                    value={content.sections.hero.pill}
                    onChange={(event) => updateSectionField('hero', 'pill', event.target.value)}
                  />
                </label>
                <label>
                  Hero Title Prefix
                  <input
                    type="text"
                    value={content.sections.hero.titlePrefix}
                    onChange={(event) => updateSectionField('hero', 'titlePrefix', event.target.value)}
                  />
                </label>
                <label>
                  Hero Title Highlight
                  <input
                    type="text"
                    value={content.sections.hero.titleHighlight}
                    onChange={(event) => updateSectionField('hero', 'titleHighlight', event.target.value)}
                  />
                </label>
                <label>
                  Subtitle
                  <input
                    type="text"
                    value={content.sections.hero.subtitle}
                    onChange={(event) => updateSectionField('hero', 'subtitle', event.target.value)}
                  />
                </label>
                <label>
                  Date Text
                  <input
                    type="text"
                    value={content.sections.hero.metaDate}
                    onChange={(event) => updateSectionField('hero', 'metaDate', event.target.value)}
                  />
                </label>
                <label>
                  Mode Text
                  <input
                    type="text"
                    value={content.sections.hero.metaMode}
                    onChange={(event) => updateSectionField('hero', 'metaMode', event.target.value)}
                  />
                </label>
                <label>
                  Seats Text
                  <input
                    type="text"
                    value={content.sections.hero.metaSeats}
                    onChange={(event) => updateSectionField('hero', 'metaSeats', event.target.value)}
                  />
                </label>
                <label>
                  Primary Button
                  <input
                    type="text"
                    value={content.sections.hero.registerButtonText}
                    onChange={(event) => updateSectionField('hero', 'registerButtonText', event.target.value)}
                  />
                </label>
                <label>
                  Secondary Button
                  <input
                    type="text"
                    value={content.sections.hero.scheduleButtonText}
                    onChange={(event) => updateSectionField('hero', 'scheduleButtonText', event.target.value)}
                  />
                </label>
                <label>
                  Days Left Suffix
                  <input
                    type="text"
                    value={content.sections.hero.daysLeftSuffix}
                    onChange={(event) => updateSectionField('hero', 'daysLeftSuffix', event.target.value)}
                  />
                </label>
              </div>

              <h3>About Section</h3>
              <div className="admin-grid">
                <label>
                  Heading
                  <input
                    type="text"
                    value={content.sections.about.heading}
                    onChange={(event) => updateSectionField('about', 'heading', event.target.value)}
                  />
                </label>
                <label>
                  Subheading
                  <input
                    type="text"
                    value={content.sections.about.subheading}
                    onChange={(event) => updateSectionField('about', 'subheading', event.target.value)}
                  />
                </label>
                <label>
                  Intro Text
                  <textarea
                    value={content.sections.about.intro}
                    onChange={(event) => updateSectionField('about', 'intro', event.target.value)}
                  />
                </label>
                <label>
                  Hands-on Heading
                  <input
                    type="text"
                    value={content.sections.about.handsOnHeading}
                    onChange={(event) => updateSectionField('about', 'handsOnHeading', event.target.value)}
                  />
                </label>
                <label>
                  Hands-on Text
                  <textarea
                    value={content.sections.about.handsOnText}
                    onChange={(event) => updateSectionField('about', 'handsOnText', event.target.value)}
                  />
                </label>
                <label>
                  Collaboration Heading
                  <input
                    type="text"
                    value={content.sections.about.collaborationHeading}
                    onChange={(event) => updateSectionField('about', 'collaborationHeading', event.target.value)}
                  />
                </label>
                <label>
                  Collaboration Text
                  <textarea
                    value={content.sections.about.collaborationText}
                    onChange={(event) => updateSectionField('about', 'collaborationText', event.target.value)}
                  />
                </label>
                <label>
                  Takeaways Heading
                  <input
                    type="text"
                    value={content.sections.about.takeawaysHeading}
                    onChange={(event) => updateSectionField('about', 'takeawaysHeading', event.target.value)}
                  />
                </label>
                <label>
                  About CTA Button
                  <input
                    type="text"
                    value={content.sections.about.ctaText}
                    onChange={(event) => updateSectionField('about', 'ctaText', event.target.value)}
                  />
                </label>
              </div>
              <div className="admin-stack compact">
                {content.sections.about.takeaways.map((item, index) => (
                  <div className="admin-inline admin-inline-wide" key={`takeaway-${index}`}>
                    <input
                      type="text"
                      value={item}
                      onChange={(event) => updateSectionTextListItem('about', 'takeaways', index, event.target.value)}
                      placeholder="Takeaway item"
                    />
                    <button
                      type="button"
                      className="admin-danger"
                      onClick={() => removeSectionListItem('about', 'takeaways', index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" className="admin-add" onClick={() => addSectionTextListItem('about', 'takeaways', 'New takeaway')}>
                Add Takeaway
              </button>

              <h3>Objectives Section</h3>
              <div className="admin-grid">
                <label>
                  Objectives Heading
                  <input
                    type="text"
                    value={content.sections.objectives.heading}
                    onChange={(event) => updateSectionField('objectives', 'heading', event.target.value)}
                  />
                </label>
              </div>
              <div className="admin-stack">
                {content.sections.objectives.items.map((item, index) => (
                  <article className="admin-item" key={`objective-${index}`}>
                    <label>
                      Icon Name
                      <input
                        type="text"
                        value={item.icon}
                        onChange={(event) =>
                          updateSectionObjectListItem('objectives', 'items', index, 'icon', event.target.value)
                        }
                        placeholder="material icon name"
                      />
                    </label>
                    <label>
                      Title
                      <input
                        type="text"
                        value={item.title}
                        onChange={(event) =>
                          updateSectionObjectListItem('objectives', 'items', index, 'title', event.target.value)
                        }
                      />
                    </label>
                    <label>
                      Description
                      <textarea
                        value={item.text}
                        onChange={(event) =>
                          updateSectionObjectListItem('objectives', 'items', index, 'text', event.target.value)
                        }
                      />
                    </label>
                    <button
                      type="button"
                      className="admin-danger"
                      onClick={() => removeSectionListItem('objectives', 'items', index)}
                    >
                      Remove Objective
                    </button>
                  </article>
                ))}
              </div>
              <button
                type="button"
                className="admin-add"
                onClick={() => addSectionObjectListItem('objectives', 'items', newObjectiveItem)}
              >
                Add Objective
              </button>

              <h3>Institutional Legacy Section</h3>
              <div className="admin-grid">
                <label>
                  Legacy Heading
                  <input
                    type="text"
                    value={content.sections.legacy.heading}
                    onChange={(event) => updateSectionField('legacy', 'heading', event.target.value)}
                  />
                </label>
              </div>
              <div className="admin-stack">
                {content.sections.legacy.entries.map((entry, index) => (
                  <article className="admin-item" key={`legacy-${index}`}>
                    <label>
                      Icon Name
                      <input
                        type="text"
                        value={entry.icon}
                        onChange={(event) => updateSectionObjectListItem('legacy', 'entries', index, 'icon', event.target.value)}
                      />
                    </label>
                    <label>
                      Title
                      <input
                        type="text"
                        value={entry.title}
                        onChange={(event) => updateSectionObjectListItem('legacy', 'entries', index, 'title', event.target.value)}
                      />
                    </label>
                    <label>
                      Description
                      <textarea
                        value={entry.text}
                        onChange={(event) => updateSectionObjectListItem('legacy', 'entries', index, 'text', event.target.value)}
                      />
                    </label>
                    <button
                      type="button"
                      className="admin-danger"
                      onClick={() => removeSectionListItem('legacy', 'entries', index)}
                    >
                      Remove Entry
                    </button>
                  </article>
                ))}
              </div>
              <button
                type="button"
                className="admin-add"
                onClick={() => addSectionObjectListItem('legacy', 'entries', newLegacyEntry)}
              >
                Add Legacy Entry
              </button>

              <h3>Speakers Section Text</h3>
              <div className="admin-grid">
                <label>
                  Section Heading
                  <input
                    type="text"
                    value={content.sections.speakers.heading}
                    onChange={(event) => updateSectionField('speakers', 'heading', event.target.value)}
                  />
                </label>
                <label>
                  Subheading
                  <textarea
                    value={content.sections.speakers.subhead}
                    onChange={(event) => updateSectionField('speakers', 'subhead', event.target.value)}
                  />
                </label>
                <label>
                  Target Participants Title
                  <input
                    type="text"
                    value={content.sections.speakers.participantsTitle}
                    onChange={(event) => updateSectionField('speakers', 'participantsTitle', event.target.value)}
                  />
                </label>
                <label>
                  Target Participants Text
                  <textarea
                    value={content.sections.speakers.participantsText}
                    onChange={(event) => updateSectionField('speakers', 'participantsText', event.target.value)}
                  />
                </label>
              </div>

              <h3>Committee Labels</h3>
              <div className="admin-grid">
                <label>
                  Committee Heading
                  <input
                    type="text"
                    value={content.sections.committee.heading}
                    onChange={(event) => updateSectionField('committee', 'heading', event.target.value)}
                  />
                </label>
                <label>
                  Chief Patrons Label
                  <input
                    type="text"
                    value={content.sections.committee.chiefPatronsLabel}
                    onChange={(event) => updateSectionField('committee', 'chiefPatronsLabel', event.target.value)}
                  />
                </label>
                <label>
                  Patrons Label
                  <input
                    type="text"
                    value={content.sections.committee.patronsLabel}
                    onChange={(event) => updateSectionField('committee', 'patronsLabel', event.target.value)}
                  />
                </label>
                <label>
                  Programme Chairs Label
                  <input
                    type="text"
                    value={content.sections.committee.programmeChairsLabel}
                    onChange={(event) => updateSectionField('committee', 'programmeChairsLabel', event.target.value)}
                  />
                </label>
                <label>
                  Convener Label
                  <input
                    type="text"
                    value={content.sections.committee.convenersLabel}
                    onChange={(event) => updateSectionField('committee', 'convenersLabel', event.target.value)}
                  />
                </label>
              </div>

              <h3>Audience Section</h3>
              <div className="admin-grid">
                <label>
                  Heading
                  <input
                    type="text"
                    value={content.sections.audience.heading}
                    onChange={(event) => updateSectionField('audience', 'heading', event.target.value)}
                  />
                </label>
                <label>
                  Certification Title
                  <input
                    type="text"
                    value={content.sections.audience.certificationTitle}
                    onChange={(event) => updateSectionField('audience', 'certificationTitle', event.target.value)}
                  />
                </label>
                <label>
                  Certification Text
                  <textarea
                    value={content.sections.audience.certificationText}
                    onChange={(event) => updateSectionField('audience', 'certificationText', event.target.value)}
                  />
                </label>
              </div>
              <div className="admin-stack compact">
                {content.sections.audience.items.map((item, index) => (
                  <div className="admin-inline admin-inline-wide" key={`audience-item-${index}`}>
                    <input
                      type="text"
                      value={item.icon}
                      onChange={(event) => updateSectionObjectListItem('audience', 'items', index, 'icon', event.target.value)}
                      placeholder="Icon"
                    />
                    <input
                      type="text"
                      value={item.label}
                      onChange={(event) => updateSectionObjectListItem('audience', 'items', index, 'label', event.target.value)}
                      placeholder="Label"
                    />
                    <button
                      type="button"
                      className="admin-danger"
                      onClick={() => removeSectionListItem('audience', 'items', index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="admin-add"
                onClick={() => addSectionObjectListItem('audience', 'items', newAudienceItem)}
              >
                Add Audience Item
              </button>

              <h3>Registration CTA Section</h3>
              <div className="admin-grid">
                <label>
                  CTA Heading
                  <input
                    type="text"
                    value={content.sections.cta.heading}
                    onChange={(event) => updateSectionField('cta', 'heading', event.target.value)}
                  />
                </label>
                <label>
                  CTA Text
                  <textarea
                    value={content.sections.cta.text}
                    onChange={(event) => updateSectionField('cta', 'text', event.target.value)}
                  />
                </label>
                <label>
                  Fee Label
                  <input
                    type="text"
                    value={content.sections.cta.feeLabel}
                    onChange={(event) => updateSectionField('cta', 'feeLabel', event.target.value)}
                  />
                </label>
                <label>
                  Fee Value
                  <input
                    type="text"
                    value={content.sections.cta.feeValue}
                    onChange={(event) => updateSectionField('cta', 'feeValue', event.target.value)}
                  />
                </label>
                <label>
                  CTA Button Text
                  <input
                    type="text"
                    value={content.sections.cta.registerButtonText}
                    onChange={(event) => updateSectionField('cta', 'registerButtonText', event.target.value)}
                  />
                </label>
                <label>
                  CTA Note
                  <input
                    type="text"
                    value={content.sections.cta.note}
                    onChange={(event) => updateSectionField('cta', 'note', event.target.value)}
                  />
                </label>
              </div>

              <h3>Timeline Section</h3>
              <div className="admin-grid">
                <label>
                  Timeline Heading
                  <input
                    type="text"
                    value={content.sections.schedule.heading}
                    onChange={(event) => updateSectionField('schedule', 'heading', event.target.value)}
                  />
                </label>
                <label>
                  Download Button Text
                  <input
                    type="text"
                    value={content.sections.schedule.buttonText}
                    onChange={(event) => updateSectionField('schedule', 'buttonText', event.target.value)}
                  />
                </label>
                <label>
                  Timeline Note
                  <input
                    type="text"
                    value={content.sections.schedule.note}
                    onChange={(event) => updateSectionField('schedule', 'note', event.target.value)}
                  />
                </label>
              </div>

              <h3>Footer Section</h3>
              <div className="admin-grid">
                <label>
                  Event Title
                  <input
                    type="text"
                    value={content.sections.footer.eventTitle}
                    onChange={(event) => updateSectionField('footer', 'eventTitle', event.target.value)}
                  />
                </label>
                <label>
                  Event Description
                  <textarea
                    value={content.sections.footer.eventText}
                    onChange={(event) => updateSectionField('footer', 'eventText', event.target.value)}
                  />
                </label>
                <label>
                  Department Title
                  <input
                    type="text"
                    value={content.sections.footer.departmentTitle}
                    onChange={(event) => updateSectionField('footer', 'departmentTitle', event.target.value)}
                  />
                </label>
                <label>
                  Department Description
                  <textarea
                    value={content.sections.footer.departmentText}
                    onChange={(event) => updateSectionField('footer', 'departmentText', event.target.value)}
                  />
                </label>
                <label>
                  Quick Links Heading
                  <input
                    type="text"
                    value={content.sections.footer.linksTitle}
                    onChange={(event) => updateSectionField('footer', 'linksTitle', event.target.value)}
                  />
                </label>
                <label>
                  Copyright
                  <input
                    type="text"
                    value={content.sections.footer.copyright}
                    onChange={(event) => updateSectionField('footer', 'copyright', event.target.value)}
                  />
                </label>
              </div>
              <div className="admin-stack compact">
                {content.sections.footer.links.map((item, index) => (
                  <div className="admin-inline admin-inline-wide" key={`footer-link-${index}`}>
                    <input
                      type="text"
                      value={item}
                      onChange={(event) => updateSectionTextListItem('footer', 'links', index, event.target.value)}
                      placeholder="Footer link text"
                    />
                    <button
                      type="button"
                      className="admin-danger"
                      onClick={() => removeSectionListItem('footer', 'links', index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" className="admin-add" onClick={() => addSectionTextListItem('footer', 'links', 'New Link')}>
                Add Footer Link
              </button>
            </div>
          </section>
        </div>
      ) : null}

      {isFormEditorOpen ? (
        <div className="admin-modal-overlay" onClick={closeFormEditor}>
          <section className="admin-modal" onClick={(event) => event.stopPropagation()}>
            <header className="admin-modal-header">
              <h3>Registration Form Fields</h3>
              <button type="button" className="admin-muted" onClick={closeFormEditor}>
                Close
              </button>
            </header>

            <div className="admin-modal-layout">
              <aside className="admin-modal-sidebar">
                <div className="admin-modal-sidebar-actions">
                  <button type="button" className="admin-add" onClick={addRegistrationFormField}>
                    Add New Field
                  </button>
                </div>
                <div className="admin-field-list">
                  {content.registration.formFields.map((field, index) => (
                    <button
                      type="button"
                      key={field.id}
                      className={`admin-field-list-item ${activeFormFieldIndex === index ? 'is-active' : ''}`}
                      onClick={() => setActiveFormFieldIndex(index)}
                    >
                      <strong>{field.label}</strong>
                      <span>{field.section}</span>
                    </button>
                  ))}
                </div>
              </aside>

              <div className="admin-modal-editor">
                {activeFormField ? (
                  <article className="admin-item">
                    <div className="admin-grid">
                      <label>
                        Field Label
                        <input
                          type="text"
                          value={activeFormField.label}
                          onChange={(event) =>
                            updateRegistrationFormField(activeFormFieldIndex, 'label', event.target.value)
                          }
                        />
                      </label>
                      <label>
                        Field Name (unique)
                        <input
                          type="text"
                          value={activeFormField.name}
                          onChange={(event) =>
                            updateRegistrationFormField(activeFormFieldIndex, 'name', event.target.value)
                          }
                        />
                      </label>
                      <label>
                        Section Title
                        <input
                          type="text"
                          value={activeFormField.section}
                          onChange={(event) =>
                            updateRegistrationFormField(activeFormFieldIndex, 'section', event.target.value)
                          }
                        />
                      </label>
                      <label>
                        Field Type
                        <select
                          value={activeFormField.type}
                          onChange={(event) =>
                            updateRegistrationFormField(activeFormFieldIndex, 'type', event.target.value)
                          }
                        >
                          <option value="text">Text</option>
                          <option value="email">Email</option>
                          <option value="tel">Phone</option>
                          <option value="number">Number</option>
                          <option value="date">Date</option>
                          <option value="select">Dropdown</option>
                          <option value="file">File Upload</option>
                        </select>
                      </label>
                    </div>

                    {activeFormField.type === 'select' ? (
                      <label>
                        Options (comma separated)
                        <input
                          type="text"
                          value={(activeFormField.options ?? []).join(', ')}
                          onChange={(event) =>
                            updateRegistrationFormFieldOptions(activeFormFieldIndex, event.target.value)
                          }
                          placeholder="Online, Offline"
                        />
                      </label>
                    ) : null}

                    <label className="admin-check">
                      <input
                        type="checkbox"
                        checked={Boolean(activeFormField.required)}
                        onChange={(event) =>
                          updateRegistrationFormField(activeFormFieldIndex, 'required', event.target.checked)
                        }
                      />
                      Required field
                    </label>

                    <button
                      type="button"
                      className="admin-danger"
                      onClick={() => removeRegistrationFormField(activeFormFieldIndex)}
                    >
                      Remove Selected Field
                    </button>
                  </article>
                ) : (
                  <p className="admin-helper-text">Select a field from the left to edit.</p>
                )}
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  )
}

export default AdminPage
