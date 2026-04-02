import { useContext } from "react";

import Frames from "../components/Frames";
import RouteNotFound from "../components/RouteNotFound";
import TopBar from "../components/TopBar";
import { ConfigContext } from "../contexts/ConfigContext";

export default function Container() {
  const { routeState } = useContext(ConfigContext);

  return (
    <main>
      {routeState?.status === "invalid" ? (
        <RouteNotFound />
      ) : (
        <>
          <TopBar />
          <Frames />
        </>
      )}
    </main>
  );
}
