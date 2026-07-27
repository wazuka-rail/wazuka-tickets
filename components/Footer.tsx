import { GitHubMarkWhiteIcon, WazukaRailIcon } from "./icons";
import Link from "./Link";

const Footer = () => {
  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4">
        <div className="flex justify-between pt-4">
          <div>
            <div className="mb-2">
              <Link href="/">
                <button className="inline-flex items-center gap-2 text-lg">
                  <WazukaRailIcon className="w-8 h-8" />
                  <span>わづか茶源郷鉄道</span>
                </button>
              </Link>
            </div>
            <p className="text-xs mb-4 opacity-80">
              This railway is fictional. Any resemblance to actual organizations
              is coincidental.
            </p>
          </div>
          <div className="grid content-center">
            <Link href="https://github.com/wazuka-rail/wazuka-tickets">
              <button>
                <GitHubMarkWhiteIcon
                  className="w-6 h-6 mx-0.5 my-0.5 opacity-80 hover:opacity-100"
                  title="GitHub"
                />
              </button>
            </Link>
          </div>
        </div>
        <div className="border-t border-white py-4 text-center text-sm">
          <span className="inline-block mx-1">
            Copyright© 2026 わづか茶源郷鉄道
          </span>
          <span className="inline-block mx-1">All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
