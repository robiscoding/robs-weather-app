import * as LocationApi from '@/api/location'
import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

vi.mock('@/api/location')
vi.mock('@/api/weather')

beforeEach(() => {
  vi.mocked(LocationApi.getBrowserLocation).mockRejectedValue(new Error('denied'))
})

describe('App', () => {
  it('renders the app heading', async () => {
    render(<App />)
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /rob's weather app/i })).toBeInTheDocument()
    )
  })
})
