import React, { Component }  from 'react';
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

const results = []

function generate(element) {
  return [0, 1, 2].map(value =>
    React.cloneElement(element, {
      key: value,
    }),
  );
}


function add_results(primary_text, secondary_text, url){
  results.push(<ListItem>
    <ListItemIcon></ListItemIcon>
    <ListItemText secondary={secondary_text}>
      <a href={url}>{primary_text} </a>
    </ListItemText>
  </ListItem>)
}

export default class InteractiveList extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
    
  }

  render() {

  //let url = "reaction/data/?substrates=AMP,ATP%20&products=%20ADP&substrates_inchi=ZKHQWZAMYRWXGA-KQYNXXCUSA-J,UDMBCSSLTHHNCD-KQYNXXCUSA-N&products_inchi=XTWYTFMLZFPYCI-KQYNXXCUSA-N"
  //add_results("ATP Synthetase", "ATP + AMP ==> ADP", url)

  //let url = "'/reaction/data/?substrates=AMP,ATP%20&products=%20ADP&substrates_inchi=ZKHQWZAMYRWXGA-KQYNXXCUSA-J,UDMBCSSLTHHNCD-KQYNXXCUSA-N&products_inchi=XTWYTFMLZFPYCI-KQYNXXCUSA-N"
  //add_results("ATP Synthetase", "ATP + AMP ==> ADP", url)
  //add_results("ATP Synthetase", "ATP + AMP ==> ADP", url)
  let reaction_results = this.props.reaction_results
  for (var i = reaction_results.length - 1; i >= 0; i--) {
    add_results(reaction_results[i][0], reaction_results[i][1], reaction_results[i][2])
  }

  return (
    <div className="google results">
      <FormGroup row>
      </FormGroup>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <div>
            <List>
              {results}
            </List>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
}
