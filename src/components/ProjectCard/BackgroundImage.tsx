function BackgroundImage({ imageUrl }: { imageUrl: string }) {
  return (
    <div
      className="absolute inset-0 w-full h-full bg-center bg-no-repeat z-5"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover", 
        backgroundPosition: "center", 
      }}
    />
  );
}

export default BackgroundImage;
