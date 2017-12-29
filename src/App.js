import React, { Component } from 'react';
import './App.css';
import { Tabs, Tab } from 'material-ui-prev/Tabs';
import MuiThemeProvider from 'material-ui-prev/styles/MuiThemeProvider'
import RoundTripForm from './round-trip-form/round-trip-form';

const styles = {
    headline: {
        fontSize: 24,
        paddingTop: 16,
        fontWeight: 400,
    },
    slide: {
        padding: 10,
        width: '100vh',
        height: 'calc(100vh - 48px)',
    },
};

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            slideIndex: 0,
        };
    }

    render() {
        return (
            <div>
                <MuiThemeProvider>
                    <Tabs>
                        <Tab label="Round trip">
                            <div className="main-wrapper">
                                <RoundTripForm />
                            </div>
                        </Tab>
                        <Tab label="Multicity">
                            <div>
                                <h2 style={styles.headline}>Tab Three</h2>
                                <p>
                                    This is a third example tab.
                                </p>
                            </div>
                        </Tab>
                    </Tabs>
                </MuiThemeProvider>
            </div>
        );
    }
}

export default App;
