"use client";

import NextLink from "next/link";
import {
  useRouter as useNextRouter,
  usePathname,
  useSearchParams,
  useParams as useNextParams,
} from "next/navigation";
import React, { useEffect } from "react";

export { useSearchParams, usePathname };

export interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  to?: string;
  href?: string;
  children?: React.ReactNode;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ to, href, children, ...props }, ref) => {
    const target = to || href || "#";
    return (
      <NextLink ref={ref} href={target} {...(props as any)}>
        {children}
      </NextLink>
    );
  }
);
Link.displayName = "Link";

export interface NavLinkProps extends LinkProps {
  activeClassName?: string;
}

export const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ to, href, className, activeClassName = "active", ...props }, ref) => {
    const target = to || href || "#";
    const pathname = usePathname();
    const isActive =
      pathname === target || (target !== "/" && pathname?.startsWith(target));

    const combinedClassName = `${className || ""} ${isActive ? activeClassName : ""}`.trim();

    return (
      <NextLink
        ref={ref}
        href={target}
        className={combinedClassName}
        {...(props as any)}
      />
    );
  }
);
NavLink.displayName = "NavLink";

export function useNavigate() {
  const router = useNextRouter();
  return (to: string | number, options?: { replace?: boolean }) => {
    if (typeof to === "number") {
      if (to === -1) router.back();
      return;
    }
    if (options?.replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  };
}

export function useLocation() {
  const pathname = usePathname();
  let search = "";
  if (typeof window !== "undefined") {
    search = window.location.search;
  }
  return {
    pathname: pathname || "/",
    search,
  };
}

export function useParams<T extends Record<string, string | string[]>>() {
  const params = useNextParams();
  return (params || {}) as T;
}

export function Navigate({ to, replace = true }: { to: string; replace?: boolean }) {
  const router = useNextRouter();
  useEffect(() => {
    if (replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  }, [router, to, replace]);
  return null;
}
