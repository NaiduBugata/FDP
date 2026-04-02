import { useEffect, useMemo, useState } from 'react'
import './AdminPage.css'

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

const downloadExcel = async ({ apiBaseUrl, adminToken, scope, onError }) => {
  try {
    if (!adminToken) {
      throw new Error('Admin API token missing. Login with backend admin credentials.')
    }

    const url = new URL(`${apiBaseUrl}/registrations/export/excel`)
    if (scope && scope !== 'all') {
      url.searchParams.set('scope', scope)
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to download registrations file')
    }

    const blob = await response.blob()
    const contentDisposition = response.headers.get('content-disposition') || ''
    const match = contentDisposition.match(/filename="?([^"]+)"?/i)
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
    onError?.(error?.message || 'Failed to download registrations file')
  }
}

const fetchRegistrations = async ({ apiBaseUrl, adminToken, scope }) => {
  if (!adminToken) {
    throw new Error('Admin API token missing. Login with backend admin credentials.')
  }

  const url = new URL(`${apiBaseUrl}/registrations`)
  if (scope && scope !== 'all') {
    url.searchParams.set('scope', scope)
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch registration details')
  }

  const payload = await response.json()
  return Array.isArray(payload.data) ? payload.data : []
}

function AdminRegistrationsPage({ apiBaseUrl, adminToken, onLogout }) {
  const [allRows, setAllRows] = useState([])
  const [internalRows, setInternalRows] = useState([])
  const [externalRows, setExternalRows] = useState([])

  const [isAllVisible, setIsAllVisible] = useState(false)
  const [isInternalVisible, setIsInternalVisible] = useState(false)
  const [isExternalVisible, setIsExternalVisible] = useState(false)

  const [isLoadingAll, setIsLoadingAll] = useState(false)
  const [isLoadingInternal, setIsLoadingInternal] = useState(false)
  const [isLoadingExternal, setIsLoadingExternal] = useState(false)

  const [isExportingAll, setIsExportingAll] = useState(false)
  const [isExportingInternal, setIsExportingInternal] = useState(false)
  const [isExportingExternal, setIsExportingExternal] = useState(false)

  const [errorAll, setErrorAll] = useState('')
  const [errorInternal, setErrorInternal] = useState('')
  const [errorExternal, setErrorExternal] = useState('')

  const [editingRow, setEditingRow] = useState(null)
  const [editForm, setEditForm] = useState(null)
  const [isSavingEdit, setIsSavingEdit] = useState(false)
  const [editError, setEditError] = useState('')

  const panels = useMemo(
    () => [
      {
        scope: 'all',
        title: 'Registration Data (Complete)',
        rows: allRows,
        isLoading: isLoadingAll,
        error: errorAll,
        isExporting: isExportingAll,
        onRefresh: async () => {
          setIsLoadingAll(true)
          setErrorAll('')
          try {
            const data = await fetchRegistrations({ apiBaseUrl, adminToken, scope: 'all' })
            setAllRows(data)
          } catch (error) {
            setErrorAll(error?.message || 'Failed to fetch registration details')
          } finally {
            setIsLoadingAll(false)
          }
        },
        onDownload: async () => {
          setIsExportingAll(true)
          setErrorAll('')
          await downloadExcel({ apiBaseUrl, adminToken, scope: 'all', onError: setErrorAll })
          setIsExportingAll(false)
        },
      },
      {
        scope: 'internal',
        title: 'Internal Participants',
        rows: internalRows,
        isLoading: isLoadingInternal,
        error: errorInternal,
        isExporting: isExportingInternal,
        onRefresh: async () => {
          setIsLoadingInternal(true)
          setErrorInternal('')
          try {
            const data = await fetchRegistrations({ apiBaseUrl, adminToken, scope: 'internal' })
            setInternalRows(data)
          } catch (error) {
            setErrorInternal(error?.message || 'Failed to fetch registration details')
          } finally {
            setIsLoadingInternal(false)
          }
        },
        onDownload: async () => {
          setIsExportingInternal(true)
          setErrorInternal('')
          await downloadExcel({ apiBaseUrl, adminToken, scope: 'internal', onError: setErrorInternal })
          setIsExportingInternal(false)
        },
      },
      {
        scope: 'external',
        title: 'External Participants',
        rows: externalRows,
        isLoading: isLoadingExternal,
        error: errorExternal,
        isExporting: isExportingExternal,
        onRefresh: async () => {
          setIsLoadingExternal(true)
          setErrorExternal('')
          try {
            const data = await fetchRegistrations({ apiBaseUrl, adminToken, scope: 'external' })
            setExternalRows(data)
          } catch (error) {
            setErrorExternal(error?.message || 'Failed to fetch registration details')
          } finally {
            setIsLoadingExternal(false)
          }
        },
        onDownload: async () => {
          setIsExportingExternal(true)
          setErrorExternal('')
          await downloadExcel({ apiBaseUrl, adminToken, scope: 'external', onError: setErrorExternal })
          setIsExportingExternal(false)
        },
      },
    ],
    [
      adminToken,
      apiBaseUrl,
      allRows,
      errorAll,
      errorExternal,
      errorInternal,
      externalRows,
      internalRows,
      isExportingAll,
      isExportingExternal,
      isExportingInternal,
      isLoadingAll,
      isLoadingExternal,
      isLoadingInternal,
    ],
  )

  const openEdit = (row) => {
    setEditingRow(row)
    setEditForm({
      fullName: row.fullName || '',
      mobileNumber: row.mobileNumber || '',
      emailId: row.emailId || '',
      designation: row.designation || '',
      institution: row.institution || '',
      participantType: row.participantType || '',
      mode: row.mode || 'Online',
      declaration: row.declaration || 'Yes',
      signature: row.signature || '',
    })
    setEditError('')
  }

  const closeEdit = () => {
    setEditingRow(null)
    setEditForm(null)
    setEditError('')
    setIsSavingEdit(false)
  }

  const saveEdit = async () => {
    if (!editingRow?._id || !editForm) {
      return
    }

    setIsSavingEdit(true)
    setEditError('')

    try {
      if (!adminToken) {
        throw new Error('Admin API token missing. Login with backend admin credentials.')
      }

      const response = await fetch(`${apiBaseUrl}/registrations/${editingRow._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(editForm),
      })

      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(payload?.message || 'Failed to update registration')
      }

      await Promise.all(panels.map((panel) => panel.onRefresh()))
      closeEdit()
    } catch (error) {
      setEditError(error?.message || 'Failed to update registration')
    } finally {
      setIsSavingEdit(false)
    }
  }

  useEffect(() => {
    // Keep tables opt-in via View buttons.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminToken, apiBaseUrl])

  return (
    <>
      <header className="admin-topbar">
        <div className="container admin-topbar-inner">
          <p className="brand">QuBioDL 2K26</p>
          <nav className="nav-links is-open">
            <a href="#">Back to Main Website</a>
            <button type="button" className="btn btn-primary" onClick={onLogout}>
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="admin-shell">
        <header className="admin-header">
          <h1>Admin Panel</h1>
          <p>View, edit, and download registration data.</p>
        </header>

        {panels.map((panel) => (
          <section className="admin-card" key={panel.scope}>
            <h2>{panel.title}</h2>
            <div className="admin-row-actions">
              <button
                type="button"
                className="admin-add"
                onClick={async () => {
                  if (panel.scope === 'all') setIsAllVisible(true)
                  if (panel.scope === 'internal') setIsInternalVisible(true)
                  if (panel.scope === 'external') setIsExternalVisible(true)
                  await panel.onRefresh()
                }}
                disabled={panel.isLoading}
              >
                View
              </button>
              <button type="button" className="admin-add" onClick={panel.onRefresh} disabled={panel.isLoading}>
                {panel.isLoading ? 'Refreshing...' : 'Refresh'}
              </button>
              <button type="button" className="admin-muted" onClick={panel.onDownload} disabled={panel.isExporting}>
                {panel.isExporting ? 'Preparing Excel...' : 'Download Excel'}
              </button>
            </div>

            {panel.error ? <p className="admin-error-text">{panel.error}</p> : null}
            {!panel.isLoading && !panel.error &&
            ((panel.scope === 'all' && isAllVisible) ||
              (panel.scope === 'internal' && isInternalVisible) ||
              (panel.scope === 'external' && isExternalVisible)) &&
            panel.rows.length === 0 ? (
              <p className="admin-helper-text">No registrations found.</p>
            ) : null}

            {!panel.isLoading && !panel.error &&
            ((panel.scope === 'all' && isAllVisible) ||
              (panel.scope === 'internal' && isInternalVisible) ||
              (panel.scope === 'external' && isExternalVisible)) &&
            panel.rows.length > 0 ? (
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
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {panel.rows.map((item) => (
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
                        <td>
                          <button type="button" className="admin-muted" onClick={() => openEdit(item)}>
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </section>
        ))}
      </main>

      {editingRow && editForm ? (
        <div className="admin-modal-overlay" onClick={closeEdit}>
          <section className="admin-modal" onClick={(event) => event.stopPropagation()}>
            <header className="admin-modal-header">
              <h3>Edit Registration</h3>
              <div className="admin-row-actions">
                <button type="button" className="admin-muted" onClick={closeEdit} disabled={isSavingEdit}>
                  Close
                </button>
              </div>
            </header>

            <div className="admin-modal-editor">
              <div className="admin-grid">
                <label>
                  Full Name
                  <input
                    type="text"
                    value={editForm.fullName}
                    onChange={(event) => setEditForm((prev) => ({ ...prev, fullName: event.target.value }))}
                  />
                </label>
                <label>
                  Mobile
                  <input
                    type="text"
                    value={editForm.mobileNumber}
                    onChange={(event) => setEditForm((prev) => ({ ...prev, mobileNumber: event.target.value }))}
                  />
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    value={editForm.emailId}
                    onChange={(event) => setEditForm((prev) => ({ ...prev, emailId: event.target.value }))}
                  />
                </label>
                <label>
                  Designation
                  <input
                    type="text"
                    value={editForm.designation}
                    onChange={(event) => setEditForm((prev) => ({ ...prev, designation: event.target.value }))}
                  />
                </label>
                <label>
                  Institution
                  <input
                    type="text"
                    value={editForm.institution}
                    onChange={(event) => setEditForm((prev) => ({ ...prev, institution: event.target.value }))}
                  />
                </label>
                <label>
                  Participant Type
                  <input
                    type="text"
                    value={editForm.participantType}
                    onChange={(event) => setEditForm((prev) => ({ ...prev, participantType: event.target.value }))}
                    placeholder="Include 'Internal' or 'External'"
                  />
                </label>
                <label>
                  Mode
                  <select
                    value={editForm.mode}
                    onChange={(event) => setEditForm((prev) => ({ ...prev, mode: event.target.value }))}
                  >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                  </select>
                </label>
                <label>
                  Declaration
                  <select
                    value={editForm.declaration}
                    onChange={(event) => setEditForm((prev) => ({ ...prev, declaration: event.target.value }))}
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </label>
                <label>
                  Signature
                  <input
                    type="text"
                    value={editForm.signature}
                    onChange={(event) => setEditForm((prev) => ({ ...prev, signature: event.target.value }))}
                  />
                </label>
              </div>

              {editError ? <p className="admin-error-text">{editError}</p> : null}

              <div className="admin-row-actions">
                <button type="button" className="admin-add" onClick={saveEdit} disabled={isSavingEdit}>
                  {isSavingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </>
  )
}

export default AdminRegistrationsPage
