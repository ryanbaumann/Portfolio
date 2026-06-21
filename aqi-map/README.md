# Hyperlocal AQI Map

A browser-based hyperlocal air quality index (AQI) map that retrieves real-time PurpleAir sensor data and renders interpolated local AQI contours on a Mapbox GL map.

## Features

*   **Real-time Sensor Data**: Fetches hyperlocal particulate matter data directly from PurpleAir sensors.
*   **AQI Interpolation**: Uses Turf.js and D3 tricontours to compute and render air quality contours.
*   **Interactive Search**: Includes a Mapbox Geocoder search box to quickly fly to different locations.

## Prerequisites

*   [Node.js](https://nodejs.org/) (version 20 or newer).
*   A Mapbox Public Access Token (obtainable via [Mapbox Account](https://account.mapbox.com/)).
*   A PurpleAir API Read Key (obtainable via [PurpleAir Developer Dashboard](https://develop.purpleair.com/)).

## Getting Started

1.  **Clone the repo and install dependencies**:
    ```bash
    cd aqi-map
    npm install
    ```

2.  **Configure environment credentials**:
    Open `index.html` (or create a custom config in your static host environment) and configure the `window.AQI_MAP_CONFIG` block:
    ```html
    <script>
      window.AQI_MAP_CONFIG = {
        mapboxAccessToken: "YOUR_MAPBOX_PUBLIC_TOKEN",
        mapboxStyleUrl: "mapbox://styles/mapbox/streets-v11",
        purpleAirApiKey: "YOUR_PURPLEAIR_READ_API_KEY",
        maxSensorAgeSeconds: 604800
      };
    </script>
    ```

3.  **Run the local development server**:
    ```bash
    npm start
    ```
    Open the address printed in the terminal (usually `http://localhost:9966`) to view the application with live reload enabled.

4.  **Build for production**:
    ```bash
    npm run build
    ```
    This bundles the JavaScript using Browserify into `build/bundle.js` and copies the static assets to `build/`.

## Security Best Practices

*   **Expose Only Restricted Tokens**: Use a public Mapbox token and restrict it to your specific production and local development referrers.
*   **Do Not Commit Credentials**: Never commit active Mapbox access tokens or PurpleAir API keys to the repository. Keep credentials configuration local or injected at deploy time.

## Terms of Service & Compliance

By running this application, you must comply with:
*   **Mapbox Terms**: Subject to the [Mapbox Terms of Service](https://www.mapbox.com/legal/tos).
*   **PurpleAir API Terms**: Subject to the [PurpleAir Terms of Service](https://www.purpleair.com/terms-of-service). Ensure your API usage stays within the bounds of your PurpleAir plan limits.

## Contributing

Contributions are welcome! Please open a pull request or submit an issue. Keep changes focused and self-contained within this project directory.

## License

This project is licensed under the [MIT License](../LICENSE).
