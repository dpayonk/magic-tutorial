import Logger from './Logger';
// import { ApolloClient, InMemoryCache } from '@apollo/client';
// import { gql } from '@apollo/client';

class StateStore {
    client: any;
    static SUBSCRIBERS: any;
    static eventKeys: string[] = ['onLogin'];
    constructor() {
        // this.client = new ApolloClient({
        //     uri: 'https://api.whealthy.us/v1/graphql',
        //     cache: new InMemoryCache()
        // });
        this.client = {};
    }
    static subscribe(eventKey: string, callback: any) {
        StateStore.SUBSCRIBERS = StateStore.SUBSCRIBERS || {};
    
        if (StateStore.SUBSCRIBERS[eventKey] !== undefined) {
            StateStore.SUBSCRIBERS[eventKey].push(callback);
        } else {
            StateStore.SUBSCRIBERS[eventKey] = [];
            StateStore.SUBSCRIBERS[eventKey].push(callback);
        }
    }
    static publishEvent(eventKey: string, props: any) {

        Logger.info(`Publishing ${eventKey} with props:`, props);
    
        if (StateStore.SUBSCRIBERS === undefined) {
            Logger.info("There haven't been any registered subscribers", null);
            StateStore.SUBSCRIBERS = StateStore.SUBSCRIBERS || {};
        }
    
        if (StateStore.SUBSCRIBERS[eventKey] !== undefined) {
            StateStore.SUBSCRIBERS[eventKey].forEach(function (callbackFunction: any, index: number) {
                try {
                    let result = callbackFunction(props);
                    Logger.info('Completed publish callback', result);
                } catch (error) {
                    Logger.error(`A subscriber to user updates failed:`, error);
                }
            });
        } else {
            StateStore.SUBSCRIBERS[eventKey] = [];
        }
        return StateStore.SUBSCRIBERS[eventKey].length;
    }

    healthcheck() {
    //     this.client
    //         .query({
    //             query: gql`
    //   query GetRates {
    //     rates(currency: "USD") {
    //       currency
    //     }
    //   }
    // `
    //         })
    //         .then((result: any) => console.log(result));
        console.log("this isn't implemented");
    }

}

export default StateStore