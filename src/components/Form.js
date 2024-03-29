import React from 'react';
import moment from 'moment';
import { connect } from "react-redux";
import { SingleDatePicker } from 'react-dates';
import LoadingPage from './LoadingPage';

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id:props.selected ? props.selected.id : "",
      description:props.selected ? props.selected.description : "",
      amount:props.selected ? props.selected.amount : "",
      note:props.selected ? props.selected.note : "",
      date:props.selected ? props.selected.date : moment().valueOf(),
      focused: false,
    };
  }

  onDescriptionChange = (e) => {
    this.setState(() => ({ description:e.target.value }));
  };

  onNoteChange = (e) => {
    this.setState(() => ({ note: e.target.value }));
  };

  onAmountChange = (e) => {
    const amount = e.target.value;

    if (amount.match(/^\d{0,}(\.\d{0,2})?$/)) { //a regex for accepting only numbers allowing just one decimal and 2 decimal places
      this.setState(() => ({ amount }));
    }
  };

  onDateChange = (date) => { 
    this.setState(() => (date.valueOf() > moment().valueOf() ? ({date:moment().valueOf()}) : ({ date: date.valueOf() }))); //so that the user cannot select dates in the future for inputs 
  };

  onFocusChange = ({ focused }) => {
    this.setState(() => ({ focused }));
  };

  onSubmit = (e) => {
    e.preventDefault();
    
    const item = { 
        description: this.state.description.toLowerCase(),
        amount: this.state.amount,
        note: this.state.note,
        date: this.state.date
    }

    this.props.actions(item)
  };

  render() {
    return this.props.loadingState ? <LoadingPage /> : (
      <div id='form-page'>
        <h2>{this.props.type}</h2>
        <form onSubmit={this.onSubmit}>
          <input
            type="text"
            placeholder="Description"
            autoFocus
            value={this.state.description}
            onChange={this.onDescriptionChange}
            required
          />

          <input
            type="text"
            placeholder="Amount"
            value={this.state.amount}
            onChange={this.onAmountChange}
            required
          />

          <div className='date'>
            <SingleDatePicker
              date={moment(this.state.date)}
              onDateChange={this.onDateChange}
              focused={this.state.focused}
              onFocusChange={this.onFocusChange}
              numberOfMonths={1}
              isOutsideRange={() => false}
              displayFormat='DD/MM/YYYY'
            />
          </div>

          <textarea
            placeholder="Add a note for your item (optional)"
            className="textarea"
            value={this.state.note}
            onChange={this.onNoteChange}
          >
          </textarea>
          <div id='form-button'>
            <button className='button-average'>Save</button>
          </div>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  loadingState: state.auth.loading
})

export default connect(mapStateToProps)(Form);