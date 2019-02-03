
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
        backgroundImage: `url(https://www.slohacks.com/static/baker.4c856e2a.png)`,
    	backgroundSize: 'cover',
    	backgroundPosition: 'center'
    },
    startButton: {
    	position: 'relative',
    	top: '15%',
    	left: '10%',
        color: 'black',
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
                    Anomaly Detection
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

