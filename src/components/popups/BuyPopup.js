import React, {useState} from 'react';
import cn from "classnames";
import PopupButton from './PopupButton';
import PopupContent from './PopupContent';
import config from '../../config.json'

import {
    formatNumber
} from '../helpers/Helpers';

import ErrorMessage from './ErrorMessage';
import LoadingIndicator from "../loadingindicator/LoadingIndicator";

function BuyPopup(props) {
    const listing = props['listing'];

    const ual = props['ual'] ? props['ual'] : {'activeUser': null};
    const activeUser = ual['activeUser'];
    const callBack = props['callBack'];
    const closeCallBack = props['closeCallBack'];
    const userName = activeUser ? activeUser['accountName'] : null;
    const [bought, setBought] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const { price, assets, sale_id, seller } = listing;

    const asset = assets[0];

    const {collection, schema, name, data, asset_id} = asset;

    const { token_symbol, median, amount, token_precision } = price;

    const quantity = amount / (Math.pow(10, token_precision));

    const image = data['img'] ? data['img'].includes('http') ? data['img'] : config.ipfs + data['img'] : '';
    const video = data['video'] ? data['video'].includes('http') ? data['video'] : config.ipfs + data['video'] : '';

    const buy = async () => {
        closeCallBack();
        setIsLoading(true);

        try {
            const result = await activeUser.signTransaction({
                actions: [{
                    account: 'eosio.token',
                    name: 'transfer',
                    authorization: [{
                        actor: userName,
                        permission: activeUser['requestPermission'],
                    }],
                    data: {
                        from: userName,
                        to: 'atomicmarket',
                        quantity: `${quantity.toFixed(8)} WAX`,
                        memo: 'deposit'
                    },
                }, {
                    account: 'atomicmarket',
                    name: 'purchasesale',
                    authorization: [{
                        actor: userName,
                        permission: activeUser['requestPermission'],
                    }],
                    data: {
                        buyer: userName,
                        sale_id: sale_id,
                        taker_marketplace: config.market_name,
                        intended_delphi_median: token_symbol === 'USD' && median ? median : 0
                    }
                }]
            }, {
                expireSeconds: 300, blocksBehind: 0,
            });

            setBought(true);
            callBack(true);
        } catch (e) {
            callBack(false, e, asset_id ? asset_id : sale_id);
            setError(e.message);
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };

    const cancel = () => {
        callBack(false);
        closeCallBack();
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
            <div className="text-lg text-center my-4">
                {`Do you want to buy this Item for ${formatNumber(quantity)} WAX`}
            </div>
            {
                error ? <ErrorMessage error={error} /> : ''
            }
            <div className={cn(
                'relative l-0 m-auto h-20 lg:h-8',
                'flex justify-evenly flex-wrap lg:justify-end'
            )}>
                <PopupButton text="Cancel" onClick={cancel} className="text-neutral bg-paper border-neutral" />
                { userName !== seller && !bought ? <PopupButton text="Buy" onClick={buy} /> : '' }
            </div>
            {isLoading ? <div className="absolute t-0 l-0 w-full h-full backdrop-filter backdrop-blur-md">
                <LoadingIndicator text="Loading Transaction" />
            </div> : '' }
        </div>
    );
}

export default BuyPopup;
