import { create } from "@arnosaine/is";
import { isPreview } from "./is";

const useValues = () => ({
  preview: isPreview,
});

const [IsPreview, useIsPreview] = create(useValues, {
  preview: true,
});

export { IsPreview, useIsPreview };
