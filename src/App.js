import React from 'react'
import * as d3 from  'd3';
import * as moment from  'moment';
import './styles/App.css'
import Chart from './chart/Chart'
import Denny from './data/denny.csv';
import Love from './data/love.csv';
import Kay from './data/kay.csv';
import Ho from './data/ho.csv';
import Harry from './data/harry.csv';

var totalData =[]
var monthData =[]
var weekData =[]
export default class App extends React.Component{
  constructor(){
    super()

    this.state={
      employees : [Denny,Love,Ho,Kay,Harry],
      empdata : [],
      monthlyData :[],
      weeklyData :[],
      backupempData :[],
      availableMonths : ["01","02","03","04","05","06","07","08","09","10","11","12"],
      weeklyStatus : false,
      monthlyStatus : true,
      weekNo : -1,
      monthNo : "08"
    }
  }
  
  async componentDidMount(){
    await this.state.employees.map(name=>{
      this.getData(name) 
   })
  }

  async getData(name){
    var json = [];
    let temp=[];
    let totData =[]
    await d3.csv(name, function(data) {
      let row = {};
      data.startDate = moment(data.startDate, "MM-DD-YYYY").format("MM-DD-YYYY");
      data.stopDate = moment(data.stopDate, "MM-DD-YYYY").format("MM-DD-YYYY");
      data.startTime= moment(data.startTime+data.A, ["h:mm A"]).format("HH:mm");
      data.stopTime= moment(data.stopTime+data.P, ["h:mm A"]).format("HH:mm");
      row.start = data.startDate +" "+ data.startTime;
      row.stop = data.stopDate + " "+ data.stopTime;
      row.startDate = data.startDate;
      row.month = data.startDate.split("-")[0]
      json.push(row);
    });
  var groupDates = await d3.nest()
  .key(function(d) { return d.startDate; })
  .rollup(function(v){
    let min =d3.min(v,function(d){ return d.start});
    let max = d3.max(v,function(d){ return d.stop});
    let hours = moment.utc(moment(max,"MM-DD-YYYY HH:mm").diff(moment(min,"MM-DD-YYYY HH:mm"))).format("HH:mm");
    let month = min.split("-")[0];
    hours = parseInt(hours.split(":")[0])+Math.round(parseFloat(hours.split(":")[1])/60);
    return {
      minDate : min,
      maxDate : max,
     hours : hours,
     month : month
    };
  })
  .entries(json);


   var monthlyDates = await d3.nest()
    .key(function(d) { return d.value.month; })
   .rollup()
   .entries(groupDates);

  monthData.push(monthlyDates)
  this.setState({monthlyData:(monthData)})

  await this.state.monthlyData.map((emp,)=>{
    var found=false
    emp.map(monthName=>{
      if(monthName.key==="08"){
        found=true;
        totData.push(monthName.values)
      }
    })
    if(!found)
    totData.push([]);
  })


  this.setState({empdata:(totData)})
  this.setState({backupempData:(totData)})
  let x = groupDates;
  while(x.length>0)
        temp.push(x.splice(0,7));
  weekData.push(temp);
  console.log(weekData);
  this.setState({weeklyData:(weekData)})
  }

  async showMonthData(event){
    totalData=[];
    let selMonth= event.target.value
    await this.state.monthlyData.map(emp=>{
      emp.map(monthName=>{
        if(monthName.key===selMonth){
            totalData.push(monthName.values)
        }
      })
    })
    if(totalData.length==0)
    {
      alert("No data found for selected month!")
      return;
    }
    this.setState({monthNo:(selMonth)})
    this.setState({empdata:(totalData)})
  }

  async showWeekly(event){

    if(!this.state.weeklyStatus){
      await this.setState((prev)=>({
        weeklyStatus:!prev.weeklyStatus
      }));
      document.getElementsByClassName("leftButton")[0].style.display='block';
      document.getElementsByClassName("rightButton")[0].style.display='block';
      this.nextWeek();
      document.getElementById("month_div").style.display='none';
      this.setState((prev)=>({
        monthlyStatus: !prev.monthlyStatus
      }))
    }
  }

  async showMonthly(){
    totalData=[]
    if(!this.state.monthlyStatus){
    await this.state.monthlyData.map(emp=>{
      var found=false;
      emp.map(monthName=>{
        if(monthName.key===this.state.monthNo){
          found=true
            totalData.push(monthName.values)
        }
      })
      if(!found)
      totalData.push([]);
    })
    document.getElementById("month_div").style.display='block';
    document.getElementsByClassName("leftButton")[0].style.display='none';
    document.getElementsByClassName("rightButton")[0].style.display='none';
    
    this.setState({empdata:(totalData)})
    this.setState((prev)=>({
      weeklyStatus:!prev.weeklyStatus
    }));
    this.setState((prev)=>({
      monthlyStatus: !prev.monthlyStatus
    }))
  }
  }


   async prevWeek(){
     var temp=[]
      if(this.state.weekNo!==0){
      await this.setState((prev)=>({
        weekNo : prev.weekNo-1
      }))

      var weekNum = this.state.weekNo;
      this.state.weeklyData.map(item=>{
          temp.push(item[weekNum])
      })
      console.log(temp)
      this.setState({
        empdata:temp
      })
    }
      console.log(this.state.weekNo)
  }

   async nextWeek(){
     var temp=[]

      await this.setState((prev)=>({
        weekNo : prev.weekNo+1
      }))
      var weekNum = this.state.weekNo;
      this.state.weeklyData.map(item=>{
          temp.push(item[weekNum])
      })
      console.log(temp)
      this.setState({
        empdata:temp
      })
      
  }

  render(){

    var styleButton ={
      textAlign:'center',
      marginTop : 10,

    }
    let months = this.state.availableMonths;
 return(
      <div className="App">
      <header>
        <h1>Employee Attendance Data</h1>
      </header>
      <hr/>
        <div style={styleButton}>
          <button onClick={this.showWeekly.bind(this)}  type="button" class="btn btn-primary" style={{margin:10}}>
          Weekly View
          </button>
          <button onClick={this.showMonthly.bind(this)}  type="button" class="btn btn-primary" style={{margin:10}}>
          Monthly View
          </button>
        </div>
        <br></br>
        <div style={{display:'block'}} id="month_div">
          <div style={styleButton} >
            <label>
              Select month: &nbsp;
            </label>
          <select onChange={this.showMonthData.bind(this)}>
          <option>

          </option>
              {months.map(item=>{
                return(<option id={item}>{item}</option>)
              })}
          </select>
          </div>
        </div>
        <div style={styleButton}>
          <h4>Currently showing :  {this.state.weeklyStatus?'Weekly data for weekNo-':'Monthly data for month number-'} 
          &nbsp;  {this.state.monthlyStatus?this.state.monthNo:this.state.weekNo+1}</h4>
       </div>
        <div className="App-chart-container">
          <div>
            <button onClick={this.prevWeek.bind(this)} style={{display:'none',float:'left'}} 
          type="button" className="leftButton btn btn-secondary">
            Previous
            </button>
            <button onClick={this.nextWeek.bind(this)} style={{display:'none',float:'right'}}
               type="button" className="rightButton btn btn-secondary">
             Next
             </button>
          </div>
          <Chart data={this.state.empdata} employees={this.state.employees}/>
          </div>
      </div>
          )
  }
}
  
