import React from 'react';
import {
    PagingState,
    LocalPaging,
    SortingState,
    LocalSorting
} from '@devexpress/dx-react-grid';
import {
    Grid,
    Table,
    TableHeaderRow,
    PagingPanel,
    TableRowDetail
} from '@devexpress/dx-react-grid-material-ui';
import {
    RowDetailState
} from '@devexpress/dx-react-grid';
import Paper from 'material-ui/Paper';
import './flight-table.css';

const RowDetail = ({ row }) => (
    <Grid rows={row.legs}
        columns={[
            { name: 'from', title: 'From airport' },
            { name: 'to', title: 'To airport' },
            { name: 'departure', title: 'Departure' },
            { name: 'arrival', title: 'Arrival' },
            { name: 'airline', title: 'Airline' }
        ]}>
        <Table />
        <TableHeaderRow />
    </Grid>
);

class FlightTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: [
                { name: 'from', title: 'From airport' },
                { name: 'to', title: 'To airport' },
                { name: 'departure', title: 'Departure' },
                { name: 'arrival', title: 'Arrival' },
                { name: 'price', title: 'Price' }
            ],
            rows: props.flights,
            allowedPageSizes: [5, 10, 15, 0]
        };
    }

    updateFlights(flights) {
        this.setState({rows: flights});
    }

    render() {
        const { rows, columns, allowedPageSizes } = this.state;

        return (
            <Grid
                rows={rows}
                columns={columns}
            >
                <SortingState />
                <LocalSorting />
                <RowDetailState />
                <PagingState
                    defaultCurrentPage={0}
                    defaultPageSize={5}
                />
                <LocalPaging />
                <Table />

                <TableHeaderRow
                    allowSorting
                />
                <TableRowDetail
                    contentComponent={RowDetail}
                />
                <PagingPanel
                    allowedPageSizes={allowedPageSizes}
                />
            </Grid>
        );
    }
}

export default FlightTable;