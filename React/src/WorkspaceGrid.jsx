import React from 'react';
import Grid from "@material-ui/core/Grid";
import WorkspaceItem from "./WorkspaceItem.jsx";


const styles = {
  workspaceStyle: {
    overflowX: 'scroll',
    height: '300px'
  }
};

class WorkspaceGrid extends React.Component {
  render() {
    return (
      <div style={styles.workspaceStyle}>
        <Grid container justify="center" spacing={24} wrap={'nowrap'}>
          {Object.keys(this.props.classifications).map( key => (
          <WorkspaceItem name={this.props.classifications[key].name}
                         values={this.props.classifications[key].values}
                          rfield = {(event) => this.props.dfield(key, event)}/>
        ))}
        </Grid>
      </div>
    );
  }
}

export default WorkspaceGrid;


