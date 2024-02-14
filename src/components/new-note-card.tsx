import { 
  Root as DialogRoot,
  Trigger as DialogTrigger,
  Content as DialogContent,
  Portal as DialogPortal,
  Overlay as DialogOverlay,
  Close as DialogClose 
} from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'sonner'; 

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void;
}

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
  const [shouldShowOnboarding, setShoudShowOnboarding] = useState(true);
  const [content, setContent] = useState('')

  function handleStartEditor() {
    setShoudShowOnboarding(false)
  }

  function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value)

    if (event.target.value === "") setShoudShowOnboarding(true)
  }

  function handleSaveNote(event: FormEvent) {
    event.preventDefault()
    onNoteCreated(content)
    setContent('')
    setShoudShowOnboarding(true)
    toast.success("Nota criada com sucesso!")
  }

  function handleStartRecording() {

  }

  return (
    <DialogRoot>
      <DialogTrigger className="flex flex-col rounded-md bg-zinc-700 p-5 gap-3 text-left hover:ring-2 hover:ring-zinc-600 focus-visible:ring-2 focus-visible:ring-lime-400 transition-all ease-linear">
        <span className="text-sm font-medium text-zinc-200">Adicionar nota</span>
        <p className="text-sm leading-6 text-zinc-400">Grave uma nota em áudio que será convertida para texto automaticamente</p>
      </DialogTrigger>

      <DialogPortal>
        <DialogContent className="z-10 fixed h-[60vh] overflow-hidden left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[640px] w-full bg-zinc-700 rounded-md flex flex-col outline-none">
          <DialogClose className="absolute right-0 top-0 bg-zinc-800 p-1.5 text-zinc-400 hover:text-zinc-100">
            <X className="size-5" />
          </DialogClose>

          <form onSubmit={handleSaveNote} className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-zinc-300">
                Adicionar nota
              </span>
              
              {shouldShowOnboarding ? (
                <p className="text-sm leading-6 text-zinc-400">
                  Comece <button className="font-medium text-lime-400 hover:underline">gravando uma nota em áudio</button> ou se preferir <button onClick={handleStartEditor} className="font-medium text-lime-400 hover:underline">utilize apenas texto</button>.
                </p>
              ) : (
                <textarea
                  autoFocus
                  className="text-sm leading-6 text-zinc-400 bg-transparent resize-none flex-1 outline-none"
                  onChange={handleContentChanged}
                  value={content}
                />
              )}
            </div>

            <button type="submit" className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500 transition-all ease-linear">
              Salvar nota
            </button>

          </form>
        </DialogContent>
        <DialogOverlay className="fixed inset-0 bg-black/50" />
      </DialogPortal>    
    </DialogRoot>
  )
}