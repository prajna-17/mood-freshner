import { generateReactHelpers } from "@uploadthing/react";

export const { useUploadThing } = generateReactHelpers({
  url: "https://lebah-backend.onrender.com/api/uploadthing",
});
