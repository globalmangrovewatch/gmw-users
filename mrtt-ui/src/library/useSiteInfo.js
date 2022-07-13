import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const useSiteInfo = () => {
  const { siteId } = useParams()
  const [siteInfo, setSiteInfo] = useState({})

  useEffect(
    function getSiteInfo() {
      axios.get(`${process.env.REACT_APP_API_URL}/sites/${siteId}`).then(({ data }) => {
        setSiteInfo(data)
      })
    },
    [siteId]
  )

  return siteInfo
}

export default useSiteInfo
