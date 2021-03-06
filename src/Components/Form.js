import React from "react";
import TextField from "material-ui/TextField";
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import Dialog from "@material-ui/core/Dialog/Dialog";
import Map from "collections/map";


export default class Form extends React.Component {

    static user = "soap-lover17";
    map = new Map();
    static balance = 0;
    static cryptoBal = 0;

    componentDidMount() {
        this.usernameInput();
        this.map = this.currentPrice();
    }

    componentWillMount() {
        this.map.add("BTC", 3855.15832672);
        this.map.add("ETH", 154.212772221);
        this.map.add("TRX", 0.0216297193366);
        this.map.add("MIOTA", 0.376894697331);
        this.map.add("LTC", 32.3408920678);
        this.map.add("XRP", 0.35803435642);
        this.map.add("XLM", 0.115525502213);
        this.map.add("BCH", 161.540193458);
    }

    handleClose = () => {

        if (this.state.inputname.toLowerCase() === "socketboy12" ||
            this.state.inputname.toLowerCase() === "rmi_king" ||
            this.state.inputname.toLowerCase() === "soap-lover17" ||
            this.state.inputname.toLowerCase() === "rest_is_the_best") {
            this.setState({open: false});
            this.setState({username: this.state.inputname});
            Form.user = this.state.inputname;
        }
        this.setState({error: false});
    };

    logOut = () => {
        this.setState({open: true, username: "", inputname: ""});
    };

    state = {
        id: "1",
        open: true,
        error: false,
        username: "",
        inputname: "",
        coin: "BTC",
        quantity: "",
        value: "",
        price: "n",
    };

    change = e => {
        this.setState({
            [e.target.name]: e.target.value
        });

    };

    login = e => {
        this.setState({inputname: e});
    };

    saveUser = e => {
        Form.user = e;
        fetch('http://localhost:8761/user/loginUser?userName=' + e);
        Form.getBalance(Form.user)
    };

    static async getBalance(username) {
        fetch("http://localhost:8761/user/totalBalance?userName=" + username).then(function (response) {
            response.text().then(function (value) {
                Form.balance = value;
            });
        });
    }

    static async getCryptoBalance(username, coin) {
        fetch("http://localhost:8761/user/balance?userName=" + username + "&symbol=" + coin).then(function (response) {
            response.text().then(function (value) {
                Form.cryptoBal = value;
            });
        });
    }


    onSubmit = e => {
        e.preventDefault();
        if (this.state.value > 0) {
                const min = 1;
                const max = 1000;
                const rand = Math.floor(min + Math.random() * (max - min));
                this.state.id = rand;
                fetch('http://localhost:8761/orderbook/sell', {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: rand,
                        seller: this.state.username,
                        buyer: '',
                        coinSymbol: this.state.coin,
                        amountDollar: this.state.value,
                        amountCoin: this.state.quantity,
                    })
                });
                this.props.onSubmit(this.state);
                this.setState({
                    id: "",
                    quantity: "",
                    value: 1
                });
        } else {
            this.setState({error: true})
        }
    };

    render() {
        return (
            <form>
                <div>{this.usernameInput()}</div>
                <div>{this.submitError()}</div>
                <div>{this.logoutButton()}</div>
                <TextField readOnly
                           name="username"
                           floatingLabelText="Username"
                           value={this.state.username}
                           floatingLabelFixed
                />
                <br/>
                <div>{this.displayBalance()}</div>
                <br/>
                <FormControl>
                    <InputLabel>Coin</InputLabel>
                    <Select
                        value={this.state.coin}
                        onChange={e => this.change(e)}
                        onClose={ Form.getCryptoBalance(this.state.username, this.state.coin)}
                        inputProps={{
                            name: 'coin',
                            id: 'coin-id',
                        }}
                    >
                        <MenuItem value="ETH">ETH</MenuItem>
                        <MenuItem value="BTC">BTC</MenuItem>
                        <MenuItem value="TRX">TRX</MenuItem>
                        <MenuItem value="LTC">LTC</MenuItem>
                        <MenuItem value="BCH">BCH</MenuItem>
                        <MenuItem value="MIOTA">MIOTA</MenuItem>D
                        <MenuItem value="XRP">XRP</MenuItem>
                        <MenuItem value="XLM">XLM</MenuItem>
                    </Select>
                </FormControl>
                <div>{this.displayCryptoBal()}</div>
                <br/>
                <TextField
                    name="quantity"
                    type="number"
                    required
                    hintText="Amount to Sell"
                    floatingLabelText="Quantity"
                    autoComplete="off"
                    value={this.state.quantity}
                    onChange={e => this.change(e)}
                    floatingLabelFixed
                />
                <br/>
                <TextField
                    name="value"
                    floatingLabelText="Value"
                    value={this.state.value = this.state.quantity * this.getValue()}
                    onChange={e => this.change(e)}
                    floatingLabelFixed
                />
                <br/>
                <Button variant="contained" color="secondary"
                        onClick={e => this.onSubmit(e)}>
                    Sell
                </Button>
            </form>
        );
    }

    getValue() {
        try{
            return this.map.get(this.state.coin);
        }catch (e) {
            switch(this.state.coin) {
                case 'BTC':
                    return 3855.15832672;
                case 'ETH':
                    return 154.212772221;
                case 'TRX':
                    return 0.0216297193366;
                case 'MIOTA':
                    return 0.376894697331;
                case 'LTC':
                    return 32.3408920678;
                case 'XRP':
                    return 0.35803435642;
                case 'XLM':
                    return 0.115525502213;
                case 'BCH':
                    return 161.540193458;
                default:
                    return 0;
            }
        }
    }

    async currentPrice() {
        this.map = await fetch('http://localhost:8761/cmc/coinList')
            .then(function (response) {
                let map2 = new Map();
                response.text().then(text => {
                    const array = text.split("\n");
                    array.pop();
                    for (let i = 0; i < array.length; i++) {
                        map2.add(array[i + 1], array[i]);
                        i++;
                    }
                    return map2;
                });
                return map2;
            });
    }

    usernameInput() {
        if (this.state.open === true) {
            return (
                <div>
                    <Dialog
                        open={this.state.open}
                        onClose={this.handleClose}
                        disableBackdropClick={true}
                        aria-labelledby="form-dialog-title"
                    >
                        <DialogTitle id="form-dialog-title">Login</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Please enter a valid username
                            </DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                value={this.state.inputname}
                                onChange={e => this.login(e.target.value)}
                                onBlur={e => this.saveUser(e.target.value)}
                                label="Username"
                                fullWidth
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        this.saveUser(e.target.value);
                                        this.handleClose();
                                    }
                                }
                                }
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={e => {
                                this.handleClose();
                            }} color="primary">
                                Enter
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            );
        }
    }

    logoutButton() {
        return (
            <div>
                <Button variant="contained"
                        onClick={this.logOut}
                        style={this.pStyle}>
                    Log Out
                </Button>
            </div>
        )
    }

    displayBalance() {
        return (
            <TextField readOnly
                       name="balance"
                       floatingLabelText="Balance (Dollars)"
                       value={Form.balance}
                       onChange={e => this.change(e)}
                       floatingLabelFixed
            />
        )
    }

    displayCryptoBal() {
        return (
            <TextField readOnly
                       name="cryptoBal"
                       floatingLabelText="Balance (Cryptocurrency)"
                       value={Form.cryptoBal}
                       onChange={e => this.change(e)}
                       floatingLabelFixed
            />
        )
    }

    pStyle = {
        position: 'absolute',
        top: 0,
        right: 0
    };

    submitError() {
        return (
            <div>
                <Dialog
                    open={this.state.error}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Error</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Fill in missing values
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}


