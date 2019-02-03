
import React from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';

//const styles = theme => ({
const styles = ({
    paperContainer: {
    	display: 'flex',
    	width: '100%',
    	height: '100%',
        backgroundImage: `url(https://cdn1.marklogic.com/wp-content/uploads/2018/09/home-hero-marklogic-data-hub-service-v1-1600x700.jpg)`,
    	backgroundSize: 'cover',
    	backgroundPosition: 'center'
    },
    startButton: {
    	position: 'relative',
    	top: '35%',
    	left: '25%',
        color: 'white',
    	width: 40,
    	height: 40
    }

});

class HomePage extends React.Component{

    render(){
        return(
        	
          <div style={styles.paperContainer}>

            <div style={styles.startButton}>
                <h2>
                    DATA CLASSIFIER
                </h2>

                <div>
                    <Button variant="contained" color="secondary">
        	            Start
                    </Button>
                </div>

            </div>

          </div>

        );
    }
}


export default HomePage;

