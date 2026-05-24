import { generateReactHelpers } from "@uploadthing/react";
import { API } from "@/utils/api";

export const { useUploadThing } = generateReactHelpers({
  url: `${API}/uploadthing`,
});
