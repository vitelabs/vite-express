import React from "react";
import "./App.css";

import Connector from "@vite/connector";

import { ViteAPI, accountBlock } from "@vite/vitejs";
import coffeeABI from "./contract/coffee_abi.json";
import coffeeContract from "./contract/coffee_contract.json";
import { BuyCoffeeRecords } from "./BuyCoffeeRecords";
import { BuyCoffee } from "./BuyCoffee";
import { UserInfo, User } from "./UserInfo";
const { HTTP_RPC } = require("@vite/vitejs-http");

type AppProps = {};

type AppState = {
  connectURI: string;
  user: User;
};

type Contract = {
  address: string;
  abi: any[];
  provider: any;
};

class App extends React.Component<AppProps, AppState> {
  user: User;
  vc: any;
  contract: Contract;
  beneficiaryAddress: string;
  provider: any;

  constructor(props: any) {
    super(props);
    this.user = new User();
    this.state = {
      connectURI: "",
      user: this.user,
    };
    this.provider = new ViteAPI(
      new HTTP_RPC(coffeeContract.networkHTTP),
      () => {
        console.log("vite provider connected");
      }
    );

    this.contract = {
      address: coffeeContract.address,
      abi: coffeeABI,
      provider: this.provider,
    };
    this.beneficiaryAddress = window.location.pathname.substring(1);

    console.log("app created");
  }

  login = async () => {
    this.vc = new Connector({ bridge: coffeeContract.bridgeWS });
    await this.vc.createSession();
    const uri = this.vc.uri;

    console.log("uri", uri);

    this.user.setUri(uri);
    this.setState({ user: this.user });

    this.vc.on("connect", (err: any, payload: any) => {
      // vcInstance can start prompting transactions on the user's Vite wallet app
      console.log("WalletConnector.connect", err, payload, this.vc.session);

      this.user.login(this.vc.session);
      this.setState({ user: this.user });
    });

    this.vc.on("disconnect", (err: any, payload: any) => {
      console.log("WalletConnector.disconnect", err, payload);
      // User's Vite wallet app is no longer connected
      this.user.logout();
      this.setState({ user: this.user });

      this.vc.stopBizHeartBeat();
    });
  };

  logout = async () => {
    await this.vc.killSession();
    await this.vc.destroy();
  };

  buy = async (name: string, num: number) => {
    if (!this.beneficiaryAddress) {
      alert("Please confirm beneficiary Address");
      return;
    }
    console.log(name, num);

    const methodName = "buyCoffee";
    const methodAbi = this.contract.abi.find(
      (x: any) => x.name === methodName && x.type === "function"
    );
    if (!methodAbi) {
      throw new Error(`method not found: ${methodName}`);
    }

    const viteTokenId = "tti_5649544520544f4b454e6e40";
    const viteValue = 10n ** 18n * BigInt(num);

    const block = await accountBlock.createAccountBlock("callContract", {
      address: this.user.address,
      abi: methodAbi,
      toAddress: this.contract.address,
      params: [this.beneficiaryAddress, num.toString()],
      tokenId: viteTokenId,
      amount: viteValue.toString(),
    }).accountBlock;

    console.log("xxxxxxxxx", block);

    console.log(this.print({ block }));

    const result = await new Promise((resolve, reject) => {
      this.vc.on("disconnect", () => {
        reject({ code: 11020, message: "broken link" });
      });

      this.vc
        .sendCustomRequest({
          method: "vite_signAndSendTx",
          params: [{ block }],
        })
        .then((r: any) => {
          resolve(r);
        })
        .catch((e: any) => {
          reject(e);
        });

      // this.vc
      //   .sendCustomRequest({ method: "vite_signMessage", params: [{ "message": "aGVsbG8gd29ybGQ=" }] })
      //   .then((r: any) => {
      //     resolve(r);
      //   })
      //   .catch((e: any) => {
      //     reject(e);
      //   });
    });

    console.log(result);

    return;
  };

  print = (...args: any[]) => {
    console.log(args);
  };
  render() {
    // let { viteAddress } = useParams();

    // console.log("vite address", this.props.match.params.viteAddress);
    // const Wrapper = (props:any) => {
    //   const params = useParams();
    //   console.log("params", params);
    //   return <div><p>My Vite Address is: {params.viteAddress}</p></div>;
    // }
    return (
      <div className="App" id="appElement">
        <header className="App-header">
          <h1>Buy me a coffee</h1>

          {/* <p>My Vite Address is: {this.props.match.params.id}</p> */}
          <p>My Vite Address is: {this.beneficiaryAddress}</p>
          {/* <Wrapper></Wrapper> */}
          <UserInfo
            user={this.state.user}
            login={this.login}
            logout={this.logout}
          />
          <BuyCoffee buy={this.buy} user={this.state.user} />

          <BuyCoffeeRecords contract={this.contract}></BuyCoffeeRecords>
        </header>
      </div>
    );
  }
}

export default App;
