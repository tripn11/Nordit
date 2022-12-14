import React from "react";
import { connect } from "react-redux";
import moment from 'moment'
import numeral from 'numeral';
import { DateRangePicker } from 'react-dates';
import dashboardSorter from "../sorter/dashboardSorter";
import numeralFormat from "../Numeral/numeralFormat";
import Logout from "./Logout";

numeralFormat(); //changes the locale to nigerian naira as set in numeralformat. needs to run only once for the entire project

class DashboardPage extends React.Component {
    constructor (props) {
        super(props)
        this.state={
            startDate: moment().startOf('month').valueOf(),
            endDate: moment().valueOf(),
            focused: null
        }
    }

    qualified = () => {
        const fakeState = {...this.props.state};
        const totals = dashboardSorter(fakeState, this.state);
        return totals
    }
    

    datesChanged = ({startDate , endDate}) => {
        this.setState( ()=>{
            if (startDate === null || endDate === null){ //it could not find the valueOf() for null when the user clears the date, hence the need for the conditional.
                return {
                    ...this.state,
                    startDate: moment().startOf('month').valueOf(),
                    endDate: moment().valueOf()
                }                
            }else{
                return{
                    ...this.state,
                    startDate:startDate.valueOf(),
                    endDate:endDate.valueOf()
                }
            }
        })
    }

    focusChanged = (focused) => {
        this.setState( ()=>({ focused }))
    }    


    render () {
        return (
            <div>
                <h3 id="dashboard-welcome">Welcome {this.props.auth.name},</h3>
                <div className="page-content">
                    <div id="date-range">
                        <DateRangePicker 
                            startDate={moment(this.state.startDate)}
                            endDate={moment(this.state.endDate)}
                            onDatesChange={this.datesChanged}
                            focusedInput={this.state.focused}
                            onFocusChange={this.focusChanged}
                            showClearDates={true}
                            numberOfMonths={1}
                            isOutsideRange={() => false}
                            displayFormat='DD/MM/YYYY'
                            id="date-range-picker"
                        />
                    </div>
                    <div id="dashboard-details_container">
                        <div className="dashboard-detail">
                            <span className="label" id="label-1">INCOME</span>
                            <p>{numeral(this.qualified().totalIncomes).format('$0,0[.]00')} </p>
                        </div>
                        <div className="dashboard-detail">
                            <span className="label" id="label-2">EXPENSE</span>
                            <p>{numeral(this.qualified().totalExpenses).format('$0,0[.]00')} </p>
                        </div>
                        <div className="dashboard-detail" id="dashboard-detail-3">
                            <span className="label" id="label-3">NET</span>
                            <p>{numeral(this.qualified().total).format('$0,0[.]00')}</p>
                        </div>
                    </div>
                    
                    <p id="dashboard-summary">From <span>{moment(this.state.startDate).format("Do MMMM, YYYY")}</span> to <span>{moment(this.state.endDate).format("Do MMMM, YYYY")}</span> you have <span>{numeral(this.qualified().total).format('0,0[.]00')}</span> Naira only</p>
                    <div id="logout">
                        <Logout />
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    state: state.records,
    auth:  state.auth
})

export default connect(mapStateToProps)(DashboardPage);