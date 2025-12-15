import Dashboard from "pages/Dashboard";
import Category from "pages/Category";
import Contact from "pages/Contact";
import ProjectEnquiry from "pages/ProjectEnquiry";
import Projects from "pages/Projects";
import Builders from "pages/Builders";
import Orders from "pages/Orders";
import Banner from "pages/Banner";
import Settings from "pages/Settings";
import Billing from "layouts/billing";
import Profile from "layouts/profile";
import Box from "components/Box";
import Blogs from "pages/Blogs";
import Sections from "pages/Sections";
import Tags from "pages/Tags";
import Analytics from "pages/Analytics";


const routes = [
  // {
  //   type: "route",
  //   name: "Dashboard",
  //   key: "dashboard",
  //   route: "/dashboard",
  //   icon: <Box component="i" color="primary" fontSize="14px" className="ni ni-tv-2" />,
  //   component: <Dashboard />,
  // },
  {
    type: "route",
    name: "Contact",
    key: "contact",
    route: "/contact",
    icon: <Box component="i" color="dark" fontSize="14px" className="ni ni-single-02" />,
    component: <Contact />,
  },
  {
    type: "route",
    name: "Analytics",
    key: "analytics",
    route: "/analytics",
    icon: <Box component="i" color="primary" fontSize="14px" className="ni ni-chart-bar-32" />,
    component: <Analytics />,
  },
  {
    type: "route",
    name: "Categories",
    key: "category",
    route: "/category",
    icon: <Box component="i" color="info" fontSize="14px" className="ni ni-single-copy-04" />,
    component: <Category />,
  },
  {
    type: "route",
    name: "Projects",
    key: "projects",
    route: "/projects",
    icon: <Box component="i" color="primary" fontSize="14px" className="ni ni-bulb-61" />,
    component: <Projects />,
  },
  {
    type: "route",
    name: "Builders",
    key: "builders",
    route: "/builders",
    icon: <Box component="i" color="primary" fontSize="14px" className="ni ni-tv-2" />,
    component: <Builders />,
  },
  {
    type: "route",
    name: "Project Enquiry",
    key: "projectEnquiry",
    route: "/projectEnquiry",
    icon: <Box component="i" color="success" fontSize="14px" className="ni ni-credit-card" />,
    component: <ProjectEnquiry />,
  },
  // {
  //   type: "route",
  //   name: "Orders",
  //   key: "orders",
  //   route: "/orders",
  //   icon: <Box component="i" color="warning" fontSize="14px" className="ni ni-cart" />,
  //   component: <Orders />,
  // },
  {
    type: "route",
    name: "Banners",
    key: "banners",
    route: "/banners",
    icon: <Box component="i" color="warning" fontSize="14px" className="ni ni-album-2" />,
    component: <Banner />,
  },
  {
    type: "route",
    name: "Tags",
    key: "tags",
    route: "/tags",
    icon: <Box component="i" color="primary" fontSize="14px" className="ni ni-book-bookmark" />,
    component: <Tags />,
  },
  {
    type: "route",
    name: "Blogs",
    key: "blogs",
    route: "/blogs",
    icon: <Box component="i" color="primary" fontSize="14px" className="ni ni-album-2" />,
    component: <Blogs />,
  },
  {
    type: "route",
    name: "Sections",
    key: "sections",
    route: "/sections",
    icon: <Box component="i" color="info" fontSize="14px" className="ni ni-single-copy-04" />,
    component: <Sections />,
  },
  // {
  //   type: "route",
  //   name: "Billing",
  //   key: "billing",
  //   route: "/billing",
  //   icon: <Box component="i" color="success" fontSize="14px" className="ni ni-credit-card" />,
  //   component: <Billing />,
  // },
  { type: "title", title: "Account Pages", key: "account-pages" },
  // {
  //   type: "route",
  //   name: "Profile",
  //   key: "profile",
  //   route: "/profile",
  //   icon: <Box component="i" color="dark" fontSize="14px" className="ni ni-single-02" />,
  //   component: <Profile />,
  // },
  {
    type: "route",
    name: "Settings",
    key: "settings",
    route: "/settings",
    icon: <Box component="i" color="dark" fontSize="14px" className="ni ni-settings-gear-65" />,
    component: <Settings />,
  },
];

export default routes;
