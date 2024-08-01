import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { NotFound } from "@/screens/404";
import { ConsultCertificates } from "@/screens/app/ConsultCertificates";
import { Home } from "@/screens/app/Home";
import { DashboardLayout } from "@/screens/app/layout";
import { ManageClasses } from "@/screens/app/ManageClasses";
import { ManageCourses } from "@/screens/app/ManageCourses";
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
    path: "/dashboard/meus-treinamentos",
    element: <ManageCourses />,
  },
  {
    path: "/dashboard/gerenciar-videoaulas",
    element: <ManageClasses />,
  },
  {
    path: "/dashboard/consultar-certificados",
    element: <ConsultCertificates />,
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
