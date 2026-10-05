## Architecture

- SOS submission logic is separated from the UI and is maintained in `src/features/sos/api.ts`.
- The frontend communicates with the FastAPI backend through the configured `VITE_SOS_API_URL` environment variable.
- When the backend is unavailable or not configured, the application does not simulate a successful submission. The report remains clearly marked as "prepared, not sent".
- Leaflet is loaded dynamically inside React effects to ensure browser-compatible map initialization.
- OpenStreetMap is used as the map tile provider.
- Browser Geolocation API is used to obtain the user's current location with permission.