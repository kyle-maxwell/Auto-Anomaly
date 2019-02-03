import React from 'react';
import EnhancedTable from './EnhancedTable.jsx'

class Classifications extends React.Component {

    render(){
        return (
            <EnhancedTable
                name={"Classifications"}
                values={this.props.classifications}
                callback={this.props.callback}
            />
        )
    }
}

export default Classifications;
