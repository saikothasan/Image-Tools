export const runtime = "edge"
import { type NextRequest, Response } from "next/server"
import sharp from "sharp"
import { uploadToR2 } from "@/utils/r2"

const FAVICON_SIZES = [16, 32, 48, 64, 128, 256]

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get("file") as File
  const text = formData.get("text") as string
  const backgroundColor = formData.get("backgroundColor") as string
  const textColor = formData.get("textColor") as string

  if (!file && !text) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 })
  }

  try {
    let baseImage
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer())
      baseImage = sharp(buffer)
    } else {
      baseImage = sharp({
        create: {
          width: 256,
          height: 256,
          channels: 4,
          background: backgroundColor,
        },
      })

      if (text) {
        baseImage = baseImage.composite([
          {
            input: Buffer.from(
              `<svg><text x="50%" y="50%" font-family="Arial" font-size="128" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${text}</text></svg>`,
            ),
            top: 0,
            left: 0,
          },
        ])
      }
    }

    const faviconBuffers = await Promise.all(
      FAVICON_SIZES.map(async (size) => {
        return baseImage.clone().resize(size, size).png().toBuffer()
      }),
    )

    const icoBuffer = await baseImage.resize(32, 32).png().toBuffer()

    const icoFileName = `favicon-${Date.now()}.ico`
    await uploadToR2(icoFileName, icoBuffer, "image/x-icon")

    const pngFileNames = await Promise.all(
      faviconBuffers.map(async (buffer, index) => {
        const pngFileName = `favicon-${Date.now()}-${FAVICON_SIZES[index]}.png`
        await uploadToR2(pngFileName, buffer, "image/png")
        return pngFileName
      }),
    )

    return new Response(JSON.stringify({ success: true, icoFileName, pngFileNames }))
  } catch (error) {
    console.error("Error generating favicon:", error)
    return new Response(JSON.stringify({ error: "Error processing image" }), { status: 500 })
  }
}

