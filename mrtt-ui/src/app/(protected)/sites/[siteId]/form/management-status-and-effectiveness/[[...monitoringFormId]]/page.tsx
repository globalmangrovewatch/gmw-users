import { notFound } from 'next/navigation'

import ManagementStatusAndEffectivenessForm from '@/components/ManagementStatusAndEffectiveness/ManagementStatusAndEffectivenessForm'

type Props = { params: Promise<{ monitoringFormId?: string[] }> }

export default async function Page({ params }: Props) {
  const { monitoringFormId } = await params
  if (monitoringFormId && monitoringFormId.length > 1) notFound()

  return <ManagementStatusAndEffectivenessForm />
}
