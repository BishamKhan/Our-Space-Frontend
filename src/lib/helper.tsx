
import { useEffect, useState } from "react"

// lib/uploadToCloudinary.ts
export const uploadToCloudinary = async (
  file: File,
  resourceType: "image" | "video" = "image"
) => {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", "our_space") // required
  formData.append("folder", "our_space") // optional

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/dw9dabcfw/${resourceType}/upload`,
    {
      method: "POST",
      body: formData,
    }
  )

  if (!res.ok) {
    throw new Error("Cloudinary upload failed")
  }

  const data = await res.json()

  return {
    url: data.secure_url, //✅ use this
    publicId: data.public_id,
    resourceType: data.resource_type,
  }
}



export function useDebounce<T>(value: T, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
