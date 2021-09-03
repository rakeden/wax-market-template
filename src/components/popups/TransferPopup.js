import React, {useState} from 'react';
import cn from "classnames";
import PopupButton from './PopupButton';
import PopupContent from './PopupContent';

import ErrorMessage from "./ErrorMessage";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import config from "../../config.json";

function TransferPopup(props) {
    const asset = props['asset'];

    const {collection, schema, name, data, asset_id} = asset;

    const image = data['img'] ? data['img'].includes(
        'http') ? data['img'] : config.ipfs + data['img'] : '';

    const video = data['video'] ? data['video'].includes(
        'http') ? data['video'] : config.ipfs + data['video'] : '';

    const ual = props['ual'] ? props['ual'] : {'activeUser': null};
    const activeUser = ual['activeUser'];

    const callBack = props['callBack'];
    const [receiver, setReceiver] = useState('');
    const [memo, setMemo] = useState('');

    const userName = activeUser ? activeUser['accountName'] : null;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const closeCallBack = props['closeCallBack'];

    const transfer = async () => {
        if (!receiver)
            return;
        closeCallBack();
        setIsLoading(true);

        try {
            await activeUser.signTransaction({
                actions: [{
                    account: 'atomicassets',
                    name: 'transfer',
                    authorization: [{
                        actor: userName,
                        permission: activeUser['requestPermission'],
                    }],
                    data: {
                        from: userName,
                        memo: memo,
                        asset_ids: [asset.asset_id],
                        to: receiver
                    },
                }]
            }, {

                expireSeconds: 300, blocksBehind: 0,
            });
            callBack({transferred: true, receiver: receiver});
        } catch (e) {
            callBack({transferred: false, error: e.message});
            console.log(e);
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const cancel = () => {
        callBack({transferred: false, receiver: null, offer: 0});
        closeCallBack();
    };

    const changeReceiver = (e) => {
        const val = e.target.value;
        setReceiver(val.trim().toLowerCase());
    };

    const changeMemo = (e) => {
        const val = e.target.value;
        setMemo(val);
    };

    return (
        <div className={cn(
            'fixed top-40 left-popup',
            'w-full max-w-popup lg:max-w-popup-lg h-auto',
            'p-3 lg:p-8 m-0',
            'text-sm text-neutral font-light opacity-100',
            'bg-paper rounded-xl shadow-lg z-40',
            'backdrop-filter backdrop-blur-lg',
        )}>
            <img className="absolute z-50 cursor-pointer top-4 right-4 w-4 h-4" onClick={cancel} src="/close_btn.svg" alt="X" />
            <div className="text-3xl text-center">{name}</div>
            <PopupContent image={image} video={video} collection={collection['name']} schema={schema['schema_name']} />
            <div className="text-lg text-left my-4">
                {`Are you sure you want to transfer ${name} to ${receiver}?`}
            </div>
            {
                error ? <ErrorMessage error={error} /> : ''
            }
            <div className={cn(
                'relative l-0 m-auto h-20 lg:h-8',
                'flex justify-evenly flex-wrap lg:justify-end'
            )}>
                <div className="EditContainer">
                    <input className={"SellInput Memo"} type="text" onChange={changeReceiver} value={receiver ? receiver : ''} placeholder={'Receiver'}/>
                </div>
                <div className="EditContainer">
                    <input className={"SellInput Memo"} type="text" onChange={changeMemo} value={memo ? memo : ''} placeholder={'Memo'}/>
                </div>
                <div className={cn(
                    'relative l-0 m-auto h-20 lg:h-8',
                    'flex justify-evenly flex-wrap lg:justify-end'
                )}>
                    <PopupButton text="Cancel" onClick={cancel} className="text-neutral bg-paper border-neutral" />
                    <PopupButton text="Transfer" onClick={transfer} disabled={!receiver} />
                </div>
            </div>

            {isLoading ? <div className="absolute t-0 l-0 w-full h-full backdrop-filter backdrop-blur-md">
                <LoadingIndicator text="Loading Transaction"/>
            </div> : '' }
        </div>
    );
}

export default TransferPopup;
