'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import ButtonSecondaryWithLoader from '@/components/ButtonSecondaryWithLoader'
import ButtonSubmit from '@/components/ButtonSubmit'
import ConfirmPrompt from '@/components/ConfirmPrompt/ConfirmPrompt'
import { FormInput } from '@/components/form/FormInput'
import { FormLayout } from '@/components/form/layout'
import ItemDoesntExist from '@/components/ItemDoesntExist'
import LoadingIndicator from '@/components/LoadingIndicator'
import SubmitErrorWithExtraErrorContent from '@/components/SubmitErrorWithExtraErrorContent'
import { Button } from '@/components/ui/button'
import { MultiCombobox } from '@/components/ui/combobox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { ButtonContainer, ContentWrapper, PaddedSection, RowFlexEnd } from '@/components/ui/layout'
import { toast } from '@/components/ui/toast'
import { ErrorText, PageTitle } from '@/components/ui/typography'
import USER_ROLES from '@/constants/userRoles'
import { isNotFound, useLoadErrorToast } from '@/hooks/useLoadErrorToast'
import language from '@/language'
import { isApiError } from '@/lib/api'
import {
  landscapeQueries,
  useCreateLandscape,
  useDeleteLandscape,
  useUpdateLandscape
} from '@/queries/landscapes'
import { organizationQueries } from '@/queries/organizations'

const pageLanguage = language.pages.landscapeForm
const nameRequired = pageLanguage.validation.nameRequired

const validationSchema = z.object({
  landscape_name: z.string({ error: nameRequired }).min(1, nameRequired),
  // Organization ids, as strings for the combobox.
  selectedOrganizations: z.array(z.string()).min(1, pageLanguage.validation.organizationRequired)
})

type LandscapeFormValues = z.infer<typeof validationSchema>

/** Creates a landscape (`/landscapes/new`) or edits / deletes one (`/landscapes/:id/edit`). */
function LandscapeForm() {
  const [isDeleteConfirmPromptOpen, setIsDeleteConfirmPromptOpen] = useState(false)
  const [isSubmitError, setIsSubmitError] = useState(false)
  const { landscapeId } = useParams<{ landscapeId?: string }>()
  const isNewLandscape = !landscapeId
  const router = useRouter()

  const organizationsQuery = useQuery(organizationQueries.list())
  const landscapeQuery = useQuery({
    ...landscapeQueries.detail(landscapeId ?? ''),
    enabled: !isNewLandscape
  })
  const createLandscape = useCreateLandscape()
  const updateLandscape = useUpdateLandscape(landscapeId ?? '')
  const deleteLandscape = useDeleteLandscape(landscapeId ?? '')
  useLoadErrorToast(organizationsQuery.error, landscapeQuery.error)

  const landscape = landscapeQuery.data
  const hasSites = !!landscape?.sites.length
  const isSubmitting = createLandscape.isPending || updateLandscape.isPending

  // The organizations the user belongs to, plus any already on the landscape (so they show).
  const organizationOptions = useMemo(() => {
    const options = new Map<string, string>()
    for (const { id, organization_name, role } of organizationsQuery.data ?? []) {
      if (role === USER_ROLES.orgAdmin || role === USER_ROLES.orgUser) {
        options.set(String(id), organization_name)
      }
    }
    for (const { id, organization_name } of landscape?.organizations ?? []) {
      options.set(String(id), organization_name)
    }
    return [...options].map(([value, label]) => ({ value, label }))
  }, [organizationsQuery.data, landscape])

  const form = useForm<LandscapeFormValues>({
    resolver: zodResolver(validationSchema, undefined, { raw: true }),
    defaultValues: { landscape_name: '', selectedOrganizations: [] }
  })
  const { reset } = form

  useEffect(() => {
    if (landscape) {
      reset({
        landscape_name: landscape.landscape_name,
        selectedOrganizations: landscape.organizations.map(({ id }) => String(id))
      })
    }
  }, [landscape, reset])

  const handleSubmit = ({ landscape_name, selectedOrganizations }: LandscapeFormValues) => {
    setIsSubmitError(false)
    const mutation = isNewLandscape ? createLandscape : updateLandscape
    const getSuccessMessage = isNewLandscape
      ? language.success.getCreateThingSuccessMessage
      : language.success.getEditThingSuccessMessage

    mutation.mutate(
      { landscape_name, organizations: selectedOrganizations.map(Number) },
      {
        onSuccess: (saved) => {
          toast.success(getSuccessMessage(saved.landscape_name))
          router.push('/landscapes')
        },
        onError: (error) => {
          setIsSubmitError(true)
          toast.error(
            <SubmitErrorWithExtraErrorContent
              extraErrorContent={isApiError(error) ? error.body?.error : undefined}
            />
          )
        }
      }
    )
  }

  const handleDeleteConfirm = () => {
    deleteLandscape.mutate(undefined, {
      onSuccess: () => {
        toast.success(
          language.success.getDeleteThingSuccessMessage(landscape?.landscape_name ?? '')
        )
        router.push('/landscapes')
      },
      onError: () => toast.error(language.error.delete)
    })
  }

  if (organizationsQuery.isLoading || landscapeQuery.isLoading) return <LoadingIndicator />
  if (isNotFound(landscapeQuery.error)) return <ItemDoesntExist item={pageLanguage.landscape} />

  return (
    <>
      <ContentWrapper>
        <PageTitle>{isNewLandscape ? pageLanguage.titleNew : pageLanguage.titleEdit}</PageTitle>
        <Form {...form}>
          <FormLayout onSubmit={form.handleSubmit(handleSubmit)} noValidate>
            <FormInput<LandscapeFormValues, 'landscape_name'>
              name='landscape_name'
              label={pageLanguage.labelName}
              required
            />
            <FormField
              control={form.control}
              name='selectedOrganizations'
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>{pageLanguage.labelOrganizations}</FormLabel>
                  <FormControl>
                    <MultiCombobox
                      options={organizationOptions}
                      inputRef={field.ref}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <RowFlexEnd>
              {isSubmitError ? <ErrorText>{language.error.submit}</ErrorText> : null}
            </RowFlexEnd>
            <ButtonContainer>
              <Button type='button' variant='outline' onClick={() => router.push('/landscapes')}>
                {language.buttons.cancel}
              </Button>
              <ButtonSubmit isSubmitting={isSubmitting} />
            </ButtonContainer>
          </FormLayout>
        </Form>
      </ContentWrapper>
      {!isNewLandscape ? (
        <>
          <PaddedSection>
            <p>{hasSites ? pageLanguage.isAssociatedSites : pageLanguage.noAssociatedSites}</p>
            <div>
              <ButtonSecondaryWithLoader
                type='button'
                variant='destructive'
                disabled={hasSites}
                onClick={() => setIsDeleteConfirmPromptOpen(true)}
                isHolding={deleteLandscape.isPending}
                holdingContent={language.buttons.deleting}>
                {pageLanguage.delete}
              </ButtonSecondaryWithLoader>
            </div>
          </PaddedSection>
          <ConfirmPrompt
            isOpen={isDeleteConfirmPromptOpen}
            setIsOpen={setIsDeleteConfirmPromptOpen}
            title={pageLanguage.deletePrompt.title}
            promptText={pageLanguage.deletePrompt.promptText}
            confirmButtonText={pageLanguage.deletePrompt.buttonText}
            onConfirm={handleDeleteConfirm}
          />
        </>
      ) : null}
    </>
  )
}

export default LandscapeForm
