import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import language from '@/language'
import LandscapeForm from '@/views/LandscapeForm'
import Landscapes from '@/views/Landscapes'
import ManageOrganizationUsers from '@/views/ManageOrganizationUsers'
import NewOrganizationUser from '@/views/NewOrganizationUser'
import Organizations from '@/views/Organizations'
import SiteForm from '@/views/SiteForm'
import SiteQuestionsOverview from '@/views/SiteQuestionsOverview/SiteQuestionsOverview'
import Sites from '@/views/Sites'

const { router, saveBlob } = vi.hoisted(() => ({
  router: {
    push: vi.fn<(href: string) => void>(),
    back: vi.fn<() => void>()
  },
  saveBlob: vi.fn<(blob: Blob, name: string) => void>()
}))
let params: Record<string, string> = {}

vi.mock('next/navigation', () => ({ useRouter: () => router, useParams: () => params }))
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ currentUser: { email: 'Me@Example.org' } })
}))
vi.mock('@/lib/download', () => ({ saveBlob }))

type Call = { method: string; path: string; body: unknown }
const fetchMock = vi.fn<(url: string, init?: RequestInit) => Promise<Response>>()
// GET responses by API path (query string included).
let responses: Record<string, unknown> = {}
const calls = (method: string) =>
  fetchMock.mock.calls
    .map(([url, init]): Call => ({
      method: init?.method ?? 'GET',
      path: new URL(url).pathname + new URL(url).search,
      body: init?.body ? JSON.parse(String(init.body)) : undefined
    }))
    .filter((call) => call.method === method)

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

const renderView = (view: ReactNode) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  // SiteForm clears the registration form it lives in once a site is created.
  function RegistrationForm({ children }: { children: ReactNode }) {
    return <FormProvider {...useForm()}>{children}</FormProvider>
  }
  return render(
    <QueryClientProvider client={queryClient}>
      <RegistrationForm>{view}</RegistrationForm>
    </QueryClientProvider>
  )
}

beforeEach(() => {
  params = {}
  responses = {}
  vi.stubGlobal('fetch', fetchMock)
  fetchMock.mockImplementation(async (url, init) => {
    const { pathname, search } = new URL(url)
    const method = init?.method ?? 'GET'
    if (pathname.startsWith('/report/')) return new Response('report')
    if (method !== 'GET') return jsonResponse(responses[`${method} ${pathname}`] ?? {})
    return jsonResponse(responses[pathname + search] ?? responses[pathname] ?? [])
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.clearAllMocks()
})

const openMenuAndPick = async (user: ReturnType<typeof userEvent.setup>, button: string) => {
  await user.click(screen.getByRole('button', { name: button }))
  await user.click(await screen.findByRole('menuitem', { name: language.pages.sites.publicData }))
}

describe('Sites', () => {
  it('lists never-updated sites first, then the most recently updated, and downloads public data', async () => {
    const user = userEvent.setup()
    responses['/sites'] = [
      { id: 1, site_name: 'Older', section_last_updated: '2026-01-01' },
      { id: 2, site_name: 'Newer', section_last_updated: '2026-06-01' },
      { id: 3, site_name: 'Blank', section_last_updated: null }
    ]
    renderView(<Sites />)

    const cards = await screen.findAllByRole('link', { name: /Older|Newer|Blank/ })
    expect(cards.map((card) => card.getAttribute('href'))).toEqual([
      '/sites/3/overview',
      '/sites/2/overview',
      '/sites/1/overview'
    ])

    await openMenuAndPick(user, language.pages.sites.downloadSites)
    await waitFor(() => expect(saveBlob).toHaveBeenCalled())
    expect(calls('GET').map(({ path }) => path)).toContain(
      '/report/answers_as_xlsx?public_only=true'
    )
  })
})

describe('Organizations', () => {
  it('downloads the picked organization’s data and lets only admins manage users', async () => {
    const user = userEvent.setup()
    responses['/organizations'] = [
      { id: 4, organization_name: 'Admin org', role: 'org-admin' },
      { id: 5, organization_name: 'Member org', role: 'org-user' },
      { id: 6, organization_name: 'Other org' }
    ]
    renderView(<Organizations />)

    const memberOrg = (await screen.findByText('Member org')).closest('li')!
    expect(
      within(memberOrg).queryByRole('link', { name: language.pages.organizations.manageUsers })
    ).not.toBeInTheDocument()
    const adminOrg = screen.getByText('Admin org').closest('li')!
    expect(
      within(adminOrg).getByRole('link', { name: language.pages.organizations.manageUsers })
    ).toHaveAttribute('href', '/organizations/4/users')

    await user.click(
      within(memberOrg).getByRole('button', {
        name: language.pages.organizations.downloadOrganizationSites
      })
    )
    await user.click(await screen.findByRole('menuitem', { name: language.pages.sites.publicData }))
    await waitFor(() =>
      expect(calls('GET').map(({ path }) => path)).toContain(
        '/report/answers_as_xlsx?organization_id=5&public_only=true'
      )
    )
    expect(screen.getByText('Other org')).toBeInTheDocument()
  })
})

describe('Landscapes', () => {
  it('lists landscapes alphabetically, ignoring case', async () => {
    responses['/landscapes'] = [
      { id: 1, landscape_name: 'delta', organizations: [], sites: [] },
      { id: 2, landscape_name: 'Bay', organizations: [], sites: [] },
      { id: 3, landscape_name: 'coast', organizations: [], sites: [] }
    ]
    renderView(<Landscapes />)

    const titles = await screen.findAllByRole('heading', { level: 3 })
    expect(titles.map((title) => title.textContent)).toEqual(['Bay', 'coast', 'delta'])
  })
})

describe('SiteForm', () => {
  beforeEach(() => {
    responses['/landscapes'] = [{ id: 7, landscape_name: 'Delta', organizations: [], sites: [] }]
  })

  it('creates a site in the picked landscape, with the default privacy for sections 2–10', async () => {
    const user = userEvent.setup()
    responses['POST /sites'] = { id: 9, site_name: 'Mangrove bay' }
    renderView(<SiteForm />)

    await user.type(await screen.findByLabelText(/^Site Name/), 'Mangrove bay')
    await user.click(screen.getByRole('combobox', { name: /^Landscape/ }))
    await user.click(await screen.findByRole('option', { name: 'Delta' }))
    await user.click(screen.getByRole('combobox', { name: /^Default Data Privacy/ }))
    await user.click(await screen.findByRole('option', { name: language.sectionPrivacy.private }))
    await user.click(screen.getByRole('button', { name: language.buttons.submit }))

    await waitFor(() => expect(router.push).toHaveBeenCalledWith('/sites'))
    const [{ body }] = calls('POST')
    expect(body).toEqual({
      site_name: 'Mangrove bay',
      landscape_id: 7,
      section_data_visibility: {
        1: 'public',
        ...Object.fromEntries([2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => [n, 'private']))
      }
    })
  })

  it('loads a saved site and asks for a landscape before saving', async () => {
    const user = userEvent.setup()
    params = { siteId: '9' }
    responses['/sites/9'] = { id: 9, site_name: 'Mangrove bay' }
    renderView(<SiteForm />)

    expect(await screen.findByLabelText(/^Site Name/)).toHaveValue('Mangrove bay')
    expect(screen.getByText(language.pages.siteform.titleEditSite)).toBeInTheDocument()
    expect(
      screen.queryByRole('combobox', { name: /^Default Data Privacy/ })
    ).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: language.buttons.submit }))
    expect(
      await screen.findByText(language.pages.siteform.validation.landscapeRequired)
    ).toBeInTheDocument()
    expect(calls('PATCH')).toEqual([])
  })
})

describe('LandscapeForm', () => {
  it('keeps the landscape’s organizations and saves them as ids', async () => {
    const user = userEvent.setup()
    params = { landscapeId: '3' }
    responses['/organizations'] = [{ id: 4, organization_name: 'Admin org', role: 'org-admin' }]
    responses['/landscapes/3'] = {
      id: 3,
      landscape_name: 'Delta',
      organizations: [{ id: 8, organization_name: 'Partner org' }],
      sites: [{ site_id: 1, site_name: 'Bay' }]
    }
    responses['PATCH /landscapes/3'] = { id: 3, landscape_name: 'Delta' }
    renderView(<LandscapeForm />)

    expect(await screen.findByLabelText(/^Name/)).toHaveValue('Delta')
    expect(screen.getByText('Partner org')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: language.pages.landscapeForm.delete })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: language.buttons.submit }))
    await waitFor(() => expect(router.push).toHaveBeenCalledWith('/landscapes'))
    expect(calls('PATCH')[0]?.body).toEqual({ landscape_name: 'Delta', organizations: [8] })
  })
})

describe('ManageOrganizationUsers', () => {
  it('locks the signed-in user’s own row and names the user in the remove prompt', async () => {
    const user = userEvent.setup()
    params = { organizationId: '4' }
    responses['/organizations/4'] = { id: 4, organization_name: 'Admin org' }
    responses['/organizations/4/users'] = [
      { id: 1, name: 'Me', email: 'me@example.org', role: 'org-admin' },
      { id: 2, name: 'Ana', email: 'ana@example.org', role: 'org-user' }
    ]
    renderView(<ManageOrganizationUsers />)

    const remove = language.pages.manageOrganizationUsers.delete
    expect(await screen.findByRole('button', { name: `${remove}: Me` })).toBeDisabled()
    expect(screen.getByRole('radio', { name: 'Me: Admin' })).toBeDisabled()

    await user.click(screen.getByRole('radio', { name: 'Ana: Admin' }))
    await waitFor(() =>
      expect(calls('PATCH')[0]?.body).toEqual(expect.objectContaining({ role: 'org-admin' }))
    )

    await user.click(screen.getByRole('button', { name: `${remove}: Ana` }))
    expect(
      await screen.findByText(
        language.pages.manageOrganizationUsers.deletePrompt.getPromptText({
          userName: 'Ana',
          organizationName: 'Admin org'
        })
      )
    ).toBeInTheDocument()
  })
})

describe('NewOrganizationUser', () => {
  it('explains when the email has no account', async () => {
    const user = userEvent.setup()
    params = { organizationId: '4' }
    responses['/organizations/4'] = { id: 4, organization_name: 'Admin org' }
    fetchMock.mockImplementationOnce(async () => jsonResponse(responses['/organizations/4']))
    renderView(<NewOrganizationUser />)

    await user.type(
      await screen.findByLabelText(new RegExp(language.pages.newOrganizationUser.email)),
      'nobody@example.org'
    )
    fetchMock.mockImplementationOnce(async () => jsonResponse({ error: 'Record not found' }, 404))
    await user.click(screen.getByRole('button', { name: language.buttons.submit }))

    expect(
      await screen.findByText(
        language.pages.newOrganizationUser.getUserDoesntExist('nobody@example.org')
      )
    ).toBeInTheDocument()
  })
})

describe('SiteQuestionsOverview', () => {
  it('links every section and lists monitoring forms newest first', async () => {
    params = { siteId: '9' }
    responses['/sites/9'] = { id: 9, site_name: 'Mangrove bay', landscape_id: 7 }
    responses['/landscapes'] = [{ id: 7, landscape_name: 'Delta', organizations: [], sites: [] }]
    responses['/sites/9/monitoring_answers'] = [
      { id: 1, form_type: 'managementStatusAndEffectiveness', monitoring_date: '2026-01-01' },
      { id: 2, form_type: 'ecologicalStatusAndOutcomes', monitoring_date: '2026-05-01' }
    ]
    renderView(<SiteQuestionsOverview />)

    expect(await screen.findByText('Delta')).toBeInTheDocument()
    const { formName } = language.pages.siteQuestionsOverview
    expect(screen.getByRole('link', { name: formName.costs })).toHaveAttribute(
      'href',
      '/sites/9/form/costs'
    )
    const monitoringLinks = screen.getAllByRole('link', {
      name: new RegExp(
        `${formName.ecologicalStatusOutcomes}|${formName.managementStatusAndEffectiveness}`
      )
    })
    expect(monitoringLinks.map((link) => link.getAttribute('href'))).toEqual([
      '/sites/9/form/ecological-status-and-outcomes/2',
      '/sites/9/form/management-status-and-effectiveness/1'
    ])
  })
})
