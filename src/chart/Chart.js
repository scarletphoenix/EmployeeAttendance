import React, { Component } from 'react'
import { scaleBand, scaleLinear } from 'd3-scale'
import Axes from './Axes'
import Bars from './Bars'
import ResponsiveWrapper from './ResponsiveWrapper'



class Chart extends Component {
  constructor(props) {
    super(props)
    this.xScale = scaleBand()
    this.yScale = scaleLinear()

    this.state={
      data : [],
      employees : []
    }
  }

  componentWillReceiveProps (nextProps){
    
    this.setState({
        data : nextProps.data,
        employees : nextProps.employees
    })
  }
  render() {
    const margins = { top: 50, right: 20, bottom: 100, left: 30 }
    let svgDimensions = {
      width: 800,
      height: 300
    }
    let maxValue = 24;
    var emp = this.state.employees;
    if(emp.length!==0)
    {
      var employeeNames =emp.map(item=>{
        return ((item.split("/")[3]).split(".")[0]).toUpperCase();
      })
    }

    let yScale = this.yScale
      .domain([0, maxValue])
      .range([svgDimensions.height - margins.bottom, margins.top]);

    const a =(this.state.data.map((dataItem,index)=>{
      if(dataItem===undefined)
        dataItem=[]
          let xScale = this.xScale
            .padding(0.5)
            .domain(dataItem.map(data => data.key))
            .range([margins.left, svgDimensions.width - margins.right]);
            
        return(
          <div>
            <br></br>
            <br></br>
           <p>Employee Name :{employeeNames[index]}</p>
          <svg width={svgDimensions.width} height={svgDimensions.height}>
        <Axes
          scales={{ xScale, yScale }}
          margins={margins}
          svgDimensions={svgDimensions}
        />
        <Bars
          scales={{ xScale, yScale }}
          margins={margins}
          data={dataItem}
          maxValue={maxValue}
          svgDimensions={svgDimensions}
        />
      </svg>
      
      </div>
        );
    })
    )
    return(
      <div>{a}</div>
    )
  }
}

export default ResponsiveWrapper(Chart)
