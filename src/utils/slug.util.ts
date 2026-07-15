import slugifyLib from "slugify";

export const generateSlug = (text: string): string => {
  return slugifyLib(text, {
    lower: true,
    strict: true,
    trim: true,
  });
};

export const generateUniqueSlug = (baseSlug: string, suffix: string): string => {
  return `${baseSlug}-${suffix}`;
};
