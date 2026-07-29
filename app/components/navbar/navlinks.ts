interface INavLinks {
  text: string;
  to: string;
  anchorId?: string;
}

const navlinks: INavLinks[] = [
  { text: "Home", to: "/", anchorId: "home" },
  { text: "Events", to: "/events", anchorId: "events" },
  { text: "Team", to: "/team", anchorId: "team" },
  { text: "Sophomore Interviews", to: "/sophomore-interviews" },
  { text: "Projects", to: "/coming-soon" },
  { text: "Contact Us", to: "/contact", anchorId: "contact" },
];

export const LINKS_GROUP_ONE_COUNT = 5;

export default navlinks;
