import server from "./server";


const userWallets = [
  "0x761FA1653fc7FddCAa7aeAB09b830C06e0C2919a",
  "0xcea95759B4bE7EE93914906A9AE6C9db6322b481",
  "0x3Ce27Eb0E35f77Ff40757789B889Bda82cEa7b38",  
]

function Wallet({ address, setAddress, balance, setBalance }) {
  
  async function onChange(evt) {
    const address = evt.target.value;
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  async function onSelectedWallet(evt) {
    const address = evt.target.value;
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <select onChange={onSelectedWallet} value={address}>
          <option value="">--- choose your wallet ---</option>
          { userWallets.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>

      {/* <label>
        Wallet Address
        <input placeholder="Type an address, for example: 0x1" value={address} onChange={onChange}></input>
      </label> */}

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
