export const runtime = "edge"
import { type NextRequest, Response } from "next/server"
import sharp from "sharp"
import { uploadToR2 } from "@/utils/r2"

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get("file") as File
  const quality = Number.parseInt(formData.get("quality") as string)

  if (!file || !quality) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  try {
    const compressedImageBuffer = await sharp(buffer).webp({ quality }).toBuffer()

    const fileName = `compressed-${Date.now()}.webp`
    await uploadToR2(fileName, compressedImageBuffer, "image/webp")

    return new Response(JSON.stringify({ success: true, fileName }))
  } catch (error) {
    console.error("Error compressing image:", error)
    return new Response(JSON.stringify({ error: "Error processing image" }), { status: 500 })
  }
}

