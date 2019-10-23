import { Input, Button, Switch } from '@grafana/ui';
import React from 'react';
import './style/HandleThresholds.css';

export interface DynamicInput {
  thresHoldMax?: string;
  thresHoldMin?: string;
  trendMax?: string;
  trendMin?: string;
  showThreshold: boolean;
  showTrend: boolean;
  defaultValues: boolean;
}

interface DynamicProps {
  onSubmitThresholdHandler?: any;
  onSubmitTrendHandler?: any;
}

export default class DynamicThresholds extends React.Component<DynamicProps, DynamicInput> {
  state: DynamicInput = {
    thresHoldMax: '0.7',
    thresHoldMin: '0.4',
    trendMax: '0.03',
    trendMin: '-0.03',
    showThreshold: false,
    showTrend: false,
    defaultValues: true,
  };


  handleThresholdSubmit(e: any) {
    e.preventDefault();
    this.setState({
      defaultValues: false,
    });
    this.props.onSubmitThresholdHandler([this.state.thresHoldMax, this.state.thresHoldMin]);
  }

  handleTrendSubmit(e: any) {
    e.preventDefault();
    this.setState({
      defaultValues: false,
    });
    this.props.onSubmitTrendHandler([this.state.trendMax, this.state.trendMin]);
    console.log(`trend changed`);
  }

  changeThreshold = () => {
    this.setState({
      showThreshold: !this.state.showThreshold ? true : false,
    });
  };

  changeTrend = () => {
    this.setState({
      showTrend: !this.state.showTrend ? true : false,
    });
  };

  restToDeafult = () => {
    this.setState({
      defaultValues: true,
      thresHoldMax: '0.7',
      thresHoldMin: '0.4',
      trendMax: '0.03',
      trendMin: '-0.03',
      showThreshold: false,
      showTrend: false,
    });
    console.log(
      `Threshold changed max ${this.state.thresHoldMax} , threshold Min ${
        this.state.thresHoldMin
      } , trend min/max ${this.state.trendMin}`,
    );
    this.props.onSubmitThresholdHandler([this.state.thresHoldMax, this.state.thresHoldMin]);
    this.props.onSubmitTrendHandler([this.state.trendMax, this.state.trendMin]);
  };

  render() {
    const {
      defaultValues,
      showTrend,
      showThreshold,
      trendMax,
      trendMin,
      thresHoldMax,
      thresHoldMin,
    } = this.state;

    const threshold = showThreshold ? (
      <div style={{ marginRight: '10%' }}>
        <form
          className="from-style"
          onSubmit={e => this.handleThresholdSubmit(e)}>
          Min
          <Input
            value={thresHoldMin}
            type="text"
            onChange={e => this.setState({ thresHoldMin: e.target.value })}/>
          Max
          <Input
            value={thresHoldMax}
            type="text"
            onChange={e => this.setState({ thresHoldMax: e.target.value })}/>
          <Button onSubmit={this.changeThreshold} type="submit">
            add
          </Button>
        </form>
      </div>
    ) : null;

    const trend = showTrend ? (
      <div>
        <form className="from-style" onSubmit={e => this.handleTrendSubmit(e)}>
          Min
          <Input
            value={trendMin}
            type="text"
            onChange={e => this.setState({ trendMin: e.target.value })}/>
          Max
          <Input
            value={trendMax}
            type="text"
            onChange={e => this.setState({ trendMax: e.target.value })}/>
          <Button type="submit"> add </Button>
        </form>
      </div>
    ) : null;

    return (
      <div
        title="On/Show values.
        Off/hide Value.
        Default/rest default"
        className="main-holder ">
        <Switch
          label="Threshold"
          checked={showThreshold}
          onChange={this.changeThreshold}/>
        {threshold}
        <Switch label="Trend" checked={showTrend} onChange={this.changeTrend}/>
        {trend}
        <Switch
          label="Default"
          checked={defaultValues}
          onChange={this.restToDeafult}
        />
      </div>
    );
  }
}
