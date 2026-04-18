import { useRef, useState, useCallback } from 'react'
import { Upload, X } from 'lucide-react'
import { uploadImage, getPublicUrl } from '@/services/storage'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  bucket: string
  value: string
  onChange: (url: string) => void
  className?: string
}

export function ImageUpload({ bucket, value, onChange, className }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return
    setUploading(true)
    try {
      const ext = file.name.split('.').pop() || 'png'
      const filePath = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
      await uploadImage(bucket, filePath, file)
      const url = getPublicUrl(bucket, filePath)
      onChange(url)
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setUploading(false)
    }
  }, [bucket, onChange])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleUpload(file)
  }, [handleUpload])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
  }, [handleUpload])

  return (
    <div className={cn('relative', className)}>
      {value ? (
        <div className="relative group rounded-lg overflow-hidden border border-border">
          <img src={value} alt="Preview" className="w-full h-48 object-cover" />
          <button
            onClick={() => onChange('')}
            className="absolute top-2 right-2 w-7 h-7 bg-foreground/70 text-primary-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
            dragOver ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'
          )}
        >
          <Upload className="text-muted-foreground mb-2" size={24} />
          <p className="text-muted-foreground text-sm">
            {uploading ? '上传中...' : '点击或拖拽上传图片'}
          </p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}
