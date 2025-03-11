"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ImagePlus,
  Upload,
  Video,
  X,
  ImageIcon,
  GripVertical,
  Ellipsis,
  Trash,
} from "lucide-react";
import { useState, useRef, useEffect, Dispatch, SetStateAction } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EventStateEdit } from "@/app/_types/event-types";
import { motion } from "framer-motion";

interface ImageUploadProps {
  data: EventStateEdit["images"];
  video: EventStateEdit["video"];
  onUpdate: (data: Partial<EventStateEdit["images"]>) => void;
  onVideoUpdate: (video: File | null) => void;
  setVideoFile: Dispatch<SetStateAction<null |File>>
}

interface SortableImageProps {
  image: EventStateEdit["images"]["files"][0];
  removeImage: (id: string) => void;
  setCoverImage: (id: string) => void;
  openImageEditor: (id: string) => void;
}

function SortableImage({
  image,
  removeImage,
  setCoverImage,
  openImageEditor,
}: SortableImageProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative flex-shrink-0">
      <img
        src={image.preview}
        alt="Uploaded"
        className="w-24 h-24 object-cover rounded-lg border dark:border-borderDark border-gray-200"
        style={{
          objectPosition: `${image.focusPoint.x}% ${image.focusPoint.y}%`,
        }}
      />
      {image.isCover && (
        <span className="absolute bottom-2 left-2 dark:bg-gray-800 bg-gray-100 dark:text-gray-100 text-gray-500 font-bold text-xs px-2 py-1 rounded-full">
          Cover
        </span>
      )}
      <div
        {...attributes}
        {...listeners}
        className="absolute bottom-2 right-2 cursor-move"
      >
        <GripVertical className="h-4 w-4 text-black drop-shadow-lg" />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="absolute top-2 right-2 cursor-pointer dark:bg-gray-800 bg-gray-100 rounded-full p-1">
            <Ellipsis className="h-4 w-4" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setCoverImage(image.id)}>
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Set as cover
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openImageEditor(image.id)}>
            <div className="flex items-center gap-2">
              <ImagePlus className="h-4 w-4" />
              Edit image
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => removeImage(image.id)}>
            <div className="flex items-center gap-2">
              <Trash className="h-4 w-4" />
              Remove
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default function ImageUploadForm({
  data,
  video,
  onUpdate,
  onVideoUpdate,
  setVideoFile
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>("");

  useEffect(()=>{

    if(video && typeof video === "string" && (video as string)?.startsWith("https")){
      setVideoPreviewUrl(video)
    }

    
  },[video])
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files, "image");
    }
  };

  const handleFiles = (files: FileList | null, type: "image" | "video") => {
    // Null check added
    if (!files || files.length === 0) return;

    if (type === "image") {
      const newImages = Array.from(files)
        .filter((file) => {
          if (file.type !== "image/jpeg" && file.type !== "image/png") {
            alert("Only JPEG and PNG files are allowed for images.");
            return false;
          }
          if (file.size > 2 * 1024 * 1024) {
            alert("Image file size must be less than 2MB.");
            return false;
          }
          return true;
        })
        .map((file, index) => ({
          id: Math.random().toString(36).substr(2, 9),
          file,
          preview: URL.createObjectURL(file),
          isCover: data?.files?.length === 0 && index === 0,
          focusPoint: { x: 50, y: 50 },
        }));

      onUpdate({ files: [...(data?.files || []), ...newImages] });
    } else {
    
      const file = files[0];
      if (file.type !== "video/mp4" && file.type !== "video/quicktime") {
        alert("Only MP4 and MOV files are allowed for videos.");
        return;
      }
      if (file.size > 100 * 1024 * 1024) {
        alert("Video file size must be less than 100MB.");
        return;
      }
      // console.log("video file: ",file)
      const videoUrl = URL.createObjectURL(file);
      setVideoPreviewUrl(videoUrl);
      onVideoUpdate(file);
      setVideoFile(file)
    }
  };

  const removeImage = (id: string) => {
    const newImages = data?.files.filter((img) => img?.id !== id);
    if (
      data?.files?.find((img) => img?.id === id)?.isCover &&
      newImages.length > 0
    ) {
      newImages[0].isCover = true;
    }
    onUpdate({ files: newImages });
  };

  const setCoverImage = (id: string) => {
    const newImages = data?.files.map((img) => ({
      ...img,
      isCover: img?.id === id,
    }));
    onUpdate({ files: newImages });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = data?.files?.findIndex((item) => item.id === active.id);
      const newIndex = data?.files?.findIndex((item) => item.id === over.id);
      const newImages = arrayMove(data?.files, oldIndex, newIndex);
      onUpdate({ files: newImages });
    }
  };

  const handleFocusPointChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!editingImage) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(
      0,
      Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)
    );
    const y = Math.max(
      0,
      Math.min(100, ((e.clientY - rect.top) / rect.height) * 100)
    );

    const newImages = data?.files.map((img) =>
      img?.id === editingImage ? { ...img, focusPoint: { x, y } } : img
    );
    onUpdate({ files: newImages });
  };

  useEffect(() => {
    return () => {
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
    };
  }, [videoPreviewUrl]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full space-y-8 bg-white dark:bg-transparent p-6 shadow-xl border dark:border-borderDark border-gray-50 rounded-lg"
    >
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold mt-2 ">Add Images</h2>
          <p className="text-sm text-muted-foreground">
            Use photos that set the mood, and avoid distracting text overlays
          </p>
        </motion.div>

        <Card
          className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center
            dark:border-borderDark dark:bg-tertiary bg-white
            ${
              dragActive
                ? "border-primary bg-primary/5 dark:bg-primary/10"
                : "border-muted-foreground/25"
            }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <ImagePlus className="h-12 w-12 text-muted-foreground/50 dark:text-muted-foreground/75" />
            <p className="mt-4 text-sm text-muted-foreground">
              Drag and drop images or
            </p>
            <Button
              className="mt-4 w-full max-w-xs bg-zinc-900 text-white hover:bg-zinc-800"
              onClick={() => imageInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Photos
            </Button>
            <input
              type="file"
              ref={imageInputRef}
              onChange={(e) =>
                e.target.files && handleFiles(e.target.files, "image")
              }
              accept="image/jpeg,image/png"
              className="hidden"
              multiple
            />
          </motion.div>
        </Card>

        {data?.files?.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="flex overflow-x-auto space-x-4 py-4"
            >
              <SortableContext
                items={data?.files}
                strategy={horizontalListSortingStrategy}
              >
                {data?.files.map((image) => (
                  <SortableImage
                    key={image.id}
                    image={image}
                    removeImage={removeImage}
                    setCoverImage={setCoverImage}
                    openImageEditor={(id) => setEditingImage(id)}
                  />
                ))}
              </SortableContext>
            </motion.div>
          </DndContext>
        )}

        <ul className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-muted-foreground">
          <li>• Recommended image size: 300×300px</li>
          <li>• Maximum file size: max 2 MB</li>
          <li>• Supported image files: JPEG, PNG</li>
        </ul>
      </div>

      <div className="w-full h-[1px] bg-gray-200"></div>

      <div className="space-y-4">
        <div>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-2xl font-semibold"
          >
            Add Video
          </motion.h2>
          <p className="text-sm text-muted-foreground">
            Add a video to show your event&apos;s vibe. The video will appear
            with your event images.
          </p>
        </div>

        {video && videoPreviewUrl ? (
          <div className="relative">
            <video
              src={videoPreviewUrl}
              className="w-full h-64 object-cover rounded-lg"
              controls
              playsInline
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-50 hover:opacity-100"
              onClick={() => {
                if (videoPreviewUrl) {
                  URL.revokeObjectURL(videoPreviewUrl);
                }
                setVideoPreviewUrl("");
                onVideoUpdate(null);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card
              className="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center dark:border-borderDark dark:bg-tertiary bg-white"
              onClick={() => videoInputRef.current?.click()}
            >
              <Video className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-sm text-muted-foreground">
                Click to upload a video
              </p>
              <input
                type="file"
                ref={videoInputRef}
                onChange={(e) =>
                  e.target.files && handleFiles(e.target.files, "video")
                }
                accept="video/mp4,video/quicktime"
                className="hidden"
              />
            </Card>
          </motion.div>
        )}

        <ul className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-muted-foreground">
          <li>• Maximum file size: 100 MB</li>
          <li>• Supported video files: MP4, MOV</li>
        </ul>
      </div>

      <Dialog open={!!editingImage} onOpenChange={() => setEditingImage(null)}>
        <DialogContent className="w-full max-w-4xl p-0">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Focus Point</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 space-y-6">
              <div
                className="relative w-full h-[400px] overflow-hidden cursor-crosshair bg-gray-50 rounded-lg"
                onMouseDown={(e) => {
                  setIsMouseDown(true);
                  handleFocusPointChange(e);
                }}
                onMouseMove={(e) => {
                  if (isMouseDown) {
                    handleFocusPointChange(e);
                  }
                }}
                onMouseUp={() => setIsMouseDown(false)}
                onMouseLeave={() => setIsMouseDown(false)}
              >
                {editingImage && (
                  <>
                    <img
                      src={
                        data?.files?.find((img) => img?.id === editingImage)
                          ?.preview
                      }
                      alt="Editing"
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute w-8 h-8 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg"
                      style={{
                        left: `${
                          data?.files?.find((img) => img?.id === editingImage)
                            ?.focusPoint.x
                        }%`,
                        top: `${
                          data?.files?.find((img) => img?.id === editingImage)
                            ?.focusPoint.y
                        }%`,
                      }}
                    >
                      <div className="absolute inset-1 bg-red-500 rounded-full" />
                    </div>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-500">
                Adjust the focus point by dragging to display the main focus
                area.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-base font-medium">Preview your image</h3>
              <p className="text-sm text-gray-500">
                See how your image looks on different screen sizes. Attendees
                can expand the image to see the whole thing.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                <div className="space-y-2">
                  <div className="w-24 h-24 rounded-lg overflow-hidden border">
                    <img
                      src={
                        data?.files?.find((img) => img?.id === editingImage)
                          ?.preview
                      }
                      alt="1:1 Preview"
                      className="w-full h-full object-cover"
                      style={{
                        objectPosition: `${
                          data?.files?.find((img) => img?.id === editingImage)
                            ?.focusPoint.x
                        }% ${
                          data?.files?.find((img) => img?.id === editingImage)
                            ?.focusPoint.y
                        }%`,
                      }}
                    />
                  </div>
                  <p className="text-sm font-medium">Square (1:1)</p>
                </div>
                <div className="space-y-2">
                  <div className="w-48 h-24 rounded-lg overflow-hidden border">
                    <img
                      src={
                        data?.files?.find((img) => img?.id === editingImage)
                          ?.preview
                      }
                      alt="2:1 Preview"
                      className="w-full h-full object-cover"
                      style={{
                        objectPosition: `${
                          data?.files?.find((img) => img?.id === editingImage)
                            ?.focusPoint.x
                        }% ${
                          data?.files?.find((img) => img?.id === editingImage)
                            ?.focusPoint.y
                        }%`,
                      }}
                    />
                  </div>
                  <p className="text-sm font-medium">Rectangle (2:1)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 p-4 border-t">
            <div
              className="cursor-pointer hover:bg-gray-100 hover:text-zinc-900 transition-all duration-300 bg-gray-50 border border-gray-200 font-bold rounded-full px-8 py-[6px]"
              onClick={() => setEditingImage(null)}
            >
              Cancel
            </div>
            <div
              className="cursor-pointer hover:bg-zinc-900 hover:text-white transition-all duration-300 bg-primary text-white font-bold rounded-full px-8 py-[6px]"
              onClick={() => setEditingImage(null)}
            >
              Save
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
