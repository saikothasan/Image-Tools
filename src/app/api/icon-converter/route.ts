export const runtime = "edge"
import { type NextRequest, Response } from "next/server"
import sharp from "sharp"
import { uploadToR2 } from "@/utils/r2"

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get("file") as File
  const sizes = JSON.parse(formData.get("sizes") as string) as number[]

  if (!file || !sizes.length) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  try {
    const iconBuffers = await Promise.all(
      sizes.map(async (size) => {
        return sharp(buffer).resize(size, size).png().toBuffer()
      }),
    )

    const icoBuffer = await sharp(buffer).resize(sizes[0], sizes[0]).png().toBuffer()

    const fileName = `icon-${Date.now()}.ico`
    await uploadToR2(fileName, icoBuffer, "image/x-icon")

    const pngFileNames = await Promise.all(
      iconBuffers.map(async (buffer, index) => {
        const pngFileName = `icon-${Date.now()}-${sizes[index]}.png`
        await uploadToR2(pngFileName, buffer, "image/png")
        return pngFileName
      }),
    )

    return new Response(JSON.stringify({ success: true, icoFileName: fileName, pngFileNames }))
  } catch (error) {
    console.error("Error converting to icon:", error)
    return new Response(JSON.stringify({ error: "Error processing image" }), { status: 500 })
  }
}

