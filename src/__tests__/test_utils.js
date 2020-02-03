// withMarkup.ts
import { MatcherFunction } from '@testing-library/react'


const withMarkup = (text: string) => {
    getByText((content, node) => {
      const hasText = (node: HTMLElement) => node.textContent === text
      const childrenDontHaveText = Array.from(node.children).every(
        child => !hasText(child, HTMLElement)
      )
      return hasText(node) && childrenDontHaveText
    })
  }

export default withMarkup