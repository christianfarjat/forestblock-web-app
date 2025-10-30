const ProfileHeader: React.FC = () => (
  <div className="relative h-40 md:h-72 bg-gradient-to-r from-green-100 to-green-200 overflow-hidden rounded-t-2xl">
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/banner.png')",
      }}
    />
  </div>
);

export default ProfileHeader;
