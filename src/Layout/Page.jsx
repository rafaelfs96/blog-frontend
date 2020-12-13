import React, { useEffect } from 'react'
import Container from './Container'

function Page({ title, children, wide }) {
  useEffect(() => {
    document.title = `${title} | ComplexApp`
    window.scrollTo(0, 0)
  }, [title])

  return <Container wide={wide}>{children}</Container>
}

export default Page
