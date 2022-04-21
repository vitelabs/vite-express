import QRCode from "qrcode.react";

export class User {
  address?: string;
  age: number;
  uri?: string;

  constructor() {
    this.age = 0;
  }

  inc = () => {
    console.log("inc age before" + this.age);
    this.age = this.age + 1;
    console.log("inc age after" + this.age);
    return this;
  };

  setUri = (uri: string) => {
    this.uri = uri;
  };

  login = (session: any) => {
    this.address = session.accounts[0];
  };
  logout = () => {
    this.address = undefined;
    this.uri = undefined;
  };

  ok = () => {
    return this.address && true;
  };
}

function OnlineUser(props: { user: User; logout: any }) {
  return (
    <div>
      <p>{props.user.address}</p>
      <button type="button" onClick={props.logout}>
        Logout
      </button>
    </div>
  );
}

function OfflineUser(props: { user: User; login: any }) {
  return (
    <div>
      {!props.user.uri && (
        <button type="button" onClick={props.login}>
          Connect
        </button>
      )}

      {props.user.uri && <QRCode value={props.user.uri} />}
    </div>
  );
}

export function UserInfo(props: { user: User; login: any; logout: any }) {
  if (props.user.address) {
    return <OnlineUser user={props.user} logout={props.logout} />;
  }
  return <OfflineUser user={props.user} login={props.login} />;
}
