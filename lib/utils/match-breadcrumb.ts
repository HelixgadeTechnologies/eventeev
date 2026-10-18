// for getting the breadcrumb to display on every route with some hardcoded values or default values

import { breadcrumbMap } from "../demo-data/breadcrumbs";

export function matchBreadcrumb(pathname: string) {
  // Strip locale prefix (e.g. /en, /fr) if present
  const cleanPath = pathname.replace(/^\/[a-zA-Z]{2,3}(?=\/|$)/, "") || "/";

  for (const item of breadcrumbMap) {
    const regex = new RegExp(
      "^" +
        item.pattern
          .replace(/:id/g, "[^/]+") // match any id
          .replace(/\//g, "\\/") + // escape slashes
        (item.exact ? "$" : ".*")
    );

    if (regex.test(cleanPath)) {
      const title = item.title;
      return {
        title,
        subtitle: item.subtitle,
        href: item.pattern
      };
    }
  }

  return null;
}
