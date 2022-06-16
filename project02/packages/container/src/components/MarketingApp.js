import {mount as marketingMount} from 'marketing/MarketingApp';
import React, {useEffect, useRef} from 'react';

export default () => {
    const ref = useRef(null);

    useEffect(() => {
        marketingMount(ref.current);
    });

    return <div ref={ref}/>;
};
