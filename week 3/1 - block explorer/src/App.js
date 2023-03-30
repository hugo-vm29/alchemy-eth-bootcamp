import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { useEffect, useState , useCallback} from 'react';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import './App.css';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};


const useStyles = () => ({
  mainContainer:{
    display: 'flex',
    minHeight: '100vh',
    paddingLeft: 0,
    flexDirection: "column"
  },
  contentWrapper:{
    paddingLeft: 0,
    background: "#fafbfd",
    padding: "1rem",
    width: "100%",
    flexGrow: 1
  }
});


// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {

  let startTime = new Date();

  const styles = useStyles();
  const [latestBlocks, setLatestBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedBlockTnxs, setSelectedBlockTnxs] = useState([]);

  const getBlockNumber = useCallback(async () => {
    try {
     const latestBlockNum= await alchemy.core.getBlockNumber();

     const dashboardBlocks = [];
     //const latestBlock = await alchemy.core.getBlockWithTransactions(latestBlockNum);
     //dashboardBlocks.push(latestBlock);

     for(let i = latestBlockNum; i >= latestBlockNum-5  ;i--){
      const currentBlock = await alchemy.core.getBlock(i);
      dashboardBlocks.push(currentBlock);
     }

     console.log("dashboardBlocks",dashboardBlocks);
     setLatestBlocks(dashboardBlocks);
     setLoading(false);

     //setBlockNumber(currentBlock);
    } catch (err) {
      console.log("An error have ocurred", err);
    }
  }, []);

  useEffect(() => {
    getBlockNumber();
  },[getBlockNumber]);

  const getSecondsDiff = (timestamp) => {

    var endTime = new Date(timestamp * 1000);
    var timeDiff = startTime - endTime; //in ms
    timeDiff /= 1000;
    // get seconds 
    var seconds = Math.round(timeDiff);
    //console.log(seconds + " seconds");
    return seconds;
  }

  const clickBlock = async (blockItem) => {

    setSelectedBlockTnxs([]);
    setSelectedBlock(blockItem.number);
    const latestTransactions = [];
    
    for(let i = 0; i < 6;i++){
      const txn = await alchemy.transact.getTransaction(blockItem.transactions[i]);
      latestTransactions.unshift(txn);
    }
    setSelectedBlockTnxs(latestTransactions);
    console.log("latestTransactions",latestTransactions);
  }

  const formatAddress = address => {
    try {
      if (!address) return '';
      return `${address.slice(0, 6)}...${address.slice(-8)}`;
    } catch (err) {
      return '';
    }
  };

  return (
    <Container fluid style={styles.mainContainer}>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand style={{paddingLeft: "1em"}}>Sample BlockExplorer</Navbar.Brand>
      </Navbar>
       <Container fluid style={styles.contentWrapper}>
        <Row>
          <Col>
             <Card
              bg="light"
              text="dark"
              className="mb-4"
              style={{minHeight:"30rem"}}
              >
                <Card.Header>Latest Blocks</Card.Header>
                  <Card.Body>
                  { loading || latestBlocks.length === 0 ? 
                      <Card.Text style={{fontStyle:"italic"}}>...loading</Card.Text>
                    :
                    latestBlocks.map( (blockItem, idx) => { 
                      //var blockDate = new Date(blockItem.timestamp * 1000);
                      //console.log("blockDate",blockDate);
                      return(
                        <div key={idx}>
                          <div  className='row'>
                            <div className='col-md-4'>
                              <Button variant="link" onClick={ () => clickBlock(blockItem)} style={{padding:0}}>{blockItem.number}</Button>
                              <p style={{fontSize:"14px"}}>{ getSecondsDiff(blockItem.timestamp) } seconds ago</p>
                            </div>
                            <div className='col-md-8'>
                              <p style={{marginBottom: 0}}><strong> Miner: </strong> {blockItem.miner} </p>
                              <p style={{marginBottom: 0}}> <strong> Total transactions: </strong> {blockItem.transactions.length} </p>
                            </div>
                          </div>
                        { idx < latestBlocks.length-1 &&
                          <hr/>
                        }
                        </div>
                      );
                    })
                  }
                </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card
              bg="light"
              text="dark"
              className="mb-4"
              style={{minHeight:"30rem"}}
              >
              <Card.Header> 
                { selectedBlock ? 
                  <h6> Latest transactions for Block #{selectedBlock}</h6>
                  :
                  <span style={{fontSize:"0.8rem", fontStyle: "italic"}}>select a block...</span>
                }
              </Card.Header>
              <Card.Body>
                {
                  selectedBlockTnxs.map( ( transactionItem , idx) => {
                    
                    let formattedWei = Utils.formatUnits( transactionItem.value , "ether"); 

                    return(
                      <div key={idx}>
                        <div  className='row'>
                          <div className='col-md-6'>
                           <Button variant="link" onClick={ () => {}} style={{padding:0}}>
                             { `${transactionItem.hash.slice(0, 15)}...`}
                           </Button>
                            <p style={{fontSize:"14px"}}>{ formattedWei } ETH</p>
                          </div>
                          <div className='col-md-6'>
                            <p style={{marginBottom: 0}}><strong> From: </strong> { formatAddress(transactionItem.from)} </p>
                            <p style={{marginBottom: 0}}> <strong> To: </strong> { formatAddress(transactionItem.to) } </p>
                          </div>
                        </div>
                      { idx < latestBlocks.length-1 &&
                        <hr/>
                      }
                      </div>
                    );
                  })
                }
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Container>    
  )
}

export default App;
