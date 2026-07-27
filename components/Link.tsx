import NextLink, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";

type MyLinkProps = LinkProps & {
  children: ReactNode;
};

const Link = ({ children, ...props }: MyLinkProps) => {
  const router = useRouter();
  const locale = props.locale || "";
  const href = props.href || router.asPath;

  const withScheme = href.toString().indexOf(":") >= 0;
  if (locale && !withScheme) {
    props.href = href
      ? `/${locale}${href}`
      : router.pathname.replace("[locale]", locale);
  }

  return (
    <>
      <NextLink {...props}>
        {children}
      </NextLink>
    </>
  );
};

export default Link;
