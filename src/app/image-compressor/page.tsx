"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Upload } from "lucide-react"
import Image from "next/image"

export default function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null)
  const [quality, setQuality] = useState(80)
  const [compressedImage, setCompressedImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleCompress = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select an image to compress.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("quality", quality.toString())

    try {
      const response = await fetch("/api/compress", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to compress image")

      const result = await response.json()
      setCompressedImage(result.signedUrl)
      toast({
        title: "Success",
        description: "Image compressed successfully!",
      })
    } catch (error) {
      console.error("Error compressing image:", error)
      toast({
        title: "Error",
        description: "Failed to compress image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">Image Compressor</h1>
      <p className="text-xl text-muted-foreground mb-8">Compress your images to reduce file size.</p>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Compression Settings</CardTitle>
            <CardDescription>Upload an image and set the compression quality</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="file">Select an image</Label>
              <Input id="file" type="file" onChange={handleFileChange} accept="image/*" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="quality">Quality: {quality}%</Label>
              <Slider
                id="quality"
                min={1}
                max={100}
                step={1}
                value={[quality]}
                onValueChange={(value) => setQuality(value[0])}
              />
            </div>
            <Button onClick={handleCompress} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Compressing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Compress Image
                </>
              )}
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>Original and compressed image preview</CardDescription>
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
            {compressedImage && (
              <div className="border rounded-lg p-4 bg-muted">
                <p className="text-sm text-muted-foreground mb-2">Compressed Image</p>
                <Image
                  src={compressedImage || "/placeholder.svg"}
                  alt="Compressed"
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

