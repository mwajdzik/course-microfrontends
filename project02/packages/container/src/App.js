import React, {lazy, Suspense, useState} from 'react';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {createGenerateClassName, StylesProvider} from "@material-ui/core";

import Header from "./components/Header";
import Progress from "./components/Progress";

// import AuthApp from "./components/AuthApp";
// import MarketingApp from "./components/MarketingApp";

const AuthLazy = lazy(() => import("./components/AuthApp"));
const MarketingLazy = lazy(() => import("./components/MarketingApp"));

const generateClassName = createGenerateClassName({
    productionPrefix: 'co'
});

export default () => {
    const [isSignedIn, setIsSignedIn] = useState(false);

    return (
        <StylesProvider generateClassName={generateClassName}>
            <BrowserRouter>
                <div>
                    <Header isSignedIn={isSignedIn}
                            onSignOut={() => setIsSignedIn(false)}/>

                    <Suspense fallback={<Progress/>}>
                        <Switch>
                            <Route path="/auth">
                                <AuthLazy onSignedIn={() => setIsSignedIn(true)}/>
                            </Route>
                            <Route path="/" component={MarketingLazy}/>
                        </Switch>
                    </Suspense>
                </div>
            </BrowserRouter>
        </StylesProvider>
    )
};
