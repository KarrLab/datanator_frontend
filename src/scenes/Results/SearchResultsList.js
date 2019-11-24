import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
}));

const results = [];

function generate(element) {
  return [0, 1, 2].map(value =>
    React.cloneElement(element, {
      key: value,
    }),
  );
}

function format_results(primary_text, secondary_text, url) {
  return (
    <ListItem padding={0}>
      <ListItemText secondary={secondary_text}>
        <a href={url}>{primary_text} </a>
      </ListItemText>
    </ListItem>
  );
}

export default class InteractiveList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reaction_results: [],
    };

    this.create_search_results = this.create_search_results.bind(this);
  }
  componentDidMount() {
    this.create_search_results();
  }

  componentDidUpdate(prevProps) {
    if (this.props.reaction_results != prevProps.reaction_results) {
      this.create_search_results();
    }
  }

  create_search_results() {
    console.log('SearchResultList: Calling create_search_results');
    let reaction_results = this.props.reaction_results;
    let protein_results = this.props.protein_results
    let new_reaction_results = [];
    let new_protein_results = [];
    for (var i = reaction_results.length - 1; i >= 0; i--) {
      new_reaction_results.push(
        format_results(
          reaction_results[i]['primary_text'],
          reaction_results[i]['secondary_text'],
          reaction_results[i]['url'],
        ),
      );
    }

      for (var i = protein_results.length - 1; i >= 0; i--) {
      new_protein_results.push(
        format_results(
          protein_results[i]['primary_text'],
          protein_results[i]['secondary_text'],
          protein_results[i]['url'],
        ),
      );


    }
    this.setState({ reaction_results: new_reaction_results,
    protein_results: new_protein_results });
  }

  render() {
    console.log('SearchResultList: Calling Render');
    console.log(this.props.reaction_results);

    //let url = "reaction/data/?substrates=AMP,ATP%20&products=%20ADP&substrates_inchi=ZKHQWZAMYRWXGA-KQYNXXCUSA-J,UDMBCSSLTHHNCD-KQYNXXCUSA-N&products_inchi=XTWYTFMLZFPYCI-KQYNXXCUSA-N"
    //add_results("ATP Synthetase", "ATP + AMP ==> ADP", url)

    //let url = "'/reaction/data/?substrates=AMP,ATP%20&products=%20ADP&substrates_inchi=ZKHQWZAMYRWXGA-KQYNXXCUSA-J,UDMBCSSLTHHNCD-KQYNXXCUSA-N&products_inchi=XTWYTFMLZFPYCI-KQYNXXCUSA-N"
    //add_results("ATP Synthetase", "ATP + AMP ==> ADP", url)
    //add_results("ATP Synthetase", "ATP + AMP ==> ADP", url)
    /*
  let reaction_results = this.state.reaction_results
  console.log(this.state.reaction_results)
  for (var i = reaction_results.length - 1; i >= 0; i--) {
    format_results(reaction_results[i]['primary_text'], reaction_results[i]['secondary_text'], reaction_results[i]['url'])
  }
  */

    return (
      <div className="google results">
        <Grid>
          <br />
          <Typography variant="h6" className={'green'}>
            Reactions
          </Typography>
          <div className="google results">
            <List disablePadding={true}>
                  {this.state.reaction_results}       
            </List>
          </div>

          <br />
          <Typography variant="h6" className={'green'}>
            Proteins
          </Typography>
          <div className="google results">
            <List disablePadding={true}>
                  {this.state.protein_results}       
            </List>
          </div>


        </Grid>
      </div>
    );
  }
}
