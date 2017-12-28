import React from 'react';
import './round-trip-form.css';
import AutoComplete from 'material-ui-prev/AutoComplete';
import airports from '../data/airports.json';
import DatePicker from 'material-ui-prev/DatePicker';
import RaisedButton from 'material-ui-prev/RaisedButton';
import Snackbar from 'material-ui-prev/Snackbar';
import axios from 'axios';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';

import FlightMap from '../map/map';
import FlightTable from '../flight-table/flight-table';

const menuProps = {
    desktop: true,
    disableAutoFocus: true,
};

class RoundTripForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            airportFrom: '',
            airportTo: '',
            departureDate: new Date(+new Date() + 864e5),
            returnDate: new Date(+new Date() + 6048e5),
            snackbarInvalidAirportOpen: false,
            snackbarInvalidDateOpen: false,
            snackbarInvalidAirportText: ''
        };

        this.handleRequestCloseAirportSnackbar = this.handleRequestCloseAirportSnackbar.bind(this);
        this.handleRequestCloseDateSnackbar = this.handleRequestCloseDateSnackbar.bind(this);
        this.onNewRequestFrom = this.onNewRequestFrom.bind(this);
        this.onNewRequestTo = this.onNewRequestTo.bind(this);
        this.handleChangeDepartureDate = this.handleChangeDepartureDate.bind(this);
        this.handleChangeReturnDate = this.handleChangeReturnDate.bind(this);
        this.findFlights = this.findFlights.bind(this);
        this.openInvalidAirportSnackbar = this.openInvalidAirportSnackbar.bind(this);
        this.formatDate = this.formatDate.bind(this);
    }

    formatDate = (date) => {
        let yyyy = date.getFullYear();
        let mm = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1); // getMonth() is zero-based
        let dd = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        return "".concat(dd + '/').concat(mm + '/').concat(yyyy);
    }

    openInvalidAirportSnackbar = (text) => {
        this.setState({
            snackbarInvalidAirportText: text,
            snackbarInvalidAirportOpen: true
        });
    }

    handleRequestCloseAirportSnackbar = () => {
        this.setState({
            snackbarInvalidAirportOpen: false,
        });
    };

    handleRequestCloseDateSnackbar = () => {
        this.setState({
            snackbarInvalidDateOpen: false,
        });
    };

    handleChangeDepartureDate = (event, date) => {
        this.setState({
            departureDate: date,
        });
    };

    handleChangeReturnDate = (event, date) => {
        this.setState({
            returnDate: date,
        });
    };

    onNewRequestFrom(chosenRequest, index) {
        if (airports.map(a => a.text).indexOf(chosenRequest) !== -1) {
            this.setState({ airportFrom: chosenRequest });
        } else {
            this.openInvalidAirportSnackbar('Invalid departure airport.');
        }
    }

    onNewRequestTo(chosenRequest, index) {
        if (airports.map(a => a.text).indexOf(chosenRequest) !== -1) {
            this.setState({ airportTo: chosenRequest });
        } else {
            this.openInvalidAirportSnackbar('Invalid destination airport.');
        }
    }

    filterData(searchText, key) {
        return searchText !== '' && key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
    }

    findFlights() {
        if (this.state.departureDate > this.state.returnDate) {
            this.setState({ snackbarInvalidDateOpen: true });
            return;
        }

        let indexOfDepartureAirport = airports.map(a => a.text).indexOf(this.state.airportFrom);
        if (indexOfDepartureAirport === -1) {
            this.openInvalidAirportSnackbar('Invalid departure airport.');
            return;
        }

        let indexOfDestinationAirport = airports.map(a => a.text).indexOf(this.state.airportTo);
        if (indexOfDestinationAirport === -1) {
            this.openInvalidAirportSnackbar('Invalid destination airport.');
            return;
        }

        let url = `https://api.skypicker.com/flights?flyFrom=${airports[indexOfDepartureAirport].IATA}&to=${airports[indexOfDestinationAirport].IATA}&dateFrom=${this.formatDate(this.state.departureDate)}&dateTo=${this.formatDate(this.state.departureDate)}&returnFrom=${this.formatDate(this.state.returnDate)}&returnTo=${this.formatDate(this.state.returnDate)}&partner=picky`;
        axios.get(url)
            .then(response => {
                console.log(response);
                let flightsData = response.data.data;
                let flights = flightsData.map(fd => {
                    return {
                        from: airports[indexOfDepartureAirport].IATA,
                        to: airports[indexOfDestinationAirport].IATA,
                        departure: this.formatDate(new Date(fd.dTimeUTC * 1000)),
                        arrival: this.formatDate(new Date(fd.aTimeUTC * 1000)),
                        price: fd.conversion.EUR,
                        legs: fd.route.map(r => {
                            return {
                                from: r.flyFrom,
                                to: r.flyTo,
                                departure: this.formatDate(new Date(r.dTimeUTC * 1000)),
                                arrival: this.formatDate(new Date(r.aTimeUTC * 1000)),
                                airline: r.airline
                            };
                        })
                    };
                });

                this.tableChild.updateFlights(flights);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    render(props) {
        const testRows = [
            {
                from: 'aa',
                to: 'M',
                departure: 15,
                arrival: 25,
                price: 500,
                legs: [
                    {
                        from: 'aa',
                        to: 'M',
                        departure: 'AVV',
                        arrival: 'ff',
                        airline: 'KLM'
                    }
                ]
            },
            {
                from: 'bb',
                to: 'N',
                departure: 15,
                arrival: 20,
                price: 500,
                legs: [
                    {
                        from: 'aa',
                        to: 'M',
                        departure: 'AVV',
                        arrival: 'ff',
                        airline: 'KLM'
                    }
                ]
            }
        ];
        return (
            <div>
                <Grid container spacing={24} style={{paddingTop: '20px'}}>
                    <Grid item xs={6} sm={6}>
                        <Paper style={{padding: '10px 20px 20px 20px', height: '300px'}}>
                            <h3>Search for flights</h3>
                            <div style={{ width: '49%', display: 'inline-block', marginRight: '20px'}}>
                                <AutoComplete
                                    floatingLabelText="Departure airport"
                                    filter={this.filterData}
                                    dataSource={airports.map(a => a.text)}
                                    maxSearchResults={40}
                                    fullWidth={true}
                                    menuProps={menuProps}
                                    onNewRequest={this.onNewRequestFrom}
                                />
                            </div>
                            <div style={{ width: '49%', display: 'inline-block' }}>
                                <AutoComplete
                                    floatingLabelText="Return airport"
                                    filter={this.filterData}
                                    dataSource={airports.map(a => a.text)}
                                    maxSearchResults={40}
                                    fullWidth={true}
                                    menuProps={menuProps}
                                    onNewRequest={this.onNewRequestTo}
                                />
                            </div>
                            <br />
                            <br />
                            <div style={{ width: '49%', display: 'inline-block', marginRight: '20px' }}>
                                <DatePicker hintText="Date from" container="inline" mode="landscape" autoOk={true} textFieldStyle={{ width: '100%' }} floatingLabelText="Date from"
                                    minDate={new Date()} defaultDate={new Date(+new Date() + 864e5)} />
                            </div>
                            <div style={{ width: '49%', display: 'inline-block' }}>
                                <DatePicker hintText="Return date" container="inline" mode="landscape" autoOk={true} textFieldStyle={{ width: '100%' }} floatingLabelText="Return date"
                                    minDate={new Date()} defaultDate={new Date(+new Date() + 6048e5)} />
                            </div>
                            <div>
                                <RaisedButton label="Search" fullWidth={true} primary={true} style={{ marginTop: '10px'}}
                                    onClick={this.findFlights} />
                            </div>

                            <br />
                            
                        </Paper>
                    </Grid>
                    <Grid item xs={6} sm={6}>
                        <Paper>
                            <FlightMap />
                        </Paper>
                    </Grid>
                </Grid>
                <br/>
                <Grid item xs={12}>
                    <Paper style={{padding: '10px', fontSize: 'inherit !important'}}>
                        <FlightTable flights={testRows} ref={instance => { this.tableChild = instance; }}/>
                    </Paper>
                </Grid>

                <Snackbar
                    open={this.state.snackbarInvalidAirportOpen}
                    message={this.state.snackbarInvalidAirportText}
                    onRequestClose={this.handleRequestCloseAirportSnackbar}
                    bodyStyle={{ backgroundColor: '#ff0000' }}
                />
                <Snackbar
                    open={this.state.snackbarInvalidDateOpen}
                    message="Invalid date. Departure date can't be before return date."
                    onRequestClose={this.handleRequestCloseDateSnackbar}
                    bodyStyle={{ backgroundColor: '#ff0000' }}
                />
            </div>
        );
    }
}

export default RoundTripForm;