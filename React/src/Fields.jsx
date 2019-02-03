import React from 'react';
import EnhancedTable from './EnhancedTable.jsx'

class Fields extends React.Component {
  render() {
    return (
      <EnhancedTable
          name={"Fields"}
          values={this.props.fields}
          callback={this.props.callback}
      />
    );
              }
}

export default Fields;