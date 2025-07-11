// for getting the breadcrumb to display on every route with some hardcoded values or default values

import { breadcrumbMap } from "../demo-data/breadcrumbs";

export function matchBreadcrumb(pathname: string) {
  for (const item of breadcrumbMap) {
    const regex = new RegExp(
      "^" +
        item.pattern
          .replace(/:id/g, "[^/]+") // match any id
          .replace(/\//g, "\\/") + // escape slashes
        (item.exact ? "$" : ".*")
    );

    if (regex.test(pathname)) {
    //   const title =
    //     typeof item.title === "function" ? item.title(eventName ?? "Event") : item.title;
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
