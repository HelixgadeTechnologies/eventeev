const username = "Richard";

export const breadcrumbMap = [
  {
    pattern: "/events",
    title: `Welcome ${username}`,
    subtitle: "Control your profile setup and integrations",
    exact: true,
  },
  {
    pattern: "/events/:id/dashboard",
    title: `Welcome ${username}`,
    subtitle: "It’s a sunny day today, we hope you’re preparing for the big day! 😊",
  },
  {
    pattern: "/events/:id/tickets",
    title: "My Tickets",
    subtitle: "Choose a ticket type or multiple types.",
  },
  {
    pattern: "/events/:id/attendees",
    title: "Attendees",
    subtitle: "Showing data over the last 30 days",
  },
  {
    pattern: "/events/:id/games",
    title: `Welcome ${username}`,
    subtitle: "Control your profile setup and integrations",
  },
  {
    pattern: "/events/:id/games/create",
    title: "Create Quiz",
    subtitle: "Design your quiz exactly how you want it",
  },
  {
    pattern: "/settings",
    title: "Settings",
    subtitle: "Take a look at your policies and the new policy to see what is covered",
  },
  {
    pattern: "/events/:id/chat",
    title: "Chat Room",
    subtitle: "Real-time communication with event participants",
  },
  {
    pattern: "/events/:id/analytics",
    title: "Analytics Page",
    subtitle: "Comprehensive overview of event performance and engagement",
  },
  {
    pattern: "/events/:id/settings/integrations",
    title: "Integrations",
    subtitle: "Connect and manage external services for your event",
  },
  {
    pattern: "/profile",
    title: "Profile page",
    subtitle: "",
    exact: true,
  },
];

