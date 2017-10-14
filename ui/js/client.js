import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, browserHistory } from "react-router";

import Layout from "./components/Layout";
import JoinOrHost from "./components/pages/JoinOrHost";
import GameLayout from "./components/pages/GameLayout";

const app = document.getElementById('app');

ReactDOM.render(
	<Router history = {browserHistory}>
		<Route path = "/" component={Layout}>
			<IndexRoute component={JoinOrHost} />
			<Route path = "game/:id" component={GameLayout}> </Route>
		</Route>
	</Router>
	,app);