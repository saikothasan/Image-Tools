export const runtime = "edge"
import { type NextRequest, Response } from "next/server"
import sharp from "sharp"
import { uploadToR2 } from "@/utils/r2"

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get("file") as File
  const size = Number.parseInt(formData.get("size") as string)
  const backgroundColor = formData.get("backgroundColor") as string

  if (!file || !size || !backgroundColor) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  try {
    const iconBuffer = await sharp(buffer)
      .resize(size, size)
      .extend({
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        background: backgroundColor,
      })
      .png()
      .toBuffer()

    const fileName = `icon-${Date.now()}.png`
    await uploadToR2(fileName, iconBuffer, "image/png")

    return new Response(JSON.stringify({ success: true, fileName }))
  } catch (error) {
    console.error("Error creating icon:", error)
    return new Response(JSON.stringify({ error: "Error processing image" }), { status: 500 })
  }
}

