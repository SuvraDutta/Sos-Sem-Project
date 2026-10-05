import { useCallback, useState } from "react";
import type { LocationState } from "./types";

export function useGeolocation() {
  const [state, setState] = useState<LocationState>({ status: "idle" });

  const request = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setState({ status: "unavailable" });
      return;
    }
    setState({ status: "loading" });
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setState({
          status: "success",
          fix: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            timestamp: pos.timestamp,
          },
        }),
      (err) => {
        if (err.code === err.PERMISSION_DENIED) setState({ status: "denied" });
        else if (err.code === err.TIMEOUT) setState({ status: "timeout" });
        else setState({ status: "unavailable" });
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  }, []);

  return { state, request };
}
