import {mount as dashboardMount} from 'dashboard/DashboardApp';
import React, {useEffect, useRef} from 'react';

export default () => {
    const ref = useRef(null);

    useEffect(() => {
        dashboardMount(ref.current)
    }, []); // [] means it will be called only once

    return <div ref={ref}/>;
};
