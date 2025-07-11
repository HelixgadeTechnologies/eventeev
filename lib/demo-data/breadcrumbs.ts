const username = "GDG Port Harcourt";

export const breadcrumbMap = [
  {
    pattern: "/user/events",
    title: `Welcome ${username}`,
    subtitle: "Control your profile setup and integrations",
    exact: true,
  },
  {
    pattern: "/user/events/:id/dashboard",
    title: (eventName: string) => `Welcome ${eventName}`,
    subtitle: "It’s a sunny day today, we hope you’re preparing for the big day! 😊",
  },
  {
    pattern: "/user/events/:id/tickets",
    title: "My Tickets",
    subtitle: "Choose a ticket type or multiple types.",
  },
  {
    pattern: "/user/events/:id/attendees",
    title: "Attendees",
    subtitle: "Showing data over the last 30 days",
  },
  {
    pattern: "/settings",
    title: "Settings",
    subtitle: "Take a look at your policies and the new policy to see what is covered",
  },
];

