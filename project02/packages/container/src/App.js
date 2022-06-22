import React, {lazy, Suspense, useEffect, useState} from "react";
import {Router, Redirect, Route, Switch} from "react-router-dom";
import {createBrowserHistory} from "history";
import {createGenerateClassName, StylesProvider} from "@material-ui/core";

import Header from "./components/Header";
import Progress from "./components/Progress";

// import AuthApp from "./components/AuthApp";
// import MarketingApp from "./components/MarketingApp";

const AuthLazy = lazy(() => import("./components/AuthApp"));
const MarketingLazy = lazy(() => import("./components/MarketingApp"));
const DashboardLazy = lazy(() => import("./components/DashboardApp"));

const generateClassName = createGenerateClassName({
    productionPrefix: 'co'
});

const history = createBrowserHistory();

export default () => {
    const [isSignedIn, setIsSignedIn] = useState(false);

    useEffect(() => {
        if (isSignedIn) {
            history.push('/dashboard');
        }
    }, [isSignedIn]);

    return (
        <StylesProvider generateClassName={generateClassName}>
            <Router history={history}>
                <div>
                    <Header isSignedIn={isSignedIn}
                            onSignOut={() => setIsSignedIn(false)}/>

                    <Suspense fallback={<Progress/>}>
                        <Switch>
                            <Route path="/auth">
                                <AuthLazy onSignedIn={() => setIsSignedIn(true)}/>
                            </Route>
                            <Route path="/dashboard">
                                {!isSignedIn && <Redirect to="/"/>}
                                <DashboardLazy/>
                            </Route>
                            <Route path="/" component={MarketingLazy}/>
                        </Switch>
                    </Suspense>
                </div>
            </Router>
        </StylesProvider>
    )
};
