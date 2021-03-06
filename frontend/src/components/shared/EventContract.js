import React, { useState, useEffect } from 'react';
import BlockchainProcessIndicator from './BlockchainProcessIndicator';
import ConditionalRender from './ConditionalRender';
import LoadingText from './LoadingText';

function EventContract(props) {

    const [limit, setLimit] = useState(0);
    const [contract, setContract] = useState(null);
    const [isLoaded, setLoaded] = useState(false);
    const [status, setStatus] = useState(0);
    const [indicator, setIndicator] = useState(0);

    if (isLoaded == false) {
        //  init();
        setLoaded(true);
    }

    useEffect(() => {

        console.log(props.limit);

        if (props.limit) {
            setLimit(props.limit)
        }
        if (props.status) {
            setStatus(props.status)
        }
        if (props.contract) {
            setContract(props.contract);
        }
    });


    async function open() {
        // chesk status first
        let status = await contract.methods.openEvent().send()
            .on('transactionHash', (transactionHash) => {
                console.log(transactionHash);
                setIndicator(1);
            })
            .on('confirmation', (confirmationNumber, receipt) => {
                console.log(confirmationNumber)
                console.log(receipt)
                setIndicator(2);
                if (confirmationNumber >= 4) {
                    setIndicator(3);
                    setTimeout(() => {
                        setIndicator(0);
                        props.reloadEvent();
                    }, 1000);
                }
            });
        console.log(status);
    }

    async function close() {
        // chesk status first
        let status = await contract.methods.closeEvent().send()
            .on('transactionHash', (transactionHash) => {
                console.log(transactionHash);
                setIndicator(1);
            })
            .on('confirmation', (confirmationNumber, receipt) => {
                console.log(confirmationNumber)
                console.log(receipt)
                setIndicator(2);
                if (confirmationNumber >= 4) {
                    setIndicator(3);
                    setTimeout(() => {
                        setIndicator(0);
                        props.reloadEvent();
                    }, 1000);
                }
            });
        console.log(status);

    }

    async function disburse() {
        // chesk status first
        let status = await contract.methods.disburse().send()
            .on('transactionHash', (transactionHash) => {
                console.log(transactionHash);
                setIndicator(1);
            })
            .on('confirmation', (confirmationNumber, receipt) => {
                console.log(confirmationNumber)
                console.log(receipt)
                setIndicator(2);
                if (confirmationNumber >= 4) {
                    setIndicator(3);
                    setTimeout(() => {
                        setIndicator(0);
                        props.reloadEvent();
                    }, 1000);
                }
            });
        console.log(status);

    }

    return (
        <div>
            <ConditionalRender when={props && !props.fetched}>
                <LoadingText />
            </ConditionalRender>
            <ConditionalRender when={props && props.fetched}>
                <ConditionalRender when={props && !props.disbursed}>
                    <div className="alert alert-warning">
                        These are administrative functions, please be careful.
                    </div>
                </ConditionalRender>


                <BlockchainProcessIndicator status={indicator} />
                <br />
                <ConditionalRender when={props && props.disbursed}>
                    <div className="alert alert-success">
                        Event already closed & disbursed.
                    </div>
                </ConditionalRender>
                <ConditionalRender when={props && !props.disbursed}>
                    <div className="form">

                        {status == 0 &&
                            <div className="form-group">
                                <span className="bold">Open</span>
                                <div>
                                    <span className="text-muted">Open event (participant can register)</span>
                                </div>
                                <br />
                                <div className="alert alert-success">
                                    To successfully open the event, please send some EVT to <strong>{props.eventAddr}</strong>
                                </div>
                                <br />
                                <div>
                                    <button disabled={indicator !== 0} className="btn btn-primary" onClick={() => open()}>Open</button>
                                </div>
                            </div>
                        }

                        {status == 1 &&
                            <div className="form-group">
                                <span className="bold">Close</span>
                                <div>
                                    <span className="text-muted">Close event (participant cannot register)</span>
                                </div>
                                <br />
                                <div>
                                    <button disabled={indicator !== 0} className="btn btn-primary" onClick={() => close()}>Close</button>
                                </div>
                            </div>
                        }

                        {status == 2 &&
                            <div className="form-group">
                                <span className="bold">Disburse</span>
                                <div>
                                    <span className="text-muted">Send Rewards to Users.</span>
                                </div>
                                <br />
                                <div>
                                    <button disabled={indicator !== 0} className="btn btn-primary" onClick={() => disburse()}>Disburse</button>
                                </div>
                            </div>
                        }
                        { status <= 0 &&
                        <div className="form-group">
                            <span className="bold">Set Limit</span>
                            <div>
                                <span className="text-muted">set the limit of how many participant can register</span>
                            </div>
                            <br />
                            <div>
                                <input type="number" className="form-control col-4" value={limit} onChange={e => setLimit(e.target.value)} />
                                <br />
                                <button disabled={indicator !== 0} className="btn btn-primary">Set Limit</button>
                            </div>
                        </div>
                        }
                    </div>
                </ConditionalRender>

            </ConditionalRender>

        </div>
    )

    // async function init(){
    //     try{
    //         let web3Instance = await connector.getWeb3(window);
    //         setWeb3(web3Instance);
    //     }catch(err){
    //         window.alert(err);
    //         return;
    //     }

    //     let abi = Abi;

    //     // Retrieve the byte code
    //     const coinbase = await web3.eth.getCoinbase();

    //     let myContractInstance = new web3.eth.Contract(abi,'0xac9e53c9062a6c128c747579990a522cb1945a64',{from:coinbase});
    //     setMyContract(myContractInstance);

    //     //let register = await myContract.methods.register('andika','andika').send();
    //     let eventName = await myContract.methods.eventName.call();
    //     console.log(eventName);
    //     let status = await myContract.methods.status.call();
    //     console.log(status);
    //     let rewards = await myContract.methods.rewards().call();
    //     console.log(rewards);

    //     let participants = await myContract.methods.getParticipants().call();
    //     console.log(participants);

    // }
}

export default EventContract;