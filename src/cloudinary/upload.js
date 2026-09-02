import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES } from '../utils/constants'

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export const isCloudinaryConfigured = Boolean(cloudName && uploadPreset)

export function validateImageFile(file) {
  if (!file) return 'Choose an image file.'
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return 'Use a JPEG, PNG, WebP, or GIF image.'
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return 'Images must be 5 MB or smaller.'
  }
  return null
}

export async function uploadImage(file, folder) {
  if (!isCloudinaryConfigured) {
    throw new Error(
      'Cloudinary is not configured. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to .env.',
    )
  }

  const invalid = validateImageFile(file)
  if (invalid) throw new Error(invalid)

  const body = new FormData()
  body.append('file', file)
  body.append('upload_preset', uploadPreset)
  if (folder) body.append('folder', folder)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body },
  )

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(
      payload.error?.message || 'Cloudinary rejected the upload. Check the unsigned preset and folder settings.',
    )
  }

  if (!payload.secure_url) {
    throw new Error('Cloudinary did not return an image URL.')
  }

  return payload.secure_url
}
