const username = "{firstName}";

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
    title: "Event Analytics",
    subtitle: "",
  },
  {
    pattern: "/events/:id/settings/integrations",
    title: "Integrations",
    subtitle: "Connect and manage external services for your event",
  },
  {
    pattern: "/events/:id/speakers",
    title: "Speaker Directory",
    subtitle: "",
  },
  {
    pattern: "/profile",
    title: "Profile page",
    subtitle: "",
    exact: true,
  },
  {
    pattern: "/events/:id/networking",
    title: "Networking",
    subtitle: "Connect with attendees based on shared interests and goals",
  },
  {
    pattern: "/events/:id/links",
    title: "Links & Resources",
    subtitle: "Share important links, documents, and resources with attendees",
  },
  {
    pattern: "/events/:id/calendar",
    title: "Calendar & Reminders",
    subtitle: "Track deadlines, milestones, and important reminders",
  },
  {
    pattern: "/events/:id/polls",
    title: "Polls",
    subtitle: "Create polls, gather attendee feedback, and view real-time results",
  },
  {
    pattern: "/events/notifications",
    title: "Notifications",
    subtitle: "Track all activity across your events",
    exact: true,
  },
];

