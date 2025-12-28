import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { withTranslations } from "react-utilities";
import { SystemFeedbackProvider } from "react-style-guide";
import { translationConfig } from "./translation.config";
import GamesOmniFeed from "../../../ts/react/gamesPage/GamesOmniFeed";
import SortDetailExploreApi from "../../../ts/react/sortDetail/exploreApi/SortDetailExploreApi";
import SortDetailV2 from "../../../ts/react/sortDetail/SortDetailV2";

const localeRouteRegex = "/:locale([a-z]{2})";

function ChartsRoutes(props) {
	return (
		<SystemFeedbackProvider>
			<Route exact path="/charts" render={() => <GamesOmniFeed {...props} />} />
			<Route exact path="/charts/:sortName" component={SortDetailExploreApi} />
			<Route exact path="/charts/v2/:sortName" component={SortDetailV2} />
			{/* optional locale prefix */}
			<Route
				exact
				path={`${localeRouteRegex}/charts`}
				render={() => <GamesOmniFeed {...props} />}
			/>
			<Route
				exact
				path={`${localeRouteRegex}/charts/:sortName`}
				component={SortDetailExploreApi}
			/>
			<Route
				exact
				path={`${localeRouteRegex}/charts/v2/:sortName`}
				component={SortDetailV2}
			/>
		</SystemFeedbackProvider>
	);
}

function App(props) {
	return (
		<BrowserRouter>
			<ChartsRoutes {...props} />
		</BrowserRouter>
	);
}

export { ChartsRoutes };

export default withTranslations(App, translationConfig);
