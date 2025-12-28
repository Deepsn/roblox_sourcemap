import { ready } from "core-utilities";
import React from "react";
import { render } from "react-dom";
import App from "./App";

import "../../../css/gameCarousel/gameCarousel.scss";
import "../../../css/tailwind.css";

const gamesCarouselPageId = "games-carousel-page";
const gamesCarouselWebAppId = "game-carousel-web-app";

ready(() => {
	if (document.getElementById(gamesCarouselPageId)) {
		render(<App />, document.getElementById(gamesCarouselPageId));
	} else if (document.getElementById(gamesCarouselWebAppId)) {
		render(<App />, document.getElementById(gamesCarouselWebAppId));
	}
});
