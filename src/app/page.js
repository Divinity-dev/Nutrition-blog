import Home from "./Home"; // your current file

export const metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function Page() {
  return <Home />;
}