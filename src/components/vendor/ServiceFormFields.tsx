import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, type ServiceFormValues } from "./types";

export default function ServiceFormFields({
  values,
  onChange,
  files,
  onFilesChange,
  showImages = false,
}: {
  values: ServiceFormValues;
  onChange: (field: keyof ServiceFormValues, value: string) => void;
  files?: File[];
  onFilesChange?: (files: File[]) => void;
  showImages?: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="serviceName">Service Name</Label>
        <Input
          id="serviceName"
          value={values.serviceName}
          onChange={(event) => onChange("serviceName", event.target.value)}
          placeholder="e.g. Wedding Photography"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="category">Category</Label>
        <Select
          value={values.category}
          onValueChange={(value) => onChange("category", value ?? "")}
        >
          <SelectTrigger id="category" className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={4}
          value={values.description}
          onChange={(event) => onChange("description", event.target.value)}
          placeholder="Tell customers what your service includes..."
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            min="0"
            value={values.price}
            onChange={(event) => onChange("price", event.target.value)}
            placeholder="500"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={values.location}
            onChange={(event) => onChange("location", event.target.value)}
            placeholder="City or area"
          />
        </div>
      </div>
      {showImages && (
        <div className="space-y-1.5">
          <Label htmlFor="images">Service Images</Label>
          <Input
            id="images"
            type="file"
            accept="image/*"
            multiple
            onChange={(event) =>
              onFilesChange?.(Array.from(event.target.files ?? []))
            }
          />
          {files && files.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {files.length} image{files.length > 1 ? "s" : ""} selected
            </p>
          )}
        </div>
      )}
    </div>
  );
}
