/* global fetch */
import 'babel-polyfill';
import React from 'react';
import moment from 'moment';
import MG from 'metrics-graphics';
import Graphic from '../graphic';
import Score from '../score';

export default class FirefoxAdiCrashes extends React.Component {
  state = {
    data: null,
    markers: null,
    baselines: null,
    avg: 0,
  };

  componentDidMount() {
    this.fetch();
  }

  async fetch() {
    const crashes = await (await fetch('/api/crashes/adi')).json();
    const data = MG.convert.date(crashes, 'date');
    const releases = await (await fetch('/api/release/history?tailVersion=5')).json();
    const markers = releases.map((entry) => {
      const version = entry.version;
      // if (!/\.0$/.test(version)) {
      //   version = version.slice(-2);
      // }
      return {
        date: moment(entry.date, 'YYYY MM DD').toDate(),
        label: version,
      };
    });
    const baseline = '2016-01-17'; // [0.75, 1.08];
    this.setState({ data, markers, baseline });
  }

  render() {
    return (
      <div className='row'>
        <header>
          <span>Firefox Crashes / 100 ADI</span>
        </header>
        <Graphic
          {...this.state}
          x_accessor='date'
          y_accessor='rate'
          min_y='0.6'
          max_y='1.4'
          cleaned
        />
        <Score data={this.state.data} />
      </div>
    );
  }
}
