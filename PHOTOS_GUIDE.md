# How to Add Your Own Photos

To replace the placeholder images with your own photos, follow these steps:

### 1. The Puzzle Image
- **File Location**: `public/images/puzzle.jpg`
- **Recommended Size**: Square (e.g., 800x800px)
- **What to do**: Replace the file at that path. The code is already set up to look for it.

### 2. The Photo Gallery
- **File Location**: `public/images/gallery/photo1.jpg`, `photo2.jpg`, ..., `photo10.jpg`
- **What to do**: Place up to 10 images in the `public/images/gallery/` folder named exactly as above.

---

## Code Reference for Developers
If you want to change where the code looks for images, here are the files to edit:

- **Puzzle**: `src/components/games/SlidingPuzzle.tsx`
  - Change the `backgroundImage: 'url(...)'` lines (around lines 112 and 123).
- **Gallery**: `src/components/gallery/PhotoGallery.tsx`
  - Change the `<img src={...} />` line (around line 30).
- **Trivia (Secret Button)**: `src/components/arcade/TriviaShowdown.tsx`
  - The hidden button is in the top-left corner of the trivia section.
