
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ImageFormProps {
  imageUrl: string;
  onUrlChange: (url: string) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
  errors: {
    file?: string;
    image?: string;
  };
}

export const ImageForm = ({ imageUrl, onUrlChange, onFileUpload, uploading, errors }: ImageFormProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Add an image</h3>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Upload Image</label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={onFileUpload}
          disabled={uploading}
          className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-garden-primary file:text-white hover:file:bg-garden-secondary"
        />
        {errors.file && (
          <p className="text-sm text-red-600">{errors.file}</p>
        )}
      </div>

      <div className="text-center text-sm text-muted-foreground">or</div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Image URL (HTTPS only)</label>
        <Input
          placeholder="https://example.com/image.jpg"
          value={imageUrl}
          onChange={(e) => onUrlChange(e.target.value)}
          className="col-span-3"
        />
        {errors.image && (
          <p className="text-sm text-red-600">{errors.image}</p>
        )}
      </div>
    </div>
  );
};
