import React, { useReducer, useEffect } from 'react'
import axios from 'axios'

const ACTIONS = {
    MAKE_REQUEST: 'make-request',
    GET_EVENTS: 'get-events',
    ERROR: 'error'
}

const endpoint = 'http://localhost:5000/api/'

function reducer (state, action) {
    switch (action.type) {
        case ACTIONS.MAKE_REQUEST:
            return {loading: true, events: []}
        case ACTIONS.GET_EVENTS: {
            // let unparsedEvents = action.payload.events.map(event => {
            //     let parsedTime = new Date(event.time)
            //     event.time = moment(parsedTime, "DD.MM.YYYY, HH:MM:SS")
            //     // event.time = `${parsedTime.getDate()}.${parsedTime.getMonth()+1}.${parsedTime.getFullYear()}, ${parsedTime.getHours()}:${parsedTime.getMinutes()}:${parsedTime.getSeconds()}`
            // })
            return {...state, loading: false, events: action.payload.events}
        }
            
        case ACTIONS.ERROR:
            return {...state, loading: false, error: true, events: []}
        default:
            return state
    }

}

export default function useFetchItems(params) {
    const [state, dispatch] = useReducer(reducer, {events: [], loading: true})

    useEffect(() => {
        dispatch({ type: ACTIONS.MAKE_REQUEST })
        axios.get(endpoint+'events/', {
            params: {...params}
        }).then( res => {
            console.log('done')
            dispatch({ type: ACTIONS.GET_EVENTS, payload: { events: res.data } })
        }).catch( e => {
            dispatch({ type: ACTIONS.ERROR, payload: { error: e } })
        })
    }, [])

    return state
}
