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

let speechRecognition: SpeechRecognition | null = null 

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
  const [shouldShowOnboarding, setShoudShowOnboarding] = useState(true);
  const [content, setContent] = useState('')
  const [isRecording, setIsRecording] = useState(false)

  function handleStartEditor() {
    setShoudShowOnboarding(false)
  }

  function handleStopEditor() {
    setShoudShowOnboarding(true)
    handleStopRecording()
  }

  function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value)

    if (event.target.value === "") {
      setShoudShowOnboarding(true)
    }
  }

  function handleSaveNote(event: FormEvent) {
    event.preventDefault()

    if (content === "") {
      toast.error("O conteúdo da nota não pode ser vazio!")
      return
    }

    onNoteCreated(content)
    
    setContent('')    
    setShoudShowOnboarding(true)
    
    toast.success("Nota criada com sucesso!")
  }

  function handleStartRecording() {
    const isSpeechRecognitionSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window

    if (!isSpeechRecognitionSupported) {
      toast.error("Seu navegador não suporta gravação de áudio!")
      //setIsRecording(false)
      return
    }

    setIsRecording(true)
    setShoudShowOnboarding(false)

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

    speechRecognition = new SpeechRecognitionAPI()

    speechRecognition.lang = 'pt-BR'
    speechRecognition.continuous = true
    speechRecognition.maxAlternatives = 1
    speechRecognition.interimResults = true

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript)
      }, '')

      setContent(transcription)
    }

    speechRecognition.onerror = (event) => {
      console.log(event)
    }

    speechRecognition.start()
  }

  function handleStopRecording() {
    setIsRecording(false)
    if (speechRecognition) speechRecognition.stop()
  }

  return (
    <DialogRoot>
      <DialogTrigger className="flex flex-col rounded-md bg-zinc-700 p-5 gap-3 text-left hover:ring-2 hover:ring-zinc-600 focus-visible:ring-2 focus-visible:ring-lime-400 transition-all ease-linear">
        <span className="text-sm font-medium text-zinc-200">Adicionar nota</span>
        <p className="text-sm leading-6 text-zinc-400">Grave uma nota em áudio que será convertida para texto automaticamente</p>
      </DialogTrigger>

      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/50" />
        <DialogContent className="z-10 fixed overflow-hidden inset-0 md:inset-auto md:h-[60vh] md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full bg-zinc-700 md:rounded-md flex flex-col outline-none">
          <DialogClose className="absolute right-0 top-0 bg-zinc-800 p-1.5 text-zinc-400 hover:text-zinc-100">
            <X onClick={handleStopEditor} className="size-5" />
          </DialogClose>

          <form className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-zinc-300">
                Adicionar nota
              </span>
              
              {shouldShowOnboarding ? (
                <p className="text-sm leading-6 text-zinc-400">
                  Comece <button type="button" onClick={handleStartRecording} className="font-medium text-lime-400 hover:underline">gravando uma nota em áudio</button> ou se preferir <button type="button" onClick={handleStartEditor} className="font-medium text-lime-400 hover:underline">utilize apenas texto</button>.
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
            
            {isRecording ? (
              <button type="button" onClick={handleStopRecording} className="w-full flex items-center justify-center gap-2 bg-zinc-900 py-4 text-center text-sm text-zinc-300 outline-none font-medium hover:text-zinc-100 transition-all ease-linear">
                <div className="size-3 rounded-full bg-red-500 animate-pulse" />
                Gravando! (Clique para interromper)
              </button>
            ) : (
              <button type="button" onClick={handleSaveNote} className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500 transition-all ease-linear">
                Salvar nota
              </button>
            )}

          </form>
        </DialogContent>
      </DialogPortal>    
    </DialogRoot>
  )
}