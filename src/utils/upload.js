import { generateReactHelpers } from "@uploadthing/react";

export const { useUploadThing } = generateReactHelpers({
  url: "http://localhost:5000/api/uploadthing",
});
