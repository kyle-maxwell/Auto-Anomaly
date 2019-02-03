import React from 'react';
import Grid from '@material-ui/core/Grid';
import Classifications from './Classifications.jsx'
import Fields from './Fields.jsx'
import WorkspaceGrid from "./WorkspaceGrid.jsx";

class AnalysisPage extends React.Component {


  constructor(props){
    super(props);
    this.state = {
      classifications : this.props.data.Classifications,
      fields : this.props.data.Fields,
      selectedClassifications : {},
      selectedFields : {},
    }
  }
    



  handleClassificationsExport = (key) => {
    const selected = this.state.selectedClassifications;
    Object.keys(key).map( key => {
      if (this.state.classifications[key] in selected) {
        delete selected[key]
      }
      selected[key] = this.state.classifications[key]
    });
    this.setState({
        selectedClassifications : selected
    });
  };

  handleFieldsExport = (key) => {
      const selected = this.state.selectedFields;
      Object.keys(key).map( key => {
          if (this.state.fields[key] in selected) {
              delete selected[key]
          }
          selected[key] = this.state.fields[key]
      });
      this.setState({
          selectedFields : selected
      });
  };


  deleteField = (key, field) => {
    const classifications = this.state.classifications;
    delete classifications[key].values[field];
    this.setState({
      classifications : classifications
    })
  };


	render() {

		return (
			<div>
			  <Grid container justify="center" spacing={24}>
			    <Grid key="1" xs={6} item>
			      <Classifications classifications={this.state.classifications} callback={this.handleClassificationsExport}/>
			    </Grid>
			    <Grid key="2" xs={6} item>
			      <Fields fields={this.state.fields} callback={this.handleFieldsExport} />
			    </Grid>
			    <Grid key="3" xs={6} item>
			      <WorkspaceGrid classifications={this.state.selectedClassifications} dfield={this.deleteField}/>
			    </Grid>
			  </Grid>
			</div>
		);
	}

}

export default AnalysisPage;

