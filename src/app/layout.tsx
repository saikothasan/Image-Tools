import "./globals.css"
import { Inter } from "next/font/google"
import Link from "next/link"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"
import { cn } from "@/lib/utils"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Image Tools",
  description: "Professional online image editing and conversion tools",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen bg-background font-sans antialiased")}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="relative flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-14 items-center">
                <div className="mr-4 hidden md:flex">
                  <Link href="/" className="mr-6 flex items-center space-x-2">
                    <span className="hidden font-bold sm:inline-block">Image Tools</span>
                  </Link>
                  <nav className="flex items-center space-x-6 text-sm font-medium">
                    <Link
                      href="/image-resizer"
                      className="transition-colors hover:text-foreground/80 text-foreground/60"
                    >
                      Resizer
                    </Link>
                    <Link
                      href="/bulk-resizer"
                      className="transition-colors hover:text-foreground/80 text-foreground/60"
                    >
                      Bulk Resizer
                    </Link>
                    <Link
                      href="/image-compressor"
                      className="transition-colors hover:text-foreground/80 text-foreground/60"
                    >
                      Compressor
                    </Link>
                    <Link
                      href="/image-converter"
                      className="transition-colors hover:text-foreground/80 text-foreground/60"
                    >
                      Converter
                    </Link>
                    <Link href="/icon-editor" className="transition-colors hover:text-foreground/80 text-foreground/60">
                      Icon Editor
                    </Link>
                    <Link
                      href="/icon-converter"
                      className="transition-colors hover:text-foreground/80 text-foreground/60"
                    >
                      Icon Converter
                    </Link>
                    <Link
                      href="/favicon-generator"
                      className="transition-colors hover:text-foreground/80 text-foreground/60"
                    >
                      Favicon Generator
                    </Link>
                  </nav>
                </div>
                <ModeToggle />
              </div>
            </header>
            <div className="flex-1">
              <main className="flex-1">{children}</main>
            </div>
            <footer className="py-6 md:px-8 md:py-0">
              <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                  Built by{" "}
                  <a href="#" target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4">
                    Image Tools
                  </a>
                  . The source code is available on{" "}
                  <a href="#" target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4">
                    GitHub
                  </a>
                  .
                </p>
              </div>
            </footer>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

