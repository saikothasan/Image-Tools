# Image Tools

A comprehensive suite of professional online image editing and conversion tools built with Next.js 14, Cloudflare R2, and Sharp.js.

![Image Tools Preview](https://sjc.microlink.io/qH6iP1zvYIMUzZTf9K05SnzN_Xt6N4q6jhKagjyke8FhRUTXemP4SGuqYcswrwNtKM5adGU3abJE09fY5J36Mw.jpeg)

## Features

- **Image Resizer**: Resize images by pixels, percentage, or aspect ratio
- **Bulk Image Resizer**: Process multiple images simultaneously
- **Image Compressor**: Reduce file size while maintaining quality
- **Image Converter**: Convert between PNG, JPEG, and WebP formats
- **Icon Editor**: Create and customize icons with various backgrounds
- **Icon Converter**: Generate icons in multiple sizes
- **Favicon Generator**: Create favicons from images or text

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Storage**: Cloudflare R2
- **Image Processing**: Sharp.js
- **API**: Edge Runtime API Routes
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- Cloudflare R2 account and credentials
- npm or yarn package manager

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_ACCESS_KEY_ID=your_access_key
CLOUDFLARE_SECRET_ACCESS_KEY=your_secret_key
CLOUDFLARE_BUCKET_NAME=your_bucket_name
```

### Installation

1. Clone the repository:


```shellscript
git clone https://github.com/saikothasan/Image-Tools.git
cd Image-Tools
```

2. Install dependencies:


```shellscript
npm install
# or
yarn install
```

3. Run the development server:


```shellscript
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.


## Usage

### Image Resizer

1. Upload an image
2. Choose resize type (pixels, percentage, or ratio)
3. Set dimensions
4. Click "Resize Image"


### Bulk Image Resizer

1. Select multiple images
2. Set target dimensions
3. Click "Resize Images"


### Image Compressor

1. Upload an image
2. Adjust quality settings
3. Click "Compress Image"


### Image Converter

1. Upload an image
2. Select target format
3. Click "Convert Image"


### Icon Editor

1. Upload an image
2. Choose size and background color
3. Click "Edit Icon"


### Icon Converter

1. Upload an image
2. Select desired icon sizes
3. Click "Convert to Icon"


### Favicon Generator

1. Upload an image or enter text
2. Set colors and options
3. Click "Generate Favicons"


## API Routes

All API routes are implemented using the Edge Runtime for improved performance:

- `/api/resize` - Image resizing endpoint
- `/api/bulk-resize` - Bulk image processing
- `/api/compress` - Image compression
- `/api/convert` - Format conversion
- `/api/icon-editor` - Icon editing
- `/api/icon-converter` - Icon conversion
- `/api/favicon-generator` - Favicon generation


## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Sharp.js](https://sharp.pixelplumbing.com/)
- [Cloudflare R2](https://www.cloudflare.com/products/r2/)


## Support

For support, please open an issue in the repository or contact the maintainers.
