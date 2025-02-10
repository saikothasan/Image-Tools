"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Upload } from "lucide-react"
import Image from "next/image"

export default function ImageResizer() {
  const [file, setFile] = useState<File | null>(null)
  const [width, setWidth] = useState<number>(0)
  const [height, setHeight] = useState<number>(0)
  const [resizeType, setResizeType] = useState("pixels")
  const [resizedImage, setResizedImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [aspectRatio, setAspectRatio] = useState<number | null>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)

      // Reset dimensions and load image to get original size
      const img = new Image()
      img.onload = () => {
        setWidth(img.width)
        setHeight(img.height)
        setAspectRatio(img.width / img.height)
      }
      img.src = URL.createObjectURL(selectedFile)
    }
  }

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth)
    if (aspectRatio && resizeType === "ratio") {
      setHeight(Math.round(newWidth / aspectRatio))
    }
  }

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight)
    if (aspectRatio && resizeType === "ratio") {
      setWidth(Math.round(newHeight * aspectRatio))
    }
  }

  const handleResize = async () => {
    if (!file || !width || !height) {
      toast({
        title: "Error",
        description: "Please select an image and specify dimensions.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("width", width.toString())
    formData.append("height", height.toString())
    formData.append("resizeType", resizeType)

    try {
      const response = await fetch("/api/resize", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to resize image")

      const result = await response.json()
      setResizedImage(result.signedUrl)
      toast({
        title: "Success",
        description: "Image resized successfully!",
      })
    } catch (error) {
      console.error("Error resizing image:", error)
      toast({
        title: "Error",
        description: "Failed to resize image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">Image Resizer</h1>
      <p className="text-xl text-muted-foreground mb-8">Resize an image in pixels, percentage, or ratio online.</p>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Resize Settings</CardTitle>
            <CardDescription>Upload an image and set your desired dimensions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="file">Image</Label>
              <Input id="file" type="file" onChange={handleFileChange} accept="image/*" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="resizeType">Resize Type</Label>
              <Select onValueChange={setResizeType} value={resizeType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select resize type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pixels">Pixels</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="ratio">Ratio (maintain aspect ratio)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="width">Width ({resizeType === "percentage" ? "%" : "px"})</Label>
              <div className="flex items-center space-x-2">
                <Slider
                  id="width"
                  min={1}
                  max={resizeType === "percentage" ? 200 : 10000}
                  step={1}
                  value={[width]}
                  onValueChange={(value) => handleWidthChange(value[0])}
                />
                <Input
                  type="number"
                  value={width}
                  onChange={(e) => handleWidthChange(Number(e.target.value))}
                  className="w-20"
                />
              </div>
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="height">Height ({resizeType === "percentage" ? "%" : "px"})</Label>
              <div className="flex items-center space-x-2">
                <Slider
                  id="height"
                  min={1}
                  max={resizeType === "percentage" ? 200 : 10000}
                  step={1}
                  value={[height]}
                  onValueChange={(value) => handleHeightChange(value[0])}
                />
                <Input
                  type="number"
                  value={height}
                  onChange={(e) => handleHeightChange(Number(e.target.value))}
                  className="w-20"
                />
              </div>
            </div>
            <Button onClick={handleResize} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resizing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Resize Image
                </>
              )}
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>Original and resized image preview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {file && (
              <div className="border rounded-lg p-4 bg-muted">
                <p className="text-sm text-muted-foreground mb-2">Original Image</p>
                <Image
                  src={URL.createObjectURL(file) || "/placeholder.svg"}
                  alt="Original"
                  width={300}
                  height={300}
                  className="max-w-full h-auto object-contain"
                />
              </div>
            )}
            {resizedImage && (
              <div className="border rounded-lg p-4 bg-muted">
                <p className="text-sm text-muted-foreground mb-2">Resized Image</p>
                <Image
                  src={resizedImage || "/placeholder.svg"}
                  alt="Resized"
                  width={300}
                  height={300}
                  className="max-w-full h-auto object-contain"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

