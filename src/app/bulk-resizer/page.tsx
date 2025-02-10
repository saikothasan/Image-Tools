"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Upload } from "lucide-react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

export default function BulkResizer() {
  const [files, setFiles] = useState<FileList | null>(null)
  const [width, setWidth] = useState<number>(800)
  const [height, setHeight] = useState<number>(600)
  const [resizedImages, setResizedImages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files)
    }
  }

  const handleBulkResize = async () => {
    if (!files || files.length === 0 || !width || !height) {
      toast({
        title: "Error",
        description: "Please select images and specify dimensions.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i])
    }
    formData.append("width", width.toString())
    formData.append("height", height.toString())

    try {
      const response = await fetch("/api/bulk-resize", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to resize images")

      const result = await response.json()
      setResizedImages(result.results.map((r: any) => r.signedUrl))
      toast({
        title: "Success",
        description: `${result.results.length} images resized successfully!`,
      })
    } catch (error) {
      console.error("Error resizing images:", error)
      toast({
        title: "Error",
        description: "Failed to resize images. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">Bulk Image Resizer</h1>
      <p className="text-xl text-muted-foreground mb-8">Resize multiple images at once.</p>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Resize Settings</CardTitle>
            <CardDescription>Upload multiple images and set your desired dimensions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="files">Select images</Label>
              <Input id="files" type="file" onChange={handleFileChange} accept="image/*" multiple />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="width">Width (px)</Label>
              <div className="flex items-center space-x-2">
                <Slider
                  id="width"
                  min={1}
                  max={10000}
                  step={1}
                  value={[width]}
                  onValueChange={(value) => setWidth(value[0])}
                />
                <Input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-20"
                />
              </div>
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="height">Height (px)</Label>
              <div className="flex items-center space-x-2">
                <Slider
                  id="height"
                  min={1}
                  max={10000}
                  step={1}
                  value={[height]}
                  onValueChange={(value) => setHeight(value[0])}
                />
                <Input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-20"
                />
              </div>
            </div>
            <Button onClick={handleBulkResize} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resizing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Resize Images
                </>
              )}
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Resized Images</CardTitle>
            <CardDescription>Preview of resized images</CardDescription>
          </CardHeader>
          <CardContent>
            {resizedImages.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {resizedImages.map((src, index) => (
                  <div key={index} className="border rounded-lg p-2 bg-muted">
                    <Image
                      src={src || "/placeholder.svg"}
                      alt={`Resized ${index + 1}`}
                      width={150}
                      height={150}
                      className="max-w-full h-auto object-contain"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No resized images yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

