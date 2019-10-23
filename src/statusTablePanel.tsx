import React, { Component } from 'react';
import { PanelProps, ThemeContext } from '@grafana/ui';
import { transform } from './aggregationTransformer';
import { StatusTable } from './statusTable';
import DynamicThresholds from './thresHoldSubmit';


interface dProps extends PanelProps {
  data: any,

}

export interface dState {
  dynamicThreshold: any,
  dynamicTrend: any,

}

export class StatusTablePanel extends Component<dProps, dState> {

  constructor(props: dProps) {
    super(props);
    this.state = {
      dynamicThreshold: [0.7, 0.4],
      dynamicTrend: [0.03, -0.03],
    };
  }


  onSubmitThresholdData = (data) => {
    console.log('data ', data);
    this.setState({
      dynamicThreshold: data,
    });
    console.log(this.state.dynamicThreshold);
  };

  onSubmitTrendData = (data) => {
    console.log('data ', data);
    this.setState({
      dynamicTrend: data,
    });
    console.log(this.state.dynamicTrend);
  };


  render() {
    const { data, options } = this.props;
    console.log(data);
    if (data['series'][0]) {
      const { rows, fields } = transform(data['series'][0].rows, data['series'][0].fields, this.props.options);
      return (
        <span>

     <DynamicThresholds onSubmitTrendHandler={this.onSubmitTrendData}
                        onSubmitThresholdHandler={this.onSubmitThresholdData}/>
     <ThemeContext.Consumer>
        {theme =>
          <StatusTable dynamicTrend={this.state.dynamicTrend}
                       dynamicThreshold={this.state.dynamicThreshold} {...this.props} {...options} theme={theme}
                       data={{ rows, fields }}/>
        }
      </ThemeContext.Consumer>
        </span>);
    } else {
      return (
        <div className="no-data">No DATA to show 😞</div>
      );
    }
  }
}
  