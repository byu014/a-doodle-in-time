import React from 'react';
import AppContext from '../lib/app-context';

export default class Browse extends React.Component {
  constructor(props) {
    super(props);
    this.date = new Date();
    this.state = {
      month: null,
      day: null,
      year: null
    };

    this.incrase = this.increase.bind(this);
    this.handleClickDatePickers = this.handleClickDatePickers.bind(this);
  }

  componentDidMount() {
    this.setState({
      month: this.date.getUTCMonth(),
      date: this.date.getUTCDate(),
      year: this.date.getUTCFullYear()
    });
  }

  maxDaysPerMonth(month, year) {
    const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month === 1) {
      if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
        return 29;
      }
    }
    return daysPerMonth[month];
  }

  handleClickDatePickers(event) {
    if (event.target.matches('.right-btn')) {
      this.increase(event.target.getAttribute('for'));
    } else if (event.target.matches('.left-btn')) {
      this.decrease(event.target.getAttribute('for'));
    }
  }

  increase(target) {
    if (target === 'month') {
      const maxDays = this.maxDaysPerMonth((this.state.month + 1) % 12, this.state.year);
      this.setState({
        month: (this.state.month + 1) % 12,
        date: Math.min(maxDays, this.state.date)
      });
    } else if (target === 'date') {
      const maxDays = this.maxDaysPerMonth((this.state.month) % 12, this.state.year);
      this.setState({
        date: ((this.state.date) % maxDays) + 1
      });
    } else if (target === 'year') {
      this.setState({
        year: this.state.year + 1 > this.date.getUTCFullYear() ? 2021 : this.state.year + 1
      });
    }
  }

  decrease(target) {
    if (target === 'month') {
      const newMonth = (this.state.month - 1 < 0 ? 11 : this.state.month - 1) % 12;
      const maxDays = this.maxDaysPerMonth(newMonth, this.state.year);
      this.setState({
        month: newMonth,
        date: Math.min(maxDays, this.state.date)
      });
    } else if (target === 'date') {
      const maxDays = this.maxDaysPerMonth((this.state.month) % 12, this.state.year);
      const newDate = this.state.date - 1 < 1 ? maxDays : this.state.date - 1;
      this.setState({
        date: newDate
      });
    } else if (target === 'year') {
      this.setState({ year: this.state.year - 1 < 2021 ? this.date.getUTCFullYear() : this.state.year - 1 });
    }
  }

  render() {
    return (
      <>
        <div className="row" onClick={this.handleClickDatePickers}>
          <div className="col-full date-pickers">
            <div className="month-picker">
              <button className='left-btn' htmlFor='month'>
                <i className="fas fa-chevron-left"></i>
              </button>
              {this.context.monthNames[this.state.month]}
              <button className='right-btn' htmlFor='month' >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
            <div className="date-picker">
              <button className='left-btn' htmlFor='date'>
                <i className="fas fa-chevron-left"></i>
              </button>
              {this.state.date}
              <button className='right-btn' htmlFor='date' >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
            <div className="year-picker">
              <button className='left-btn' htmlFor='year'>
                <i className="fas fa-chevron-left"></i>
              </button>
              {this.state.year}
              <button className='right-btn' htmlFor='year' >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="row gallery">

        </div>
      </>
    );
  }
}

Browse.contextType = AppContext;
