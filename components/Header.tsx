import { WazukaRailColorIcon } from "./icons";
import Link from "./Link";

const Header = () => {
  const navs = (
    <>
      <Link href="/">
        <button className="hover:text-secondary">ホーム</button>
      </Link>
      <Link href="/generator">
        <button className="hover:text-secondary">生成器</button>
      </Link>
      <Link href="/dlfonts">
        <button className="hover:text-secondary">フォント</button>
      </Link>
    </>
  );

  return (
    <header className="bg-white shadow">
      <div className="mx-auto max-w-(--breakpoint-2xl) flex flex-col px-4 md:px-8">
        <div className="flex items-center justify-between">
          <Link href="/">
            <button className="text-2xl font-normal">
              <WazukaRailColorIcon className="w-12 h-12" />
              <span>きっぷ</span>
            </button>
          </Link>
          <nav className="gap-6 hidden md:flex">
            {navs}
          </nav>
          <div className="hidden sm:block"></div>
        </div>
        <nav className="gap-6 flex md:hidden">
          {navs}
        </nav>
      </div>
    </header>
  );
};

export default Header;
