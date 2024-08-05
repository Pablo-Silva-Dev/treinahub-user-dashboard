import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { NotFound } from "@/screens/404";
import { Certificates } from "@/screens/app/Certificates";
import { FAQPage } from "@/screens/app/FAQ";
import { Home } from "@/screens/app/Home";
import { DashboardLayout } from "@/screens/app/layout";
import { Profile } from "@/screens/app/Profile";
import { SupportPage } from "@/screens/app/Support";
import { ErrorPage } from "@/screens/error";
import { ReactNode } from "react";

type route = {
  path: string;
  element: ReactNode;
};

const appRoutesBase: route[] = [
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/dashboard",
    element: <Home />,
  },
  {
    path: "/dashboard/acessar-meus-certificados",
    element: <Certificates />,
  },
  {
    path: "/dashboard/consultar-faq",
    element: <FAQPage />,
  },
  {
    path: "/dashboard/acessar-meu-perfil",
    element: <Profile />,
  },
  {
    path: "/dashboard/acessar-suporte",
    element: <SupportPage />,
  },
];

const appRoutes = appRoutesBase.map((route) => ({
  path: route.path,
  element: <DashboardLayout>{route.element}</DashboardLayout>,
  errorElement: <ErrorPage />,
}));

const appRouter = createBrowserRouter(appRoutes);

const AppRouter: React.FC = () => {
  return <RouterProvider router={appRouter} />;
};

export default AppRouter;
