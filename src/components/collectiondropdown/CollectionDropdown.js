import React, {useContext, useEffect, useState} from "react";

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import qs from 'qs';
import {Context} from "../marketwrapper";
import {
    createCollectionImageOption,
    createCollectionOption,
    getValues,
} from "../helpers/Helpers";
import LoadingIndicator from "../loadingindicator";
import config from "../../config.json";


const CollectionDropdown = React.memo(props => {
    const values = getValues();

    const [collections, setCollections] = useState(null);
    const [state, dispatch] = useContext(Context);
    const [isLoading, setIsLoading] = useState(false);

    const pushQueryString = props['pushQueryString'];

    const collection = props['collection'];

    const getDefaultOption = () => (
        { value: '', label: '-', title: '-'}
    );

    const initialized = state.collectionData !== null && state.collectionData !== undefined;

    const createCollections = (data, search = '') => {
        const collections = [];

        data.map(
            element => {
                if (!collections.find(a => a.value === element))
                    if (!search || element['name'].toLowerCase().includes(search.toLowerCase()) || element['collection_name'].toLowerCase().includes(
                        search.toLowerCase()))
                        collections.push({
                            value: element['collection_name'],
                            title: element['name'],
                            label: element['name'],
                            image: config.ipfs + element['data']['img']
                        })
            }
        );

        return collections;
    };

    const [collectionDropDownOptions, setCollectionDropDownOptions] = useState(
        collections ? createCollections(collections, false, 'All Collections',
        true) : [getDefaultOption()]);

    const onSearchCollection = (e, collections) => {
        setCollectionDropDownOptions(createCollections(collections, e.target.value))
    };

    const onSelectCollection = (e) => {
        const query = values;

        const newCollection = e ? e.value : '*';

        delete query['schema'];

        query['collection'] = newCollection;

        dispatch({type: 'SET_SELECTED_COLLECTION', payload: newCollection});

        pushQueryString(qs.stringify(query));
    };

    const createCollectionDropDownOptions = (collections) => {
        if (collections && collections['data']) {
            setCollectionDropDownOptions(createCollections(collections['data']['results'], false,
                'All Collections', true));
            setCollections(collections['data']['results']);
        }
    };

    useEffect(() => {
        if (process.browser && !collections && initialized) {
            state.collectionData.then(res => createCollectionDropDownOptions(res));
        }
    }, [collection, state, initialized]);

    const getCollectionOption = (options, collection) => {
        return options.map(item => item.value).indexOf(collection);
    };

    const option = collection && collection !== '*' ? getCollectionOption(collectionDropDownOptions, collection) : -1;

    return !collectionDropDownOptions || collectionDropDownOptions.length > 1 ? (
        <div className="CollectionContainer">
            {collections ? <div
                className="CollectionElement"
            >
                <Autocomplete
                    multiple={false}
                    options={collectionDropDownOptions}
                    getOptionLabel={(option) => option ? option.title : null}
                    renderOption={(option) => (
                        <React.Fragment>
                            { option.image ? createCollectionImageOption(option.title, option.image) : createCollectionOption(option.title) }
                        </React.Fragment>
                    )}
                    defaultValue={option > -1 ? collectionDropDownOptions[option] : null}
                    id="collection-box"
                    style={{ width: '100%' }}
                    popupIcon={null}
                    deactivated={isLoading}
                    onChange={(event, newValue) => {
                        onSelectCollection(newValue);
                    }}
                    onInput={(e) => onSearchCollection(e, collections)}
                    renderInput={(params) =>
                        <div className={option && option > 0 ? "CollectionDropdown" : "CollectionDropdown ChooseCollection"}>
                            <TextField
                                {...params}
                                variant="standard"
                                placeholder={'Collection'}
                            />
                        </div>
                    }
                />
            </div> : <LoadingIndicator/> }
        </div>
    ) : <div></div>;
});

export default CollectionDropdown;
