"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Upload } from "lucide-react"
import Image from "next/image"

export default function IconConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [sizes, setSizes] = useState<number[]>([16, 32, 48])
  const [convertedIcons, setConvertedIcons] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleSizeChange = (size: number) => {
    setSizes((prevSizes) => (prevSizes.includes(size) ? prevSizes.filter((s) => s !== size) : [...prevSizes, size]))
  }

  const handleConvert = async () => {
    if (!file || sizes.length === 0) {
      toast({
        title: "Error",
        description: "Please select an image and at least one size.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("sizes", JSON.stringify(sizes))

    try {
      const response = await fetch("/api/icon-converter", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to convert icon")

      const result = await response.json()
      setConvertedIcons([result.icoUrl, ...result.pngUrls])
      toast({
        title: "Success",
        description: "Icon converted successfully!",
      })
    } catch (error) {
      console.error("Error converting icon:", error)
      toast({
        title: "Error",
        description: "Failed to convert icon. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">Icon Converter</h1>
      <p className="text-xl text-muted-foreground mb-8">Convert images to icons in various sizes.</p>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Conversion Settings</CardTitle>
            <CardDescription>Upload an image and select desired icon sizes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="file">Select an image</Label>
              <Input id="file" type="file" onChange={handleFileChange} accept="image/*" />
            </div>
            <div>
              <Label>Icon Sizes</Label>
              <div className="flex flex-wrap gap-4 mt-2">
                {[16, 32, 48, 64, 128, 256].map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <Checkbox
                      id={`size-${size}`}
                      checked={sizes.includes(size)}
                      onCheckedChange={() => handleSizeChange(size)}
                    />
                    <Label htmlFor={`size-${size}`}>
                      {size}x{size}
                    </Label>
                  </div>
                ))}
              </div>
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
                  Convert to Icon
                </>
              )}
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Converted Icons</CardTitle>
            <CardDescription>Preview of converted icons</CardDescription>
          </CardHeader>
          <CardContent>
            {convertedIcons.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {convertedIcons.map((src, index) => (
                  <div key={index} className="border rounded-lg p-2 bg-muted">
                    <Image
                      src={src || "/placeholder.svg"}
                      alt={`Converted Icon ${index + 1}`}
                      width={64}
                      height={64}
                      className="max-w-full h-auto object-contain"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No converted icons yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

