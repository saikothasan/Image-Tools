"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Upload } from "lucide-react"
import Image from "next/image"

export default function FaviconGenerator() {
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState("")
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")
  const [textColor, setTextColor] = useState("#000000")
  const [generatedFavicons, setGeneratedFavicons] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleGenerate = async () => {
    if (!file && !text) {
      toast({
        title: "Error",
        description: "Please upload an image or enter text for the favicon.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    const formData = new FormData()
    if (file) formData.append("file", file)
    formData.append("text", text)
    formData.append("backgroundColor", backgroundColor)
    formData.append("textColor", textColor)

    try {
      const response = await fetch("/api/favicon-generator", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to generate favicons")

      const result = await response.json()
      setGeneratedFavicons([result.icoUrl, ...result.pngUrls])
      toast({
        title: "Success",
        description: "Favicons generated successfully!",
      })
    } catch (error) {
      console.error("Error generating favicons:", error)
      toast({
        title: "Error",
        description: "Failed to generate favicons. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">Favicon Generator</h1>
      <p className="text-xl text-muted-foreground mb-8">Generate favicons from an image or text.</p>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Favicon Settings</CardTitle>
            <CardDescription>Upload an image or enter text to generate favicons</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="file">Upload an image (optional)</Label>
              <Input id="file" type="file" onChange={handleFileChange} accept="image/*" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="text">Text (if no image is uploaded)</Label>
              <Textarea id="text" value={text} onChange={(e) => setText(e.target.value)} />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="backgroundColor">Background Color</Label>
              <Input
                id="backgroundColor"
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="textColor">Text Color</Label>
              <Input id="textColor" type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} />
            </div>
            <Button onClick={handleGenerate} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Generate Favicons
                </>
              )}
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Generated Favicons</CardTitle>
            <CardDescription>Preview of generated favicons</CardDescription>
          </CardHeader>
          <CardContent>
            {generatedFavicons.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {generatedFavicons.map((src, index) => (
                  <div key={index} className="border rounded-lg p-2 bg-muted">
                    <Image
                      src={src || "/placeholder.svg"}
                      alt={`Favicon ${index + 1}`}
                      width={64}
                      height={64}
                      className="max-w-full h-auto object-contain"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No generated favicons yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

