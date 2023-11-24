import React from 'react';
import { Layout, Row, Col, Button, Spin, List, Checkbox } from "antd";
import './App.css';
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { Provider, Network } from "aptos";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import {useEffect,useState} from "react";
// import * as child from "child_process";


type CountHolder = {
  count: number;
};

function App() {
  const { account, signAndSubmitTransaction} = useWallet();
  const [count, setCount] = useState<number>(0);
  const [temp, setTemp] = useState<any>(" ");
  const [transactionInProgress, setTransactionInProgress] =
    useState<boolean>(false);
  const [accountHasHolder, setAccountHasHolder] = useState<boolean>(false);

  const fetchHolder = async () => {
    if (!account) return [];
    try {
      const CountHolderResource = await provider.getAccountResource(
        account.address,
        `${account.address}::counter::CountHolder`
      );
      setAccountHasHolder(true);
      setCount((CountHolderResource as any).data.count);
      setTemp((CountHolderResource as any).data);
    } catch (e: any) {
      setAccountHasHolder(false);
    }
  };

  useEffect(() => {
    fetchHolder();
  }, [account?.address]);

  var intervalId = window.setInterval(function () {
    fetchHolder();
  }, 5000);
  
  async function updateCount() {
    fetchHolder();
    if (!account) return [];
    setTransactionInProgress(true);
    // child.exec(`./aptos move run --function-id "default::counter::click"`);
    const payload = {
      type: "entry_function_payload",
      function: `${account.address}::counter::click`,
      type_arguments: [],
      arguments: [],
    };
    try {
      const response = await window.aptos.signAndSubmitTransaction(payload);
      await provider.waitForTransaction(response.hash);
      setAccountHasHolder(true);
    } finally {
      setTransactionInProgress(false);
    }
  }
  
  return (
    <>
      <Layout>
        <Row align="middle">
          <Col span={10} offset={2}>
            <h1>Total Clicks: {count}</h1>
          </Col>
          <Col span={12} style={{ textAlign: "right", paddingRight: "100px" }}>
            <WalletSelector />
          </Col>
          <Col
            span={12}
            offset={10}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingRight: "400px",
            }}
          >
            <Row gutter={[0, 0]}>
              <Col span={8} offset={0}>
                {account ? (
                  <Button
                    className="clickBtn"
                    onClick={updateCount}
                    block
                    type="primary"
                    style={{
                      backgroundColor: "red",
                      height: "150px",
                      width: "150px",
                      borderRadius: "50%",
                      marginLeft: "-3rem",
                      marginTop: "-2rem",
                      marginBottom: "2rem",
                    }}
                  >
                    CLICK ME
                  </Button>
                ) : (
                  <Button
                    className="clickBtn"
                    block
                    type="primary"
                    style={{
                      backgroundColor: "red",
                      height: "150px",
                      width: "150px",
                      borderRadius: "50%",
                      marginLeft: "-3rem",
                      marginTop: "-2rem",
                      marginBottom: "2rem",
                      cursor:"not-allowed",
                      opacity:"0.75"
                    }}
                  >
                    CONNECT WALLET
                  </Button>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </Layout>
    </>
  );
}

export const provider = new Provider(Network.DEVNET);
export default App;
