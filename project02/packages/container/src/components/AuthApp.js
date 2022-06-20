import {mount as authMount} from 'auth/AuthApp';
import React, {useEffect, useRef} from 'react';
import {useHistory} from 'react-router-dom'

export default () => {
    const ref = useRef(null);
    const history = useHistory();

    useEffect(() => {
        const {onParentNavigate} = authMount(ref.current, {
            initialPath: history.location.pathname,
            onNavigate: ({pathname: nextPathName}) => {
                console.log('The container noticed navigation in Auth to', nextPathName);

                if (history.location.pathname !== nextPathName) {
                    history.push(nextPathName);
                }
            }
        });

        history.listen(onParentNavigate);
    }, []); // [] means it will be called only once

    return <div ref={ref}/>;
};
