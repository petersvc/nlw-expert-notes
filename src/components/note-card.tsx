import { 
  Root as DialogRoot,
  Trigger as DialogTrigger,
  Content as DialogContent,
  Portal as DialogPortal,
  Overlay as DialogOverlay,
  Close as DialogClose 
} from '@radix-ui/react-dialog';

import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { X } from 'lucide-react';

interface NoteCardProps {
  id: string;
  date: Date;
  content: string;
  onNoteDeleted: (id: string) => void;
}

export function NoteCard(props: NoteCardProps) {
  return (
    <DialogRoot>
      <DialogTrigger className="rounded-md text-left flex flex-col bg-zinc-800 p-5 gap-3 overflow-hidden relative outline-none hover:ring-2 hover:ring-zinc-600 focus-visible:ring-2 focus-visible:ring-lime-400 transition-all ease-linear">
        <span className="text-sm font-medium text-zinc-300">{formatDistanceToNow(props.date, {locale: ptBR, addSuffix: true})}</span>
        
        <p className="text-sm leading-6 text-zinc-400">
          {props.content}
        </p>

        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none" />
      </DialogTrigger>

      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/50" />

        <DialogContent className="flex flex-col z-10 fixed overflow-hidden inset-0 md:inset-auto md:h-[60vh] md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] md:w-full md:rounded-md bg-zinc-700 outline-none">
          <DialogClose className="absolute right-0 top-0 bg-zinc-800 p-1.5 text-zinc-400 hover:text-zinc-100">
            <X className="size-5" />
          </DialogClose>

          <div className="flex flex-1 flex-col gap-3 p-5">
            <span className="text-sm font-medium text-zinc-300">{formatDistanceToNow(props.date, {locale: ptBR, addSuffix: true})}</span>
            
            <p className="text-sm leading-6 text-zinc-400">
              {props.content}
            </p>
          </div>

          <button type="button" onClick={() => props.onNoteDeleted(props.id)} className="w-full bg-zinc-800 py-4 text-center text-sm text-zinc-300 outline-none font-medium group">
            Deseja <span className="text-red-400 group-hover:underline">apagar essa nota</span>?
          </button>
        </DialogContent>
      </DialogPortal>      
    </DialogRoot>
  )
}