import React from 'react'
import { useMatomo } from '@datapunt/matomo-tracker-react'

export default function Matomo({ children, pageTitle, handleEvent }) {
  const { trackPageView } = useMatomo()

  // Track page view
  React.useEffect(() => {
    trackPageView({
      documentTitle: pageTitle, // optional
    });
    console.log("matomo page view executed")
  }, [])

  return (
    <>
      {children}
    </>
  )
}