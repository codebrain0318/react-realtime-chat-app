import Drawer from "material-ui/Drawer";
import RaisedButton from "material-ui/RaisedButton";
import muiThemeable from "material-ui/styles/muiThemeable";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import MobileTearSheet from 'app/api/MobileTearSheet.js';
import Badge from 'material-ui/Badge';
import {List, ListItem, makeSelectable} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import FileFolder from 'material-ui/svg-icons/file/folder';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import {grey400, darkBlack, lightBlack,blue300} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
var Infinite = require('react-infinite');
import { Scrollbars } from 'react-custom-scrollbars';
import Msgbar from 'app/components/toolbars/msgtoolbar.jsx';
import Toolbar from "app/components/toolbar.jsx";
import Boards from "app/components/Note.jsx";
import TimeTable from "app/components/dashboard/timetable.jsx";
import Events from "app/components/dashboard/events.jsx";
import Main from "app/components/main.jsx";
import { observer } from "mobx-react";
import ListMessages from "app/components/listmessages.jsx";
import Chat from "app/components/chat.jsx";
import Board from "app/components/board.jsx";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import { cyan500 } from "material-ui/styles/colors";
import { greenA400 } from "material-ui/styles/colors";
import UserStore from "app/store/UserStore.js";
import axios from 'axios';


let SelectableList = makeSelectable(List);

function wrapState(ComposedComponent) {
  return class SelectableList extends Component {
    static propTypes = {
      children: PropTypes.node.isRequired,
      defaultValue: PropTypes.number.isRequired,
    };

    componentWillMount() {
      this.setState({
        selectedIndex: this.props.defaultValue,
      });
    }

    handleRequestChange = (event, index) => {
      this.setState({
        selectedIndex: index,
      });
    };

    render() {
      return (
        <ComposedComponent
          value={this.state.selectedIndex}
          onChange={this.handleRequestChange}
        >
          {this.props.children}
        </ComposedComponent>
      );
    }
  };
}

SelectableList = wrapState(SelectableList);



const iconButtonElement = (
  <IconButton
    touch={true}
    tooltip="more"
    tooltipPosition="bottom-left"
  >
    <MoreVertIcon color={grey400} />
  </IconButton>
);

const rightIconMenu = (
  <IconMenu iconButtonElement={iconButtonElement}>
    <MenuItem>Reply</MenuItem>
    <MenuItem>Delete</MenuItem>
    <MenuItem>Details</MenuItem>
  </IconMenu>
);

const style = {
  height: '100%',
}
    var listmap;
let users = [];


@observer
export default class ListChatContainer extends React.Component {
  constructor(props) {
    super(props);

this.onChange = this.onChange.bind(this);

    this.state = {
      listy: false,
    };


      }



onChange = () => {
  this.setState({listy: true,});
}

componentDidMount() {

   $.ajax({
    type: 'GET',
    url: '/api/userall'
    })
  .done(function(data) {
// console.log(data)  
users = data;
console.log("users");
console.log(users);
UserStore.allUsers = users;
UserStore.listy=true;
   this.onChange

this.forceUpdate
})
  .fail(function(jqXhr) {
    console.log('failed to register');
  });

}

  render() {
  

 const liststatus = UserStore.listy;


return(
 
 <div>
 
 <div className="margin" style={style}>
    <MobileTearSheet>

<Msgbar/>
<input type="search" placeholder="Search Messages here....."/>
             <Subheader>Today</Subheader>

 <Scrollbars  autoHeightMin={0} style={{ height: '100vh' }}
        autoHeightMax={50}
        thumbMinSize={50} >

  {liststatus ? (
           <div>
{users.map(Users => {
              return (
  
 <SelectableList defaultValue={3}>
                <div className="" key={Users.user_id}>

        <ListItem   value={4}
            leftAvatar={
        <Avatar
          size={40} src={Users.picture}
        >       
 <Badge   badgeContent={4}
      primary={true}/>
         </Avatar>
      }
                
       rightIconButton={rightIconMenu}
          primaryText={Users.name}
            
                 secondaryText={
            <p>
          {Users.picture}
            </p>
          }
          secondaryTextLines={2}
         
        />
      </div>


        <Divider inset={true} />
             </SelectableList>

              );

            })}
</div>
      ) : (
<div></div> 


      )} 


   <br/>
   <br/>
   <br/>
   <br/>       

        <br/>
   <br/>
   <br/>
   <br/>
   <br/>
   <br/>
   <br/>
   <br/>



  {/*</Infinite>*/}
      </Scrollbars>

    </MobileTearSheet>

  </div>
); </div>
    
);

  }
}



//     <SelectableList defaultValue={3}>

//         <ListItem   value={4}
//             leftAvatar={
//         <Avatar
//           color={blue300}
//           backgroundColor={darkBlack}
//           size={40}
//         >
//         U         
//  <Badge   badgeContent={4}
//       primary={true}/>
//          </Avatar>
//       }
                
//        rightIconButton={rightIconMenu}
//           primaryText="Uni Group"
       
//           secondaryText={
//             <p>
//               <span style={{color: darkBlack}}>Seen WestWorld?</span><br />
//               I&apos;So in the finale we see Dolores 
//             </p>
//           }
//           secondaryTextLines={2}
//         />


//         <Divider inset={true} />
            //  </SelectableList>