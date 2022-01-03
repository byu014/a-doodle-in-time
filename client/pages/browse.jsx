import React from 'react';
import AppContext from '../lib/app-context';
import DrawingCard from '../components/drawing-card';
import axios from 'axios';

export default class Browse extends React.Component {
  constructor(props) {
    super(props);
    this.date = new Date();
    this.earliestYear = 2021;

    this.state = {
      month: this.date.getUTCMonth(),
      date: this.date.getUTCDate(),
      year: this.date.getUTCFullYear(),
      galleryCards: null,
      changed: false
    };

    this.increase = this.increase.bind(this);
    this.decrease = this.decrease.bind(this);
    this.handleClickDatePickers = this.handleClickDatePickers.bind(this);
    this.renderGallery = this.renderGallery.bind(this);
  }

  componentDidMount() {
    this.renderGallery();
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
    this.setState({ changed: true });
  }

  // recursively increases corresponding values as well when selected target value loops to beginning/end
  // caps the date to the current date/month/year when attempting to go beyond current date
  increase(target) {
    if (target === 'month') {
      const newMonth = (this.state.month + 1) % 12;
      const maxDays = this.maxDaysPerMonth(newMonth, this.state.year);
      let newYear = this.state.year;
      if (newMonth === 0) {
        if (this.state.year === this.date.getUTCFullYear()) return;
        this.increase('year');
        newYear = this.state.year + 1 > this.date.getUTCFullYear() ? this.date.getUTCFullYear() : this.state.year + 1;
      }
      this.setState({
        month: newYear === this.date.getUTCFullYear() ? Math.min(newMonth, this.date.getUTCMonth()) : newMonth,
        date: newYear === this.date.getUTCFullYear() ? Math.min(maxDays, this.state.date, this.date.getUTCDate()) : Math.min(maxDays, this.state.date)
      });
    } else if (target === 'date') {
      const maxDays = this.maxDaysPerMonth((this.state.month) % 12, this.state.year);
      const newDate = ((this.state.date) % maxDays) + 1;
      if (this.state.date === maxDays) {
        if (this.state.month === 11 && this.state.year === this.date.getUTCFullYear()) return;
        this.increase('month');
      }
      this.setState({
        date: this.state.year === this.date.getUTCFullYear() ? Math.min(newDate, this.date.getUTCDate()) : newDate
      });
    } else if (target === 'year') {
      const newYear = this.state.year + 1 > this.date.getUTCFullYear() ? this.date.getUTCFullYear() : this.state.year + 1;
      const maxDays = this.maxDaysPerMonth(this.state.month, newYear);
      this.setState({
        year: newYear,
        date: newYear === this.date.getUTCFullYear() ? Math.min(maxDays, this.state.date, this.date.getUTCDate()) : Math.min(maxDays, this.state.date),
        month: newYear === this.date.getUTCFullYear() ? Math.min(this.state.month, this.date.getUTCMonth()) : this.state.month
      });
    }
  }

  decrease(target) {
    const { earliestYear } = this;
    if (target === 'month') {
      const newMonth = (this.state.month - 1 < 0 ? 11 : this.state.month - 1) % 12;
      const maxDays = this.maxDaysPerMonth(newMonth, this.state.year);
      if (newMonth === 11) {
        if (this.state.year === earliestYear) return;
        this.decrease('year');
      }
      this.setState({
        month: newMonth,
        date: Math.min(maxDays, this.state.date)
      });
    } else if (target === 'date') {
      const newMonth = (this.state.month - 1 < 0 ? 11 : this.state.month - 1) % 12;
      const maxDays = this.maxDaysPerMonth(newMonth, this.state.year);
      const newDate = this.state.date - 1 < 1 ? maxDays : this.state.date - 1;
      if (this.state.date === 1) {
        if (this.state.month === 0 && this.state.year === earliestYear) return;
        this.decrease('month');
      }
      this.setState({
        date: newDate
      });
    } else if (target === 'year') {
      const newYear = this.state.year - 1 < earliestYear ? earliestYear : this.state.year - 1;
      const maxDays = this.maxDaysPerMonth(this.state.month, newYear);
      this.setState({ year: newYear, date: Math.min(maxDays, this.state.date) });
    }
  }

  async renderGallery() {
    try {
      const fullDate = `${this.state.year}-${((this.state.month) % 12 + 1)}-${this.state.date}`;
      const response = await axios.get(`/api/doodles/${fullDate}`);
      const galleryCards = response.data.map(doodle => {
        return (
          <li key={doodle.doodleId} className="li-card">
            <a className='a-card' href={`#view?doodleId=${doodle.doodleId}`}>
              <DrawingCard
                dataUrl={doodle.dataUrl}
                title={doodle.title}
                username={doodle.username}
                pfpUrl={doodle.pfpUrl}
                userId={doodle.userId}
                doodleId={doodle.doodleId}
                size='large'
              />
            </a>
          </li>
        );
      });
      this.setState({ galleryCards, changed: false });
    } catch (err) {
      console.error(err);
      return <div></div>;
    }
  }

  render() {
    if (this.state.changed) {
      this.renderGallery();
    }
    return (
      <>
        <div className="row" onClick={this.handleClickDatePickers}>
          <div className="col-full date-pickers">
            <div className="month-picker">
              <button className='left-btn' htmlFor='month'>
                <i className="fas fa-chevron-left"></i>
              </button>
              <p className='date-pickers-text'>
                {this.context.monthNames[this.state.month]}
              </p>
              <button className='right-btn' htmlFor='month' >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
            <div className="date-picker">
              <button className='left-btn' htmlFor='date'>
                <i className="fas fa-chevron-left"></i>
              </button>
              <p className='date-pickers-text'>
                {this.state.date}
              </p>
              <button className='right-btn' htmlFor='date' >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
            <div className="year-picker">
              <button className='left-btn' htmlFor='year'>
                <i className="fas fa-chevron-left"></i>
              </button>
              <p className='date-pickers-text'>
                {this.state.year}
              </p>
              <button className='right-btn' htmlFor='year' >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="row gallery-row">
            <ul className="col-full gallery">
              {this.state.galleryCards}
            </ul>
        </div>
      </>
    );
  }
}

Browse.contextType = AppContext;
