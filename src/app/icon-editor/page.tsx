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

export default function IconEditor() {
  const [file, setFile] = useState<File | null>(null)
  const [size, setSize] = useState("32")
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")
  const [editedIcon, setEditedIcon] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleEditIcon = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select an image to edit.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("size", size)
    formData.append("backgroundColor", backgroundColor)

    try {
      const response = await fetch("/api/icon-editor", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to edit icon")

      const result = await response.json()
      setEditedIcon(result.signedUrl)
      toast({
        title: "Success",
        description: "Icon edited successfully!",
      })
    } catch (error) {
      console.error("Error editing icon:", error)
      toast({
        title: "Error",
        description: "Failed to edit icon. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">Icon Editor</h1>
      <p className="text-xl text-muted-foreground mb-8">Edit and create custom icons.</p>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Icon Settings</CardTitle>
            <CardDescription>Upload an image and customize your icon</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="file">Select an image</Label>
              <Input id="file" type="file" onChange={handleFileChange} accept="image/*" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="size">Icon Size</Label>
              <Select onValueChange={setSize} value={size}>
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="16">16x16</SelectItem>
                  <SelectItem value="32">32x32</SelectItem>
                  <SelectItem value="48">48x48</SelectItem>
                  <SelectItem value="64">64x64</SelectItem>
                  <SelectItem value="128">128x128</SelectItem>
                </SelectContent>
              </Select>
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
            <Button onClick={handleEditIcon} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Editing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Edit Icon
                </>
              )}
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>Original and edited icon preview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {file && (
              <div className="border rounded-lg p-4 bg-muted">
                <p className="text-sm text-muted-foreground mb-2">Original Image</p>
                <Image
                  src={URL.createObjectURL(file) || "/placeholder.svg"}
                  alt="Original"
                  width={128}
                  height={128}
                  className="max-w-full h-auto object-contain"
                />
              </div>
            )}
            {editedIcon && (
              <div className="border rounded-lg p-4 bg-muted">
                <p className="text-sm text-muted-foreground mb-2">Edited Icon</p>
                <Image
                  src={editedIcon || "/placeholder.svg"}
                  alt="Edited Icon"
                  width={128}
                  height={128}
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

