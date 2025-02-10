export const runtime = "edge"
import { type NextRequest, Response } from "next/server"
import sharp from "sharp"
import { uploadToR2, getR2 } from "@/utils/r2"
import { getCloudflareContext } from "@opennextjs/cloudflare"

export async function POST(req: NextRequest) {
  const { env } = getCloudflareContext()
  const formData = await req.formData()
  const file = formData.get("file") as File
  const width = Number.parseInt(formData.get("width") as string)
  const height = Number.parseInt(formData.get("height") as string)
  const resizeType = formData.get("resizeType") as string

  if (!file || !width || !height || !resizeType) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  try {
    let resizeOptions: sharp.ResizeOptions = { width, height }
    if (resizeType === "percentage") {
      const image = sharp(buffer)
      const metadata = await image.metadata()
      resizeOptions = {
        width: Math.round((metadata.width || 0) * (width / 100)),
        height: Math.round((metadata.height || 0) * (height / 100)),
      }
    } else if (resizeType === "ratio") {
      resizeOptions = { width, height, fit: "contain" }
    }

    const resizedImageBuffer = await sharp(buffer).resize(resizeOptions).toBuffer()

    const fileName = `resized-${Date.now()}.webp`
    await uploadToR2(fileName, resizedImageBuffer, "image/webp")

    // Generate a signed URL for the resized image
    const bucket = await getR2()
    const signedUrl = await bucket.createSignedUrl(fileName, {
      expiresIn: 3600, // URL expires in 1 hour
    })

    return new Response(JSON.stringify({ success: true, fileName, signedUrl }))
  } catch (error) {
    console.error("Error resizing image:", error)
    return new Response(JSON.stringify({ error: "Error processing image" }), { status: 500 })
  }
}

