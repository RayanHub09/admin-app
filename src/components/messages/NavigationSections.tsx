import React, {useState} from 'react';
import {IRole, options} from "../../lists/roleList";
import {Link} from "react-router-dom";
import {useAppSelector} from "../../hooks/redux-hooks";
import NavigationSection from "./NavigationSection";

const NavigationSections = () => {

    return (
            <div className={'sections_list_container'}>
                {Object.keys(options).map((key) =>
                    <NavigationSection
                        key={key}
                        option={key as string}/>
                )}
        </div>
    );
};

export default NavigationSections;