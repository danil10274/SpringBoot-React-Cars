
import { useEffect, useState } from 'react'

interface GiphyImageProps {
  name: string
}

interface GiphyResponse {
  data: {
    images: {
      original: {
        url: string
      }
    }
  }[]
}

function GiphyImage({ name }: GiphyImageProps) {
  const [giphyUrl, setGiphyUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    const loadGif = async () => {
      setIsLoading(true)
      setGiphyUrl('')

      try {
        const apiUrl =
          'https://api.giphy.com/v1/gifs/search' +
          '?api_key=VTrxvChXJQ78sDbMD3veV2Z3WtwAT8OJ' +
          '&limit=1&q=' + encodeURIComponent(name + ' car')

        const response = await fetch(apiUrl, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('No se pudo consultar GIPHY')
        }

        const result: GiphyResponse = await response.json()

        if (result.data.length > 0) {
          setGiphyUrl(result.data[0].images.original.url)
        } else {
          setGiphyUrl(
            'https://media.giphy.com/media/YaOxRsmrv9IeA/giphy.gif',
          )
        }
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          setGiphyUrl('')
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    void loadGif()

    return () => controller.abort()
  }, [name])

  if (isLoading) {
    return <p>Buscando GIF...</p>
  }

  if (!giphyUrl) {
    return null
  }

   return (
    <img
      src={giphyUrl}
      alt={`GIF relacionado con ${name}`}
      width="200"
      loading="lazy"
      style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
    />
  )
}

export default GiphyImage