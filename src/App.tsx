import logo from "./assets/logo.svg"
import { NoteCard } from "./components/note-card"
import { NewNoteCard } from "./components/new-note-card"
import { ChangeEvent, useState } from "react"
import { toast } from 'sonner'; 

interface Note {
  id: string;
  date: Date;
  content: string;
}

export function App() {
  const [search, setSearch] = useState('')

  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnLocalStorage = localStorage.getItem('notes')
    if(notesOnLocalStorage) return JSON.parse(notesOnLocalStorage)

    return []
  })

  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content
    }
    
    const notesArray = [newNote, ...notes]

    setNotes(notesArray)

    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  function onNoteDeleted(id: string) {
    const notesArray = notes.filter(note => note.id !== id)

    setNotes(notesArray)

    localStorage.setItem('notes', JSON.stringify(notesArray))
    toast.success("Nota apagada com sucesso!")
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value
    setSearch(query)
  }

  const filteredNotes = search !== ''
    ? notes.filter(note => note.content.toLowerCase().includes(search.toLowerCase()))
    : notes

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5 xl:px-0">
      <img src={logo} alt="logo" className="w-40" />
      
      <form>
        <input 
          type="text" 
          placeholder="busque em suas notas" 
          className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-zinc-500"
          onChange={handleSearch} 
        />
      </form>

      <div className="h-px bg-zinc-700" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
        <NewNoteCard onNoteCreated={onNoteCreated} />
        {filteredNotes.map(note => {
          return <NoteCard id={note.id} date={note.date} content={note.content} onNoteDeleted={onNoteDeleted} /> 
        })}
      </div>
    </div>
  )
}
