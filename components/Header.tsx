import Image from "next/image";

const Header = () => {
  return (
    <div
      className="w-full h-[134px] flex-shrink-0"
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
              src="/img/zasti.svg"
              alt="left logo"
              width={100}
              height={100}
              className="h-[50px] w-auto lg:h-[50px]"
            />
          </a>
        </div>

        {/* Title with PNG Clipart */}
        <div className="flex items-center text-center">
          {/* Clipart Image */}
          <Image
            unoptimized
            src="/img/clipart.png"  // Path to your PNG clipart
            alt="clipart"
            width={40}  // Adjust width as needed
            height={40} // Adjust height as needed
            className="h-[30px] w-auto lg:h-[30px] mr-2"  // Margin for spacing between the clipart and text
          />
          {/* Bot Name */}
          <h1 className="text-2xl font-bold lg:text-3xl text-white">Hemp Copilot</h1>
        </div>

        {/* Right Logo */}
        <div className="flex items-center">
          <a href="/">
            <Image
              unoptimized
              src="/img/indhemp.png"
              alt="right logo"
              width={120}  // Increased width for a bigger size
              height={120} // Increased height for a bigger size
              className="h-[70px] w-auto lg:h-[70px]" // Adjust height as needed
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Header;
