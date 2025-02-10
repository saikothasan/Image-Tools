"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Upload } from "lucide-react"
import Image from "next/image"

export default function ImageConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [format, setFormat] = useState("png")
  const [convertedImage, setConvertedImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleConvert = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select an image to convert.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("format", format)

    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to convert image")

      const result = await response.json()
      setConvertedImage(result.signedUrl)
      toast({
        title: "Success",
        description: "Image converted successfully!",
      })
    } catch (error) {
      console.error("Error converting image:", error)
      toast({
        title: "Error",
        description: "Failed to convert image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">Image Converter</h1>
      <p className="text-xl text-muted-foreground mb-8">Convert your images to different formats.</p>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Conversion Settings</CardTitle>
            <CardDescription>Upload an image and select the desired format</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="file">Select an image</Label>
              <Input id="file" type="file" onChange={handleFileChange} accept="image/*" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="format">Convert to</Label>
              <Select onValueChange={setFormat} value={format}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="jpeg">JPEG</SelectItem>
                  <SelectItem value="webp">WebP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleConvert} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Convert Image
                </>
              )}
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>Original and converted image preview</CardDescription>
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
            {convertedImage && (
              <div className="border rounded-lg p-4 bg-muted">
                <p className="text-sm text-muted-foreground mb-2">Converted Image</p>
                <Image
                  src={convertedImage || "/placeholder.svg"}
                  alt="Converted"
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

