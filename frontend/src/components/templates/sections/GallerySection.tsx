export function GallerySection({ images }: { images: string[] }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {images.map((src, idx) => (
        <img key={idx} src={src} alt={`Gallery ${idx + 1}`} className="aspect-square w-full rounded object-cover" />
      ))}
    </div>
  );
}
