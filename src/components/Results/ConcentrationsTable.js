
import React, {
    Component
} from "react";
import BootstrapTable from "react-bootstrap-table-next";
import axios from "axios";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import filterFactory, {
    textFilter,
    selectFilter,
    numberFilter,
    Comparator
} from "react-bootstrap-table2-filter";
import ReactDOM from "react-dom";
import {
    Input,
    Col,
    Row,
    Select,
    InputNumber,
    DatePicker,
    AutoComplete,
    Cascade,
    Button
} from "antd";
import "antd/dist/antd.css";
import Chart3 from "./Chart3.js";
import { Slider } from "antd";
import { withRouter } from "react-router";

import './ConcentrationsTable.css';




const selectRow2 = {
    mode: "checkbox", // single row selection
    selected: [],

};


const selectRow = {
    mode: "checkbox",
    selected: [],
    onSelect: (row, isSelect, rowIndex, e) => {
  		console.log(selectRow["selected"]);
  		row["selected"] = isSelect;
  		
  		/*
  		if(isSelect){
  			selectRow['selected'].push(row["key"])
  		}
  		else
  		{
  			selectRow['selected'].splice(selectRow['selected'].indexOf(row["key"]),1)
  		}
  		//selectRow['selected'][rowIndex] = isSelect
  		console.log(row['key'])
  		console.log(rowIndex)
  		console.log(isSelect)
  		console.log(e)
  		console.log(selectRow['selected'])
  		*/
    // ...
    },
    onSelectAll: (isSelect, rows, e) => {

        for (var i = rows.length - 1; i >= 0; i--){
            rows[i]["selected"] = isSelect;
        }
    },
    // status available value is checked, indeterminate and unchecked
};


const tanitomo_marks = {
    0.65: "0",
    26: "26°C",
    37: "37°C",
    40: {
        style: {
            color: "#f50",
        },
        label: <strong>30</strong>,
    },
};


function round(value, decimals) {
    return Number(Math.round(value+"e"+decimals)+"e-"+decimals);
}

class DecimalStep extends React.Component {
  state = {
      inputValue: 0,
  };

  onChange = value => {
      if (Number.isNaN(value)) {
          return;
      }
      this.setState({
          inputValue: value,
      });
  };

  render() {
      const { inputValue } = this.state;
      return (
          <Row>
              <Col span={12}>
                  <Slider
                      min={0}
                      max={1}
                      onChange={this.onChange}
                      value={typeof inputValue === "number" ? inputValue : 0}
                      step={0.01}
                  />
              </Col>
              <Col span={4}>
                  <InputNumber
                      min={0}
                      max={1}
                      style={{ marginLeft: 16 }}
                      step={0.01}
                      value={inputValue}
                      onChange={this.onChange}
                  />
              </Col>
          </Row>
      );
  }
}

const selectOptions = {
    "Stationary Phase": "Stationary Phase",
    "Log Phase": "Log Phase",

};



const InputGroup = Input.Group;
const {
    Option
} = Select;




class Consensus extends Component {

    constructor(props) {
        super(props);
        this.state = {
            consensus: [],

            columns_mean: [{
                dataField: "mean",
                text: "Mean Concentration (µM)"
            }, {
                dataField: "uncertainty",
                text: "Uncertainty (µM)"
            }, ]

        };
        this.setMean = this.setMean.bind(this);
    }


    setMean(data) {
        var total_conc = 0;
        for (var i = data.length - 1; i >= 0; i--){
            console.log(data[i]);
            total_conc = total_conc + parseFloat(data[i].concentration);
        }
        var average_conc = round((total_conc/data.length), 3);
        this.setState({consensus : [{
            mean:average_conc
        }]});

    }

    componentDidMount(){
        this.setMean(this.props.data);
        //this.refs.taxonCol.applyFilter(28)
    }

    componentWillReceiveProps(nextProps) {
	  // You don't have to do this check first, but it can help prevent an unneeded render
	    console.log(nextProps.data);
	    this.setMean(nextProps.data);
	  
    }



    render() {

        return (
            <div className="Consensus" >

                <BootstrapTable 
	        striped
	        hover
	        keyField='id' 
	        data={ this.state.consensus } 
	        columns={ this.state.columns_mean }
	     />

            </div>
        );
    }


}


const defaultSorted = [{
    dataField: "taxonomic_proximity", // if dataField is not match to any column you defined, it will be ignored.
    order: "asc" // desc or asc
}];

class ConcentrationsTable extends Component {
    constructor(props) {
        super(props);
		
        this.state = {
            asked_consensus: false,
            advanced: false,
            tanitomo: false,
            consensus_prompt: "Get Consensus",
            json_data: "",

            f_concentrations: [],
            displayed_data:[],

            columns: [{
                dataField: "concentration",
                text: "Conc. (µM)",
            }, {
                dataField: "error",
                text: "Error"
            }, {
                dataField: "name",
                text: "Molecule",
                filter: textFilter(),

            }, {
                dataField: "organism",
                text: "Organism",
                filter: textFilter(),
            },{
                dataField: "taxonomic_proximity",
                text: "Taxonomic Distance",

                headerStyle: (colum, colIndex) => {
                    return { width: "20px", textAlign: "left" };	},

                filter: numberFilter({placeholder: "custom placeholder",
                    defaultValue: { comparator: Comparator.LE, number:1000}, //ref:this.node,
                    getFilter: (filter) => this.taxon_filter = filter,
                }),
                sort:true
            },], 


            advanced_columns: [{
                dataField: "growth_phase",
                text: "Growth Phase",
                formatter: cell => selectOptions[cell],
                filter: selectFilter({
                    options: selectOptions
                })
            }, {
                dataField: "growth_conditions",
                text: "Conditions",
                filter: textFilter(),

            }, {
                dataField: "growth_media",
                text: "Media",
                filter: textFilter(),

            }, ],

            tanitomo_column: [{
                dataField: "tanitomo_similarity",
                text: "Tanitomo Score",
                headerStyle: (colum, colIndex) => {
                    return { width: "20px", textAlign: "left" };	},
                filter: numberFilter({placeholder: "custom placeholder",
                    defaultValue: { comparator: Comparator.GE, number:0.5}, //ref:this.node,
                    getFilter: (filter) => this.tanitomo_filter = filter,
                }),

            }],



            marks:{},
            numToNode:{0:0},
            sliderLen:100

        };

        this.formatData = this.formatData.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.formatSlider = this.formatSlider.bind(this);
        this.formatter = this.formatter.bind(this);
        this.filter_taxon = this.filter_taxon.bind(this);
        this.filter_tanitomo = this.filter_tanitomo.bind(this);
        this.handleAbstractInner = this.handleAbstractInner.bind(this);
        console.log("made");
    }



    formatData(data) {
        console.log(data);
        if (data != null) {
            var f_concentrations = [];

            for (var n=data[0].length; n>0; n--){

                if ((data[0][n-1].tanitomo_similarity) < 1){
                    this.setState({tanitomo:true});
                }
                else{
                    this.setState({tanitomo:false});
                }
			
                var concs = data[0][n-1].concentrations;
                console.log(concs);
                if (concs != null) {
                    if (!Array.isArray(concs.concentration)){
                        for (var key in concs) {
						    // check if the property/key is defined in the object itself, not in parent
						    if (concs.hasOwnProperty(key)) {           
						        concs[key] = [concs[key]];
						    }
                        }
                    }
                    for (var i = concs.concentration.length - 1; i >= 0; i--) {
                        var growth_phase = "";
                        var organism = "Escherichia coli";

                        if (concs.growth_status[i] != null) {
                            if (concs.growth_status[i].toLowerCase().indexOf("stationary") >= 0) {
                                growth_phase = "Stationary Phase";
                            } else if (concs.growth_status[i].toLowerCase().indexOf("log") >= 0) {
                                growth_phase = "Log Phase";
                            }
                        }
                        if ("strain" in concs){
                            if (concs.strain != null){
                                if (concs.strain[i] != null) {
                                    organism = organism + " " + concs.strain[i];
                                }
                            }
                        }

                        f_concentrations.push({
                            name: data[0][n-1].name,
                            "concentration": parseFloat(concs.concentration[i]),
                            "units": concs.concentration_units[i],
                            "error": concs.error[i],
                            "growth_phase": growth_phase,
                            "organism": organism,
                            "growth_conditions": concs.growth_system[i],
                            growth_media: concs.growth_media[i],
                            "taxonomic_proximity": data[0][n-1].taxon_distance,
                            "tanitomo_similarity": data[0][n-1].tanitomo_similarity
                        });
                    }
                }
            }

            for (var n=data[1].length; n>0; n--){

                if ((data[1][n-1].tanitomo_similarity) < 1){
                    this.setState({tanitomo:true});
                }
			
                var concs = data[1][n-1].concentrations;
                if (concs != null) {
                    if (!Array.isArray(concs.concentration)){
                        for (var key in concs) {
						    // check if the property/key is defined in the object itself, not in parent
						    if (concs.hasOwnProperty(key)) {           
						        concs[key] = [concs[key]];
						    }
                        }
                    }
                    for (var i = concs.concentration.length - 1; i >= 0; i--) {

                        var growth_phase = "";
                        var organism = data[1][n-1].species;
                        if ("strain" in concs){
                            if (concs.strain != null){
                                if (concs.strain[i] != null) {
                                    organism = organism + " " + concs.strain[i];
                                }
                            }
                        }

                        f_concentrations.push({
                            name: data[1][n-1].name,
                            "concentration": parseFloat(concs.concentration[i]),
                            "units": concs.concentration_units[i],
                            "error": concs.error[i],
                            "growth_phase": growth_phase,
                            "organism": organism,
                            "growth_media": concs.growth_media[i],
                            "taxonomic_proximity": data[1][n-1].taxon_distance,
                            "tanitomo_similarity": data[1][n-1].tanitomo_similarity
                        });
                    }
                }
            }


            for (var i = f_concentrations.length - 1; i >= 0; i--) {
                f_concentrations[i]["key"] = i;
                selectRow["selected"].push(i);
                f_concentrations[i]["selected"] = true;
            }


            this.setState({
                f_concentrations: f_concentrations,
                //displayed_data: f_concentrations
            });
        } else {
            alert("Nothing Found");
        }



    }

    filter_taxon(value){
        this.taxon_filter(({
		    number: value,
		    comparator: Comparator.LE
		  }));
    }

    filter_tanitomo(value){
        this.tanitomo_filter(({
		    number: value,
		    comparator: Comparator.GE
		  }));
    }

    formatSlider(data){

        const lineage = data[2][0];
        this.setState({sliderLen:lineage.length-1});


        var new_marks = {};
        var new_numToNode = {};
        var n = lineage.length-1;
        for (var i = 0; i < lineage.length; i++) {
            new_numToNode[i] = lineage[n];
            new_marks[i] = i;
            n--;
        }

        this.setState({
            numToNode:new_numToNode,
            marks:new_marks});

    }

    formatter(value) {
        if (this.state.numToNode[value]){
            return `${this.state.numToNode[value]}`;
        }
        else{
            return `${""}`;
        }
    }


    componentDidMount(){
        if (this.props.json_data){
            this.formatData(this.props.json_data);
            this.formatSlider(this.props.json_data);
			 
        }
    }

    componentDidUpdate (prevProps) {
        console.log("updating");
        if (this.props.json_data != prevProps.json_data){
            console.log("not equal");
            console.log(this.props.json_data);
		    this.formatData(this.props.json_data);
		    this.formatSlider(this.props.json_data);
        }
    }





    handleUpdate() {
        this.setState({
            asked_consensus:true,
            consensus_prompt:"Update Consensus"
        });
        this.setState({displayed_data:this.node.table.props.data});
        console.log(this.node.table);
    };

    handleSlider(value) {
	  console.log("onChange: ", value);
	  //this.filter_taxon;
    }

    handleAbstractInner(){
        this.props.handleAbstract();
    }



    render() {

        let selected = [];
        for (var i = this.state.f_concentrations.length - 1; i >= 0; i--) {
            if (this.state.f_concentrations[i]["selected"])
                selected.push(this.state.f_concentrations[i]["key"]);
        }
        selectRow["selected"] = selected;

        let display_columns;

        display_columns = this.state.columns;

        if (this.state.tanitomo){
            console.log("tanitomo!");
            display_columns = display_columns.concat(this.state.tanitomo_column);
        }


        let b_title;
		
        let next;
        if (!this.state.advanced){
            b_title = "Advanced";
            next = true;
        }
        else{
            b_title = "Basic";
            display_columns = display_columns.concat(this.state.advanced_columns);
            console.log(display_columns);
            next=false;
        }


        let styles = {

	    backgroundColor: "#ccf2ff",

	  };



	  let selected_data = [];
	  for (var i = this.state.displayed_data.length - 1; i >= 0; i--) {
	  	if (this.state.displayed_data[i].selected){
	  		selected_data.push(this.state.displayed_data[i]);
	  	}
	  }


        return (


            <div className="total_table">
	      <div className="slider" >
	      Taxonomic Distance
		      <div className="slider_bar" >
		      <Slider marks={this.state.marks} defaultValue={this.state.sliderLen} tipFormatter={this.formatter} onChange={this.filter_taxon} max={this.state.sliderLen}/>
		      </div>
		  <br>
	      </br>
	      Molecular Similarity
	      <div className="slider_bar2" >
	      {!(this.state.tanitomo) &&
		      <Button type="primary" onClick={this.handleAbstractInner}> Abstract </Button> 
		   }
	      	
	      	{this.state.tanitomo &&
		      <Slider step={0.01} defaultValue={0.65} min={0.65} max={1} onChange={this.filter_tanitomo}/>
		   }

	      </div>


	      <br />
	      <br />
	      </div>
	      <div className="results" >
		      <div className="concTable" >
		      	<img src={require("~/images/result.png")} />
		      	<Button type="primary" onClick={(event)=>this.setState({advanced:next})}> {b_title} </Button>


		      	<div className="bootstrap" >
		        <BootstrapTable 
		        ref={ n => this.node = n }
		        striped
		        hover
		        keyField='key' 
		        data={ this.state.f_concentrations } 
		        columns={ display_columns }
		        filter={ filterFactory() }
		        defaultSorted = {defaultSorted}
		        selectRow={ selectRow}

		     />
		     </div>


		     </div>
		     <div className="consensus">
		     	<img src={require("~/images/consensus.png")} />
		      	<Button type="primary" onClick={(event)=>this.handleUpdate()}> {this.state.consensus_prompt} </Button>
		      	{this.state.asked_consensus &&
		      		<Consensus data={selected_data}/> 		
		      	}
		      	<br />
		      	{this.state.asked_consensus &&
		      		<Chart3 original_data={this.state.f_concentrations} data={selected_data}/>
		      	}

		     </div>
	      </div>
            </div>
        );
    }
}

export default withRouter(ConcentrationsTable);