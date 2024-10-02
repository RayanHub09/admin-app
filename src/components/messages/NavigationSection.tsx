import React, {useState} from 'react';
import {IRole, options} from "../../lists/roleList";
import {Link} from "react-router-dom";

const NavigationSection = () => {

    const [section, setSection] = useState('accounting')

    function showSection(key: string): void {
        setSection(key)
    }

    return (
            <div className={'sections_list_container'}>
                {Object.keys(options).map((key) =>
                    <Link
                        onClick={event => showSection(key)}
                        className={section === key ? 'active_section_messages' : 'section_messages'}
                        key={key}
                        to={`/messages/${key}`}>
                        {options[key as keyof IRole]}
                    </Link>
                )}
        </div>
    );
};

export default NavigationSection;