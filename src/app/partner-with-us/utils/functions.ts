
export const getImagePath = (imageFile: File): string | null => {
    if (!imageFile) {
      console.error("No image file provided.");
      return null;
    }
  
    // Validate that the input is an image
    if (!imageFile.type.startsWith("image/")) {
      console.error("The provided file is not an image.");
      return null;
    }
  
    // Create a local URL for the image
    return URL.createObjectURL(imageFile);
  };

