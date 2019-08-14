import React from 'react';

import './Spinner.css';


interface IProps {

}

export default class Spinner extends React.Component<IProps> {
    render() {
        return (
            <span className="loading" style={{ animationDuration: '5s' }}></span>
        );
    }
}