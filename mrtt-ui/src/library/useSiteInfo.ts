import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import type { Site } from '@/types/api'
import { env } from '@/lib/env'

const useSiteInfo = () => {
  const { siteId } = useParams()
  const [siteInfo, setSiteInfo] = useState<Partial<Site>>({})

  useEffect(
    function getSiteInfo() {
      axios.get<Site>(`${env.API_URL}/sites/${siteId}`).then(({ data }) => {
        setSiteInfo(data)
      })
    },
    [siteId]
  )

  return siteInfo
}

export default useSiteInfo
