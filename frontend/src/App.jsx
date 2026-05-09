import { useState, useEffect } from 'react'
import './App.css'

const API_BASE = 'http://localhost:5003'

function App() {
  const [students, setStudents] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ id: '', name: '', course: '' })

  useEffect(() => {
    fetchStudents()
  }, [])


  const fetchStudents = async () => {
    const response = await fetch(`${API_BASE}/students`)
    const data = await response.json()
    setStudents(data)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editing) {
      await fetch(`${API_BASE}/student/${editing}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, course: form.course })
      })
      setEditing(null)
    } else {
      await fetch(`${API_BASE}/student`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
    }
    setForm({ id: '', name: '', course: '' })
    fetchStudents()
  }

  const handleEdit = (student) => {
    setEditing(student.id)
    setForm({ id: student.id, name: student.name, course: student.course })
  }

  const handleDelete = async (id) => {
    await fetch(`${API_BASE}/student/${id}`, { method: 'DELETE' })
    fetchStudents()
  }

  return (
    <div className="App">
      <h1>Student Management</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="ID"
          value={form.id}
          onChange={(e) => setForm({ ...form, id: e.target.value })}
          required
          disabled={editing}
        />
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Course"
          value={form.course}
          onChange={(e) => setForm({ ...form, course: e.target.value })}
          required
        />
        <button type="submit">{editing ? 'Update' : 'Add'} Student</button>
        {editing && <button type="button" onClick={() => { setEditing(null); setForm({ id: '', name: '', course: '' }) }}>Cancel</button>}
      </form>
      <ul>
        {students.map(student => (
          <li key={student.id}>
            {student.id} - {student.name} - {student.course}
            <button onClick={() => handleEdit(student)}>Edit</button>
            <button onClick={() => handleDelete(student.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
