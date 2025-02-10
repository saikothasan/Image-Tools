export const runtime = "edge"
import { type NextRequest, Response } from "next/server"
import sharp from "sharp"
import { uploadToR2, getR2 } from "@/utils/r2"
import { getCloudflareContext } from "@opennextjs/cloudflare"

export async function POST(req: NextRequest) {
  const { env } = getCloudflareContext()
  const formData = await req.formData()
  const files = formData.getAll("files") as File[]
  const width = Number.parseInt(formData.get("width") as string)
  const height = Number.parseInt(formData.get("height") as string)

  if (!files.length || !width || !height) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 })
  }

  try {
    const results = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer())
        const resizedImageBuffer = await sharp(buffer).resize({ width, height, fit: "contain" }).webp().toBuffer()

        const fileName = `bulk-resized-${Date.now()}-${file.name}.webp`
        await uploadToR2(fileName, resizedImageBuffer, "image/webp")

        // Generate a signed URL for the resized image
        const bucket = await getR2()
        const signedUrl = await bucket.createSignedUrl(fileName, {
          expiresIn: 3600, // URL expires in 1 hour
        })

        return { originalName: file.name, resizedName: fileName, signedUrl }
      }),
    )

    return new Response(JSON.stringify({ success: true, results }))
  } catch (error) {
    console.error("Error bulk resizing images:", error)
    return new Response(JSON.stringify({ error: "Error processing images" }), { status: 500 })
  }
}

