import Image from "next/image";

const Header = () => {
  return (
    <div
      className="w-full h-[134px] flex-shrink-0"  // Kept the header height unchanged
      style={{
        background: "linear-gradient(90deg, #0F4214 13.5%, #26A834 100%)",
      }}
    >
      <div className="relative w-full h-full flex items-center justify-between px-4 lg:px-8">
        {/* Left Logo */}
        <div className="flex items-center">
          <a href="/">
            <Image
              unoptimized
              src="/img/zasti.png"
              alt="left logo"
              width={100}
              height={100}
              className="h-[50px] w-auto lg:h-[50px]"
            />
          </a>
        </div>

        {/* Center Logo */}
        <div className="flex justify-center flex-grow">
          <a href="/">
            <Image
              unoptimized
              src="/img/Logos (1).png"  // Path to your middle logo
              alt="middle logo"
              width={300}  // Increased width
              height={300} // Increased height
              className="h-[250px] w-auto lg:h-[250px] ml-16"  // Kept the header size unchanged, increased logo size and shifted right
            />
          </a>
        </div>

        {/* Right Logo */}
        <div className="flex items-center">
          <a href="/">
            <Image
              unoptimized
              src="/img/Logos.png"
              alt="right logo"
              width={350}  // Increased width
              height={350} // Increased height
              className="h-[200px] w-auto lg:h-[200px]" // Adjust height
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Header;
