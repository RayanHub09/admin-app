import React from 'react';
import {IRole, options} from "../../lists/roleList";
import NavigationSection from "./NavigationSection";
import {useAppSelector} from "../../hooks/redux-hooks";
import admin from "firebase-admin";

const NavigationSections = () => {

    const manager = useAppSelector(state => state.manager.manager)
    const full_options = manager.role === 'admin' ? options : {
        [manager.role as string] : options[manager.role as keyof IRole]
    }

    return (
            <div className={'sections_list_container'}>
                {Object.keys(full_options).map((key) =>
                    <NavigationSection
                        key={key}
                        option={key as string}/>
                )}
        </div>
    );
};

export default NavigationSections;