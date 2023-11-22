import React from 'react';
import { Layout, Row, Col, Button, Spin, List, Checkbox } from "antd";
import './App.css';
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { Provider, Network } from "aptos";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import {useEffect,useState} from "react";

// const provider = new Provider(Network.DEVNET);

type CountHolder = {
  count: number;
};

function App() {
  const { account, signAndSubmitTransaction} = useWallet();
  const [count, setCount] = useState<number>(0);
  const [transactionInProgress, setTransactionInProgress] =
    useState<boolean>(false);
  const [accountHasHolder, setAccountHasHolder] = useState<boolean>(false);

  const fetchHolder = async () => {
    if (!account) return [];
    try {
      const CountHolderResource = await provider.getAccountResource(
        account.address,
        `${moduleAddress}::counter::CountHolder`
      );
      setAccountHasHolder(true);
      setCount((CountHolderResource as any).data.count);
    } catch (e: any) {
      setAccountHasHolder(false);
    }
  };

  useEffect(() => {
    fetchHolder();
  }, [account?.address]);

  async function updateCount() {
    fetchHolder();
    // setCount(count + 1);
    if (!account) return [];
    setTransactionInProgress(true);
    const payload = {
      type: "entry_function_payload",
      function: `${moduleAddress}::counter::click`,
      type_arguments: [],
      arguments: [],
    };
    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(payload);
      // wait for transaction
      await provider.waitForTransaction(response.hash);
      setAccountHasHolder(true);
    } catch (error: any) {
      setAccountHasHolder(false);
    } finally {
      setTransactionInProgress(false);
    }
  }
  
  return (
    <>
      <Layout>
        <Row align="middle">
          <Col span={10} offset={2}>
            <h1>
              Total Clicks: {count}
            </h1>
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
                  }}
                >
                  CLICK ME
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Layout>
    </>
  );
}

export const provider = new Provider(Network.DEVNET);
export const moduleAddress =
  "0xc86b5f2d9339bed8229d9168ef70dba4c805ed1acd5b2aeb2d2e1c6943fb109c";
export default App;
