import Image from "next/image";

const Header = () => {
  return (
    <div className="container h-[80px] px-4 lg:h-[80px] lg:px-0">
      <div className="flex h-full items-center justify-between">
        {/* Left Logo */}
        <div className="flex items-center justify-start">
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

        {/* Bot Name in the Center */}
        <div className="flex-grow text-center">
          <h1 className="text-2xl font-bold lg:text-3xl text-green">HempChat</h1>
        </div>

        {/* Right Logo */}
        <div className="flex items-center justify-end">
          <a href="/">
            <Image
              unoptimized
              src="/img/R.svg"
              alt="right logo"
              width={80}
              height={80}
              className="h-[50px] w-auto lg:h-[50px]"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Header;
