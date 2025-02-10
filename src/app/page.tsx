import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowRight,
  Image,
  Images,
  FileArchiveIcon as Compress,
  Repeat,
  Pencil,
  FileImage,
  FingerprintIcon as Favicon,
} from "lucide-react"

export default function Home() {
  const tools = [
    {
      name: "Image Resizer",
      description: "Resize an image in pixels, percentage, or ratio online.",
      href: "/image-resizer",
      icon: Image,
    },
    {
      name: "Bulk Image Resizer",
      description: "Resize, convert, or compress multiple images quickly.",
      href: "/bulk-resizer",
      icon: Images,
    },
    {
      name: "Image Compressor",
      description: "Compress the file size of a PNG, JPEG, WEBP, or HEIC image online.",
      href: "/image-compressor",
      icon: Compress,
    },
    {
      name: "Image Converter",
      description: "Convert an image to various formats online.",
      href: "/image-converter",
      icon: Repeat,
    },
    {
      name: "Icon Editor",
      description: "View and edit Windows icons (ICO files) directly from the browser.",
      href: "/icon-editor",
      icon: Pencil,
    },
    {
      name: "Icon Converter",
      description: "Convert images to the ICO format.",
      href: "/icon-converter",
      icon: FileImage,
    },
    {
      name: "Favicon Generator",
      description: "Generate favicon images in all required sizes.",
      href: "/favicon-generator",
      icon: Favicon,
    },
  ]

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">Image Tools</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Welcome to our suite of professional online image editing and conversion tools.
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Card key={tool.name} className="group hover:shadow-lg transition-shadow">
            <Link href={tool.href}>
              <CardHeader>
                <tool.icon className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>{tool.name}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="inline-flex items-center text-primary group-hover:underline">
                  Use Tool
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}

