
import { Textarea } from "@/components/ui/textarea";

interface NoteFormProps {
  content: string;
  onChange: (content: string) => void;
  error?: string;
}

export const NoteForm = ({ content, onChange, error }: NoteFormProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Add a note</h3>
      <Textarea
        className="w-full rounded-md border border-input bg-transparent px-3 py-2 min-h-[100px]"
        placeholder="Write your note here..."
        value={content}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
