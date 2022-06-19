import {mount as marketingMount} from 'marketing/MarketingApp';
import React, {useEffect, useRef} from 'react';
import {useHistory} from 'react-router-dom'

export default () => {
    const ref = useRef(null);
    const history = useHistory();

    useEffect(() => {
        const {onParentNavigate} = marketingMount(ref.current, {
            onNavigate: ({pathname: nextPathName}) => {
                console.log('The container noticed navigation in Marketing to', nextPathName);

                if (history.location.pathname !== nextPathName) {
                    history.push(nextPathName);
                }
            }
        });

        history.listen(onParentNavigate);
    }, []); // [] means it will be called only once

    return <div ref={ref}/>;
};
