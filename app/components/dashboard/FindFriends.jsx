import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Avatar from "material-ui/Avatar";
import List from "material-ui/List/List";
import ListItem from "material-ui/List/ListItem";
import { Scrollbars } from "react-custom-scrollbars";
import FriendshipStore from "app/store/FriendshipsStore.js";
import Badge from "material-ui/Badge";
import NotificationsIcon from "material-ui/svg-icons/action/check-circle";
import Dialog from "material-ui/Dialog";
import Snackbar from "material-ui/Snackbar";
import { observer } from "mobx-react";
import { greenA400, red500 } from "material-ui/styles/colors";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import SearchInput, { createFilter } from "react-search-input";
import UserStore from "app/store/UserStore.js";
import FriendshipsStore from "app/store/FriendshipsStore.js";

const KEYS_TO_FILTERS = ["email", "name", "nickname"];

const style = {
  margin: 12
};
const header = {
  textAlign: "center"
};

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: greenA400,
    accent1Color: red500
  },
  toggle: {
    thumbOnColor: "yellow",
    trackOnColor: "red",
    backgroundColor: "red"
  },
  appBar: {
    height: 50
  }
});

let users = [];
@observer
export default class FindFriends extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchTerm: "",
      openDelete: false
    };

    this._handleClick = this._handleClick.bind(this);
  }
  handleDeleteClose = () => {
    this.setState({
      snackbarsendreq: false
    });
  };
  componentDidMount() {
    let userid = localStorage.getItem("userid");

    $.ajax({
      type: "GET",
      url: "/api/userall"
    })
      .done(function(data) {
        users = data;
        var index = users.findIndex(function(o) {
          return o.user_id === userid;
        });
        users.splice(index, 1);
        UserStore.allUsers = users;
        var array = [];
        var secondarray = [];
        users.forEach(function(a) {
          for (var i = 0; i < FriendshipStore.myfriendslist.length; i++) {
            if (
              a.user_id == FriendshipStore.myfriendslist[i].other_id ||
              a.user_id == FriendshipStore.myfriendslist[i].user_id
            ) {
              array[i] = a.user_id;
              secondarray[i] = {
                picture: a.picture,
                name: a.name,
                user_id: a.user_id
              };
            } else {
            }
          }
        });

        FriendshipsStore.mappedFriends = secondarray;
        array.forEach(function(a) {
          for (var i = 0; i < users.length; i++) {
            if (a == UserStore.allUsers[i].user_id) {
              UserStore.allUsers[i].nickname = "bla";
            }
          }
        });

        UserStore.flisty = true;
      })
      .fail(function(jqXhr) {});
  }
  _handleRemove(user) {
    this.setState({ openDelete: true });
    var data = {
      other_id: user.user_id,
      user_id: UserStore.obj.user_id
    };
    FriendshipStore.findremovefriend = data;
  }

  handleDeleteClose = () => {
    this.setState({ openDelete: false });
  };

  handleUnfriend = () => {
    var data = FriendshipStore.findremovefriend;

    for (var i = 0; i < UserStore.allUsers.length; i++) {
      if (UserStore.allUsers[i].user_id == data.other_id) {
        UserStore.allUsers[i].nickname = "";
      } else {
      }
    }
    socket.emit("unfriend user", data);

    socket.on("return remain users", function(data) {
      var users = UserStore.allUsers;

      FriendshipsStore.myfriendslist = data;
      var friendlistcount = Object.keys(data).length;
      FriendshipsStore.friendlistcount = friendlistcount;
      var userid = UserStore.obj.user_id;
      var index = users.findIndex(function(o) {
        return o.user_id === userid;
      });
      users.splice(index, 1);
      var array = [];
      users.forEach(function(a) {
        for (var i = 0; i < FriendshipStore.myfriendslist.length; i++) {
          if (
            a.user_id == FriendshipStore.myfriendslist[i].other_id ||
            a.user_id == FriendshipStore.myfriendslist[i].user_id
          ) {
            array[i] = a.user_id;
          } else {
          }
        }
      });
      array.forEach(function(a) {
        for (var i = 0; i < users.length; i++) {
          if (a == UserStore.allUsers[i].user_id) {
            UserStore.allUsers[i].nickname = "bla";
          }
        }
      });
    });
    this.setState({ openDelete: false });
  };

  _handleClick(user) {
    let realuserid = localStorage.getItem("userid");
    this.setState({ snackbarsendreq: true });

    var data = {
      user_id: realuserid,
      status: "pending",
      picture: user.picture,
      user_picture: UserStore.obj.picture,
      other_id_name: user.name,
      user_id_name: UserStore.userrealname,
      other_id: user.user_id
    };

    $.ajax({
      type: "POST",
      url: "/api/user/friendrequest",
      data: data
    })
      .done(function(data) {})
      .fail(function(jqXhr) {});
  }

  searchUpdated(term) {
    this.setState({ searchTerm: term });
  }
  render() {
    const filteredEmails = UserStore.allUsers.filter(
      createFilter(this.state.searchTerm, KEYS_TO_FILTERS)
    );
    const actionsDelete = [
      <RaisedButton
        label="Cancel"
        onTouchTap={this.handleDeleteClose}
        style={style}
      />,
      <RaisedButton
        label="Unfriend the User"
        secondary={true}
        onTouchTap={this.handleUnfriend}
      />
    ];
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <div className="row">
            <div className="columns medium-8 large-8 small-centered">
              <br />
              <h3 style={header}>Find Friends</h3>
              <br />

              <div>
                <SearchInput
                  className="search-input"
                  onChange={this.searchUpdated.bind(this)}
                />
                <br />
                <Dialog
                  title="Unfriend the User"
                  actions={actionsDelete}
                  modal={false}
                  open={this.state.openDelete}
                  onRequestClose={this.handleDeleteClose}
                >
                  Are you sure you want to Unfriend? This action cannot be
                  reversed.
                </Dialog>
                <Snackbar
                  open={this.state.snackbarsendreq}
                  message="A friendship request has been sent"
                  autoHideDuration={2500}
                  onRequestClose={this.handleRequestClose}
                />
                <Scrollbars
                  style={{ height: 380 }}
                  renderTrackHorizontal={props => (
                    <div
                      {...props}
                      className="track-horizontal"
                      style={{ display: "none" }}
                    />
                  )}
                  renderThumbHorizontal={props => (
                    <div
                      {...props}
                      className="thumb-horizontal"
                      style={{ display: "none" }}
                    />
                  )}
                >
                  {filteredEmails.map(user => {
                    if (user.nickname == "bla") {
                      return (
                        <List key={user.user_id}>
                          <div className="mail" key={user.user_id}>
                            <div />
                            <ListItem
                              key={user.user_id}
                              disabled={true}
                              leftAvatar={
                                <Avatar size={80} src={user.picture} />
                              }
                              rightIconButton={
                                <RaisedButton
                                  label={"Remove Friend"}
                                  key={user.user_id}
                                  onTouchTap={() => this._handleRemove(user)}
                                  style={style}
                                />
                              }
                            >
                              <div className="searchContent" key={user.user_id}>
                                <div className="subject">
                                  <Badge
                                    badgeContent={<NotificationsIcon />}
                                    primary={true}
                                  >
                                    {user.name}
                                  </Badge>
                                </div>

                                <br />
                                <div className="from">{}</div>
                                <br />
                                <div className="subject">{}</div>
                              </div>
                            </ListItem>
                          </div>
                        </List>
                      );
                    } else {
                      return (
                        <List key={user.user_id}>
                          <div className="mail" key={user.user_id}>
                            <ListItem
                              key={user.user_id}
                              disabled={true}
                              leftAvatar={
                                <Avatar size={80} src={user.picture} />
                              }
                              rightIconButton={
                                <RaisedButton
                                  label={"Add Friend"}
                                  primary={true}
                                  key={user.user_id}
                                  onTouchTap={() => this._handleClick(user)}
                                  style={style}
                                />
                              }
                            >
                              <div className="searchContent" key={user.user_id}>
                                <div className="subject">{user.name}</div>
                                <br />
                                <div className="from">{}</div>
                                <br />
                                <div className="subject">{}</div>
                              </div>
                            </ListItem>
                          </div>
                        </List>
                      );
                    }
                  })}
                </Scrollbars>
              </div>
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}
