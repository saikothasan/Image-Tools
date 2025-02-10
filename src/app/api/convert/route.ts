export const runtime = "edge"
import { type NextRequest, Response } from "next/server"
import sharp from "sharp"
import { uploadToR2 } from "@/utils/r2"

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get("file") as File
  const format = formData.get("format") as string

  if (!file || !format) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  try {
    let convertedImageBuffer
    switch (format) {
      case "png":
        convertedImageBuffer = await sharp(buffer).png().toBuffer()
        break
      case "jpeg":
        convertedImageBuffer = await sharp(buffer).jpeg().toBuffer()
        break
      case "webp":
        convertedImageBuffer = await sharp(buffer).webp().toBuffer()
        break
      default:
        throw new Error("Unsupported format")
    }

    const fileName = `converted-${Date.now()}.${format}`
    await uploadToR2(fileName, convertedImageBuffer, `image/${format}`)

    return new Response(JSON.stringify({ success: true, fileName }))
  } catch (error) {
    console.error("Error converting image:", error)
    return new Response(JSON.stringify({ error: "Error processing image" }), { status: 500 })
  }
}

