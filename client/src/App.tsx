import GiphyImage from './GiphyImage'
import { useEffect, useState } from 'react'
import './App.css'

interface Car {
  id: number
  name: string
  model: string
  color: string
  price: number
}

function App() {
  const [cars, setCars] = useState<Car[]>([])
  const [name, setName] = useState('')
  const [model, setModel] = useState('')
  const [color, setColor] = useState('')
  const [price, setPrice] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const loadCars = async () => {
    try {
      const response = await fetch('http://localhost:8081/cars')
      if (!response.ok) throw new Error()

      const data = await response.json()
      const carList = data._embedded?.cars ?? []

      setCars(
        carList.map((car: {
          name: string
          model?: string
          color?: string
          price?: number
          _links?: { self?: { href?: string } }
        }) => ({
          id: Number(car._links?.self?.href?.split('/').pop()),
          name: car.name,
          model: car.model ?? '',
          color: car.color ?? '',
          price: car.price ?? 0,
        })),
      )
      setError('')
    } catch {
      setError('No se pudieron cargar los carros. Revisa Spring Boot.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadCars()
  }, [])

  const clearForm = () => {
    setName('')
    setModel('')
    setColor('')
    setPrice('')
    setEditingId(null)
  }

  const saveCar = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')
    setError('')

    try {
      const isEditing = editingId !== null
      const response = await fetch(
        isEditing
          ? `http://localhost:8081/cars/${editingId}`
          : 'http://localhost:8081/cars',
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            model: model.trim(),
            color: color.trim(),
            price: Number(price),
          }),
        },
      )

      if (!response.ok) throw new Error()

      clearForm()
      setMessage(isEditing ? 'Carro actualizado correctamente.' : 'Carro agregado correctamente.')
      await loadCars()
    } catch {
      setError('No se pudo guardar el carro. Comprueba que Spring Boot esté funcionando.')
    }
  }

  const editCar = (car: Car) => {
    setEditingId(car.id)
    setName(car.name)
    setModel(car.model)
    setColor(car.color)
    setPrice(String(car.price))
    setMessage('')
    setError('')
  }

  return (
    <main className="container">
      <header className="page-header">
        <p className="eyebrow">SPRING BOOT + REACT</p>
        <h1>Catálogo de carros</h1>
        <p>Administra los vehículos mediante nuestra API REST.</p>
      </header>

      <form className="car-form" onSubmit={saveCar}>
        <h2>{editingId !== null ? 'Actualizar carro' : 'Agregar carro'}</h2>

        <label htmlFor="name">Nombre</label>
        <input id="name" value={name} onChange={e => setName(e.target.value)} required />

        <label htmlFor="model">Modelo</label>
        <input id="model" value={model} onChange={e => setModel(e.target.value)} required />

        <label htmlFor="color">Color</label>
        <input id="color" value={color} onChange={e => setColor(e.target.value)} required />

        <label htmlFor="price">Precio</label>
        <input
          id="price"
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={e => setPrice(e.target.value)}
          required
        />

        <button type="submit">
          {editingId !== null ? 'Guardar cambios' : 'Agregar carro'}
        </button>

        {editingId !== null && (
          <button type="button" onClick={clearForm}>Cancelar edición</button>
        )}
      </form>

      {message && <p className="message">{message}</p>}
      {error && <p className="message error">{error}</p>}
      {loading && <p className="message">Cargando carros...</p>}

      {!loading && !error && (
        <>
          <p className="count">Vehículos disponibles: {cars.length}</p>
          <section className="car-grid">
            {cars.map(car => (
              <article className="car-card" key={car.id}>
                <span className="car-icon">🚗</span>
                <h2>{car.name}</h2>
                <GiphyImage name={car.name} />
                <p>Modelo: {car.model || 'Sin especificar'}</p>
                <p>Color: {car.color || 'Sin especificar'}</p>
                <p>Precio: {car.price ? car.price.toLocaleString('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  maximumFractionDigits: 2,
                }) : 'No especificado'}</p>
                <p>Vehículo #{car.id}</p>
                <button type="button" onClick={() => editCar(car)}>Editar</button>
              </article>
            ))}
          </section>
        </>
      )}
    </main>
  )
}

export default App
