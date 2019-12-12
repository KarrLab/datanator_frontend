import React, {Component} from 'react';
import { Consensus } from '~/components/Results/components/Consensus.js';

export default class CustomToolPanel extends Component {

    constructor(props) {
        super(props);

        this.state = {numMedals: 0, numGold: 0, numSilver: 0, numBronze: 0};

        // calculate stats when new rows loaded, i.e. onModelUpdated
        this.props.api.addEventListener('modelUpdated', this.updateTotals.bind(this));
    }

    render() {
        const totalStyle = {paddingBottom: '15px'};

        return (
            <div style={{textAlign: "center"}}>
                <span>
                    <Consensus 
              relevantColumns={['concentration']} 
              optional_columns = {[]}
              />
                </span>
            </div>
        );
    }

    updateTotals() {
        var numGold = 0, numSilver = 0, numBronze = 0;

        this.props.api.forEachNode(function (rowNode) {
            let data = rowNode.data;
            
            if (data.gold) numGold += data.gold;
            if (data.silver) numSilver += data.silver;
            if (data.bronze) numBronze += data.bronze;
        });

        let numMedals = numGold + numSilver + numBronze;
        this.setState({numMedals: numMedals, numGold: numGold, numSilver: numSilver, numBronze: numBronze});
    }}