import { Loading } from "@/components/miscellaneous/Loading";
import { lazy, ReactNode, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const NotFound = lazy(() => import("@/screens/404"));
const ErrorPage = lazy(() => import("@/screens/error"));
const DashboardLayout = lazy(() => import("@/screens/app/layout"));
const Certificates = lazy(() => import("@/screens/app/Certificates"));
const CheckQuizResponse = lazy(
  () => import("@/screens/app/CheckQuizResponses")
);
const FAQPage = lazy(() => import("@/screens/app/FAQ"));
const Home = lazy(() => import("@/screens/app/Home"));
const Profile = lazy(() => import("@/screens/app/Profile"));
const Quizzes = lazy(() => import("@/screens/app/Quizzes"));
const RespondQuiz = lazy(() => import("@/screens/app/RespondQuizz"));
const SupportPage = lazy(() => import("@/screens/app/Support"));
const Trainings = lazy(() => import("@/screens/app/Trainings"));
const WatchTraining = lazy(() => import("@/screens/app/WatchTraining"));

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
    path: "/dashboard/acessar-meus-treinamentos",
    element: <Trainings />,
  },
  {
    path: "/dashboard/acessar-meus-questionarios",
    element: <Quizzes />,
  },
  {
    path: "/dashboard/responder-questionario",
    element: <RespondQuiz />,
  },
  {
    path: "/dashboard/revisar-questionario",
    element: <CheckQuizResponse />,
  },
  {
    path: "/dashboard/assistir-treinamento",
    element: <WatchTraining />,
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

const LoadingFallback = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Loading />
    </div>
  );
};

const appRoutes = appRoutesBase.map((route) => ({
  path: route.path,
  element: (
    <Suspense fallback={<LoadingFallback />}>
      <DashboardLayout>{route.element}</DashboardLayout>
    </Suspense>
  ),
  errorElement: (
    <Suspense fallback={<LoadingFallback />}>
      {" "}
      <ErrorPage />
    </Suspense>
  ),
}));

const appRouter = createBrowserRouter(appRoutes);

const AppRouter: React.FC = () => {
  return <RouterProvider router={appRouter} />;
};

export default AppRouter;
